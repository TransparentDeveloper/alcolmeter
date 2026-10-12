#!/usr/bin/env node
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// git pathspec 의 * 는 / 도 넘어가므로 하위 폴더까지 잡힌다.
const REVIEWERS = [
  {
    agent: "md-reviewer",
    pathspec: [
      "*.md",
      "*.mdx",
      ":(exclude)apps/web/src/content/posts/*research.md",
      ":(exclude)apps/web/src/content/posts/*lecture.md",
      ":(exclude)apps/web/src/content/posts/*questions.md",
    ],
    target: "md/mdx 문서",
  },
  {
    agent: "fact-checker",
    pathspec: ["apps/web/src/content/posts/*index.mdx"],
    target: "블로그 글의 사실 검증",
    scoped: true,
  },
  {
    agent: "blog-content-reviewer",
    pathspec: ["apps/web/src/content/posts/*index.mdx"],
    target: "블로그 글의 가독성",
    after: "fact-checker",
    scoped: true,
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
    agent: "blog-designer",
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
      ":(exclude)apps/web/src/content/posts",
    ],
    target: "화면·스타일·이미지 변경",
  },
];
const GIT_PREFIX = String.raw`^git(\s+-C\s+\S+|\s+-c\s+\S+|\s+--?[\w-]+(=\S+)?)*\s+`;

const git = (...args) => execFileSync("git", args, { encoding: "utf8" });

const POST = /^apps\/web\/src\/content\/posts\/.+\/index\.mdx$/;

// 그림 넣기와 draft 해제는 리뷰 대상이 아니므로 draft 줄, 표지 줄, 그림 줄을 뺀 글로 비교한다.
const reviewedText = (text) =>
  text
    .replace(/^draft:.*\n/m, "")
    .replace(/^(cover|coverAlt):.*\n/gm, "")
    .replace(/^!\[.*\]\(.*\)[ \t]*$/gm, "")
    .replace(/^<Figure\b[\s\S]*?\/>[ \t]*$/gm, "")
    .replace(/\n{3,}/g, "\n\n");

const postContent = (file) => reviewedText(git("show", `:${file}`));

const headContent = (file) => {
  try {
    return reviewedText(git("show", `HEAD:${file}`));
  } catch {
    return undefined;
  }
};

// 커밋된 글은 모두 게이트를 통과했으므로 HEAD 와 같은 글은 다시 보지 않는다.
const changedSinceHead = (file) => !POST.test(file) || postContent(file) !== headContent(file);

// 삭제된 파일은 ls-files 에 안 나오므로 경로 목록도 함께 해시한다.
const fingerprint = (files) => {
  const hash = createHash("sha256").update(files.join("\n"));
  const others = files.filter((f) => !POST.test(f));
  if (others.length) hash.update(git("ls-files", "--stage", "--", ...others));
  for (const f of files.filter((f) => POST.test(f))) hash.update(postContent(f));
  return hash.digest("hex");
};

const stagedFiles = ({ pathspec, includeDeleted }) =>
  git("diff", "--cached", "--name-only", `--diff-filter=ACMR${includeDeleted ? "D" : ""}`, "--", ...pathspec)
    .split("\n")
    .filter(Boolean)
    .filter(changedSinceHead);

const gitDir = () => git("rev-parse", "--absolute-git-dir").trim();
const markerPath = (agent) => join(gitDir(), `review-pass-${agent}`);
const snapshotPath = (agent) => join(gitDir(), `review-snapshot-${agent}.json`);

const readSnapshot = (agent) => {
  try {
    return JSON.parse(readFileSync(snapshotPath(agent), "utf8"));
  } catch {
    return {};
  }
};

// 기준본은 이 리뷰어가 마지막으로 PASS 한 내용, 없으면 HEAD 의 내용이다.
const baseline = (agent, file) => {
  const snapshot = readSnapshot(agent)[file];
  if (snapshot !== undefined) return snapshot;
  return headContent(file);
};

const sections = (content) => {
  const [, front = "", body = content] = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/) ?? [];
  const parts = body.split(/^(?=## )/m);
  const intro = parts[0].startsWith("## ") ? "" : parts.shift();
  return [["frontmatter", front], ["도입부", intro], ...parts.map((p) => [p.split("\n")[0].slice(3).trim(), p])];
};

// 구획을 더하거나 빼거나 옮기면 다른 구획의 전제가 깨질 수 있어 전체를 다시 본다.
function reviewScope(agent, file) {
  const before = baseline(agent, file);
  if (before === undefined) return "전체: 첫 검토";
  const [a, b] = [sections(before), sections(postContent(file))];
  if (a.map(([h]) => h).join("\n") !== b.map(([h]) => h).join("\n")) return "전체: h2 구성 변경";
  const changed = b.filter(([, text], i) => a[i][1] !== text).map(([h]) => h);
  return changed.length ? `바뀐 구획: ${changed.join(", ")}` : "전체: 바뀐 구획을 찾지 못함";
}

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
    reviewers.flatMap(({ agent, target, files, scoped }) => [
      `[${agent}] ${target}`,
      ...files.map((p) => (scoped && POST.test(p) ? `- ${p} (${reviewScope(agent, p)})` : `- ${p}`)),
    ]);
  const blocked = pending.filter(isBlocked);
  const ready = pending.filter((r) => !isBlocked(r));

  console.error(
    [
      "커밋 검토 게이트: staged 된 파일이 아직 검토를 통과하지 않았어. 아래 서브에이전트에게 각각 파일 목록을 넘겨 검토를 받아.",
      ...list(ready),
      ...(blocked.length
        ? ["아래 검토는 괄호 안 에이전트의 PASS 를 받은 뒤에 받아. 먼저 받으면 PASS 로 기록되지 않아.", ...list(blocked.map((r) => ({ ...r, target: `${r.target} (${r.after} 다음)` })))]
        : []),
      ...(pending.some((r) => r.scoped && r.files.some((f) => POST.test(f)))
        ? ["괄호 안의 검토 범위는 리뷰어에게 경로와 함께 그대로 넘겨."]
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
    if (reviewer.scoped) {
      const snapshot = readSnapshot(reviewer.agent);
      for (const f of files.filter((f) => POST.test(f))) snapshot[f] = postContent(f);
      writeFileSync(snapshotPath(reviewer.agent), JSON.stringify(snapshot));
    }
  } else {
    rmSync(marker, { force: true });
  }
  return 0;
}

const payload = JSON.parse(readFileSync(0, "utf8"));
process.chdir(process.env.CLAUDE_PROJECT_DIR || payload.cwd || ".");
process.exit(process.argv[2] === "pre" ? preToolUse(payload) : subagentStop(payload));
