#!/usr/bin/env node
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// git pathspec 의 * 는 / 도 넘어가므로 하위 폴더까지 잡힌다.
const REVIEWERS = [
  { agent: "md-reviewer", pathspec: ["*.md", "*.mdx"], target: "md/mdx 문서" },
  {
    agent: "fact-checker",
    pathspec: ["apps/web/src/content/posts/*index.mdx"],
    target: "발행할 블로그 글의 사실 검증",
    onlyPublished: true,
  },
  {
    agent: "blog-content-reviewer",
    pathspec: ["apps/web/src/content/posts/*index.mdx"],
    target: "발행할 블로그 글의 가독성",
    onlyPublished: true,
    after: "fact-checker",
  },
  {
    agent: "fe",
    pathspec: [
      "apps/web",
      "packages",
      "package.json",
      "pnpm-workspace.yaml",
      ".nvmrc",
      ":(exclude)apps/web/src/content/posts",
      ":(exclude)*.md",
    ],
    target: "프런트엔드 코드와 빌드 설정",
    includeDeleted: true,
  },
  {
    agent: "designer",
    pathspec: [
      "apps/web/*.astro",
      "apps/web/*.css",
      "apps/web/*.svg",
      "apps/web/*.png",
      "apps/web/*.jpg",
      "apps/web/*.jpeg",
      "apps/web/*.webp",
      "apps/web/*.ico",
      "packages/*.astro",
      "packages/*.css",
    ],
    target: "화면·스타일·이미지 변경",
  },
];
const GIT_PREFIX = String.raw`^git(\s+-C\s+\S+|\s+-c\s+\S+|\s+--?[\w-]+(=\S+)?)*\s+`;

const git = (...args) => execFileSync("git", args, { encoding: "utf8" });

// 작업 트리가 아니라 staged 내용의 frontmatter 를 본다.
const isPublished = (file) => {
  const frontmatter = git("show", `:${file}`).match(/^---\n([\s\S]*?)\n---/)?.[1] ?? "";
  return !/^draft:\s*true\s*$/m.test(frontmatter);
};

const stagedFiles = ({ pathspec, includeDeleted, onlyPublished }) =>
  git("diff", "--cached", "--name-only", `--diff-filter=ACMR${includeDeleted ? "D" : ""}`, "--", ...pathspec)
    .split("\n")
    .filter(Boolean)
    .filter((file) => !onlyPublished || isPublished(file));

// 삭제된 파일은 ls-files 에 안 나오므로 경로 목록도 함께 해시한다.
const fingerprint = (files) =>
  createHash("sha256")
    .update(files.join("\n"))
    .update(git("ls-files", "--stage", "--", ...files))
    .digest("hex");

const markerPath = (agent) => join(git("rev-parse", "--absolute-git-dir").trim(), `review-pass-${agent}`);

const segments = (command) =>
  command
    .split(/&&|\|\||[;|\n]/)
    .map((s) => s.trim())
    .filter(Boolean);

const isGitSubcommand = (segment, name) => new RegExp(`${GIT_PREFIX}${name}\\b`).test(segment);

function pendingReview(reviewer) {
  const { agent } = reviewer;
  const files = stagedFiles(reviewer);
  if (files.length === 0) return null;
  const marker = markerPath(agent);
  if (existsSync(marker) && readFileSync(marker, "utf8").trim() === fingerprint(files)) return null;
  return files;
}

// 선행 검토가 아직 통과하지 않았으면 이 검토는 받을 수 없다.
const isBlocked = ({ after }) => Boolean(after) && pendingReview(REVIEWERS.find((r) => r.agent === after)) !== null;

function preToolUse(payload) {
  const parts = segments(payload.tool_input?.command ?? "");
  const commits = parts.filter((s) => isGitSubcommand(s, "commit"));
  if (commits.length === 0) return 0;

  const stagesInline = parts.some((s) => isGitSubcommand(s, "add"));
  const commitAll = commits.some((s) => /\s(--all|-[a-zA-Z]*a[a-zA-Z]*)(\s|$)/.test(s));
  if (stagesInline || commitAll) {
    console.error("커밋 검토 게이트: 스테이징과 커밋을 한 명령으로 묶지 마. git add 를 먼저 실행하고 git commit 은 따로 실행해.");
    return 2;
  }

  const pending = REVIEWERS.map((r) => ({ ...r, files: pendingReview(r) })).filter((r) => r.files);
  if (pending.length === 0) return 0;

  const list = (reviewers) =>
    reviewers.flatMap(({ agent, target, files }) => [`[${agent}] ${target}`, ...files.map((p) => `- ${p}`)]);
  const blocked = pending.filter(isBlocked);
  const ready = pending.filter((r) => !isBlocked(r));

  console.error(
    [
      "커밋 검토 게이트: staged 된 파일이 아직 검토를 통과하지 않았어. 아래 서브에이전트에게 각각 파일 목록을 넘겨 검토를 받아.",
      ...list(ready),
      ...(blocked.length
        ? ["아래 검토는 괄호 안 에이전트의 PASS 를 받은 뒤에 받아. 먼저 받으면 PASS 로 기록되지 않아.", ...list(blocked.map((r) => ({ ...r, target: `${r.target} (${r.after} 다음)` })))]
        : []),
      "FAIL 이면 지적 사항을 고치고 다시 git add 한 뒤 재검토를 받아. PASS 를 받은 뒤 staged 내용이 바뀌면 다시 검토해야 해.",
    ].join("\n"),
  );
  return 2;
}

const lastLine = (text) =>
  (text ?? "")
    .split("\n")
    .map((l) => l.trim())
    // 판정을 코드 블록 안에 쓰는 경우가 있어 닫는 펜스는 건너뛴다.
    .filter((l) => l && !/^`{3,}$/.test(l))
    .at(-1) ?? "";

function subagentStop(payload) {
  const reviewer = REVIEWERS.find((r) => r.agent === payload.agent_type);
  if (!reviewer) return 0;

  const marker = markerPath(reviewer.agent);
  const files = stagedFiles(reviewer);
  if (lastLine(payload.last_assistant_message) === "VERDICT: PASS" && files.length > 0 && !isBlocked(reviewer)) {
    writeFileSync(marker, fingerprint(files));
  } else {
    rmSync(marker, { force: true });
  }
  return 0;
}

const payload = JSON.parse(readFileSync(0, "utf8"));
process.chdir(process.env.CLAUDE_PROJECT_DIR || payload.cwd || ".");
process.exit(process.argv[2] === "pre" ? preToolUse(payload) : subagentStop(payload));
