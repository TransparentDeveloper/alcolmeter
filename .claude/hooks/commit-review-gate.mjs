#!/usr/bin/env node
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// git pathspec 의 * 는 / 도 넘어가므로 하위 폴더까지 잡힌다.
const REVIEWERS = [
  { agent: "md-reviewer", pathspec: ["*.md", "*.mdx"], target: "md/mdx 문서" },
  {
    agent: "blog-content-reviewer",
    pathspec: ["apps/web/src/content/posts/*index.md", "apps/web/src/content/posts/*index.mdx"],
    target: "블로그 글 초안",
  },
];
const GIT_PREFIX = String.raw`^git(\s+-C\s+\S+|\s+-c\s+\S+|\s+--?[\w-]+(=\S+)?)*\s+`;

const git = (...args) => execFileSync("git", args, { encoding: "utf8" });

const stagedFiles = (pathspec) =>
  git("diff", "--cached", "--name-only", "--diff-filter=ACMR", "--", ...pathspec)
    .split("\n")
    .filter(Boolean);

// 파일 경로와 staged blob id 기준이라 스테이징 후 내용이 바뀌면 지문도 바뀐다.
const fingerprint = (files) =>
  createHash("sha256").update(git("ls-files", "--stage", "--", ...files)).digest("hex");

const markerPath = (agent) => join(git("rev-parse", "--absolute-git-dir").trim(), `review-pass-${agent}`);

const segments = (command) =>
  command
    .split(/&&|\|\||[;|\n]/)
    .map((s) => s.trim())
    .filter(Boolean);

const isGitSubcommand = (segment, name) => new RegExp(`${GIT_PREFIX}${name}\\b`).test(segment);

function pendingReview({ agent, pathspec }) {
  const files = stagedFiles(pathspec);
  if (files.length === 0) return null;
  const marker = markerPath(agent);
  if (existsSync(marker) && readFileSync(marker, "utf8").trim() === fingerprint(files)) return null;
  return files;
}

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

  console.error(
    [
      "커밋 검토 게이트: staged 된 파일이 아직 검토를 통과하지 않았어. 아래 서브에이전트에게 각각 파일 목록을 넘겨 검토를 받아.",
      ...pending.flatMap(({ agent, target, files }) => [`[${agent}] ${target}`, ...files.map((p) => `- ${p}`)]),
      "FAIL 이면 지적 사항을 고치고 다시 git add 한 뒤 재검토를 받아. PASS 를 받은 뒤 staged 내용이 바뀌면 다시 검토해야 해.",
    ].join("\n"),
  );
  return 2;
}

const lastLine = (text) =>
  (text ?? "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .at(-1) ?? "";

function subagentStop(payload) {
  const reviewer = REVIEWERS.find((r) => r.agent === payload.agent_type);
  if (!reviewer) return 0;

  const marker = markerPath(reviewer.agent);
  const files = stagedFiles(reviewer.pathspec);
  if (lastLine(payload.last_assistant_message) === "VERDICT: PASS" && files.length > 0) {
    writeFileSync(marker, fingerprint(files));
  } else {
    rmSync(marker, { force: true });
  }
  return 0;
}

const payload = JSON.parse(readFileSync(0, "utf8"));
process.chdir(process.env.CLAUDE_PROJECT_DIR || payload.cwd || ".");
process.exit(process.argv[2] === "pre" ? preToolUse(payload) : subagentStop(payload));
