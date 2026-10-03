#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const git = (...args) => execFileSync("git", args, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();

const tryGit = (...args) => {
  try {
    return git(...args);
  } catch {
    return null;
  }
};

const timestamp = () => {
  const d = new Date();
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`;
};

function defaultBranch() {
  const ref = tryGit("symbolic-ref", "--short", "refs/remotes/origin/HEAD");
  return ref ? ref.replace(/^origin\//, "") : "main";
}

// push 안 한 로컬 커밋도 포함하도록 origin 이 아닌 로컬 기본 브랜치를 기준으로 삼는다.
const baseRef = (branch) => (tryGit("rev-parse", "--verify", "--quiet", branch) ? branch : `origin/${branch}`);

const emit = (additionalContext, systemMessage) =>
  console.log(JSON.stringify({ systemMessage, hookSpecificOutput: { hookEventName: "SessionStart", additionalContext } }));

const payload = JSON.parse(readFileSync(0, "utf8"));
process.chdir(payload.cwd || process.env.CLAUDE_PROJECT_DIR || ".");

const gitDir = tryGit("rev-parse", "--absolute-git-dir");
if (!gitDir) process.exit(0);
if (gitDir !== join(tryGit("rev-parse", "--path-format=absolute", "--git-common-dir") ?? "", "")) process.exit(0);

const root = git("rev-parse", "--show-toplevel");
const name = timestamp();
const path = join(root, ".claude", "worktrees", name);
const branch = defaultBranch();
const base = baseRef(branch);

try {
  git("worktree", "add", "-b", name, path, base);
} catch (e) {
  emit(
    `세션 시작 워크트리 생성에 실패했다(${e.stderr?.toString().trim() || e.message}). 작업 전에 사용자에게 알리고 지시를 받아라.`,
    `워크트리 생성 실패: ${name}`,
  );
  process.exit(0);
}

emit(
  `이 저장소는 세션마다 별도 워크트리에서 작업한다. 세션 시작 훅이 ${base} 기준으로 워크트리 ${path} (브랜치 ${name}) 를 만들었다. 다른 작업을 하기 전에 EnterWorktree 도구를 path "${path}" 로 호출해 이 워크트리로 들어가라. 파일 수정과 커밋은 그 워크트리 안에서만 한다.`,
  `워크트리 ${name} 생성 (${base} 기준)`,
);
