import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HOOK = fileURLToPath(new URL("./commit-review-gate.mjs", import.meta.url));
const POST = "apps/web/src/content/posts/9/index.mdx";

const post = ({ apple = "사과 술 설명", abv = "도수 설명", draft = true, extra = "" } = {}) =>
  [
    "---",
    "title: 테스트",
    "publishedAt: 2026-10-12",
    ...(draft ? ["draft: true"] : []),
    "---",
    "",
    "도입 문단",
    extra,
    "## 사과",
    "",
    apple,
    "",
    "## 도수",
    "",
    abv,
    "",
  ].join("\n");

function setup(t) {
  const dir = mkdtempSync(join(tmpdir(), "commit-gate-"));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  const git = (...args) => execFileSync("git", args, { cwd: dir, encoding: "utf8" });
  const write = (path, text) => {
    mkdirSync(dirname(join(dir, path)), { recursive: true });
    writeFileSync(join(dir, path), text);
  };
  const run = (mode, payload) =>
    spawnSync("node", [HOOK, mode], {
      input: JSON.stringify(payload),
      env: { ...process.env, CLAUDE_PROJECT_DIR: dir },
      encoding: "utf8",
    });
  const check = (command = "git commit -m x") => run("pre", { tool_input: { command } });
  const verdict = (agent, message) =>
    run("stop", { agent_type: agent, last_assistant_message: message ?? "검토 끝\nVERDICT: PASS" });
  // 훅을 거치지 않고 커밋해 HEAD 기준본을 만든다.
  const commit = (...paths) => {
    git("add", ...paths);
    git("commit", "-qm", "x");
  };

  git("init", "-q");
  git("config", "user.email", "test@example.com");
  git("config", "user.name", "test");
  git("config", "commit.gpgsign", "false");
  write("README.md", "# 테스트\n");
  commit("README.md");
  return { dir, git, write, check, verdict, commit };
}

test("커밋이 아닌 명령은 통과한다", (t) => {
  const { check } = setup(t);
  assert.equal(check("git status").status, 0);
  assert.equal(check("echo git commit").status, 0);
});

test("스테이징과 커밋을 한 명령으로 묶으면 막는다", (t) => {
  const { check } = setup(t);
  assert.equal(check("git add . && git commit -m x").status, 2);
  assert.equal(check("git commit -am x").status, 2);
  assert.equal(check("git commit --all -m x").status, 2);
});

test("검토 대상이 staged 되지 않았으면 통과한다", (t) => {
  const { check, write, git } = setup(t);
  write("notes.txt", "메모");
  git("add", "notes.txt");
  assert.equal(check().status, 0);
});

test("PASS 를 받기 전에는 막고, 받으면 통과한다", (t) => {
  const { check, write, git, verdict } = setup(t);
  write("README.md", "# 바뀜\n");
  git("add", "README.md");
  const blocked = check();
  assert.equal(blocked.status, 2);
  assert.match(blocked.stderr, /\[md-reviewer\]/);
  verdict("md-reviewer");
  assert.equal(check().status, 0);
});

test("판정 줄이 코드 펜스 안에 있어도 PASS 로 읽는다", (t) => {
  const { check, write, git, verdict } = setup(t);
  write("README.md", "# 바뀜\n");
  git("add", "README.md");
  verdict("md-reviewer", "검토 끝\n```\nVERDICT: PASS\n```");
  assert.equal(check().status, 0);
});

test("FAIL 을 받으면 이전 PASS 표식을 지운다", (t) => {
  const { check, write, git, verdict } = setup(t);
  write("README.md", "# 바뀜\n");
  git("add", "README.md");
  verdict("md-reviewer");
  verdict("md-reviewer", "VERDICT: FAIL");
  assert.equal(check().status, 2);
});

test("PASS 뒤 staged 내용이 바뀌면 다시 막는다", (t) => {
  const { check, write, git, verdict } = setup(t);
  write("README.md", "# 바뀜\n");
  git("add", "README.md");
  verdict("md-reviewer");
  write("README.md", "# 또 바뀜\n");
  git("add", "README.md");
  assert.equal(check().status, 2);
});

test("여러 리뷰어가 필요하면 한 번에 모두 안내한다", (t) => {
  const { check, write, git } = setup(t);
  write("README.md", "# 바뀜\n");
  write("apps/web/src/lib/a.ts", "export const a = 1;\n");
  write("apps/web/src/layouts/Base.astro", "<html></html>\n");
  git("add", ".");
  const { stderr } = check();
  for (const agent of ["md-reviewer", "fe", "blog-designer"]) assert.match(stderr, new RegExp(`\\[${agent}\\]`));
});

test("fe 는 삭제된 파일도 검토한다", (t) => {
  const { check, write, git, commit } = setup(t);
  write("apps/web/src/lib/a.ts", "export const a = 1;\n");
  commit("apps/web/src/lib/a.ts");
  git("rm", "-q", "apps/web/src/lib/a.ts");
  assert.match(check().stderr, /\[fe\]/);
});

test("글 폴더의 노트, 근거 표, 이미지는 검토하지 않는다", (t) => {
  const { check, write, git } = setup(t);
  for (const name of ["research.md", "lecture.md", "questions.md", "evidence.md", "cover.png"]) {
    write(`apps/web/src/content/posts/9/${name}`, "x");
  }
  git("add", ".");
  assert.equal(check().status, 0);
});

test("처음 보는 글은 전체를 검토한다", (t) => {
  const { check, write, git } = setup(t);
  write(POST, post());
  git("add", POST);
  const { status, stderr } = check();
  assert.equal(status, 2);
  for (const agent of ["md-reviewer", "fact-checker", "blog-content-reviewer"]) {
    assert.match(stderr, new RegExp(`\\[${agent}\\]`));
  }
  assert.match(stderr, /\(전체: 첫 검토\)/);
});

test("커밋된 글은 바뀐 h2 구획만 검토한다", (t) => {
  const { check, write, git, commit } = setup(t);
  write(POST, post());
  commit(POST);
  write(POST, post({ abv: "도수 설명 고침" }));
  git("add", POST);
  assert.match(check().stderr, /\(바뀐 구획: 도수\)/);
});

test("h2 구성이 바뀌면 전체를 검토한다", (t) => {
  const { check, write, git, commit } = setup(t);
  write(POST, post());
  commit(POST);
  write(POST, post({ extra: "\n## 새 구획\n\n새 내용\n" }));
  git("add", POST);
  assert.match(check().stderr, /\(전체: h2 구성 변경\)/);
});

test("리뷰어마다 자기가 마지막으로 PASS 한 내용을 기준으로 범위를 정한다", (t) => {
  const { check, write, git, verdict } = setup(t);
  write(POST, post());
  git("add", POST);
  verdict("fact-checker");
  write(POST, post({ apple: "사과 술 설명 고침" }));
  git("add", POST);
  const lines = check().stderr.split("\n");
  const scopeOf = (agent) => lines[lines.findIndex((l) => l.startsWith(`[${agent}]`)) + 1];
  assert.match(scopeOf("fact-checker"), /\(바뀐 구획: 사과\)/);
  assert.match(scopeOf("blog-content-reviewer"), /\(전체: 첫 검토\)/);
});

test("그림 넣기와 draft 해제만 바꾼 커밋은 검토하지 않는다", (t) => {
  const { check, write, git, commit } = setup(t);
  write(POST, post());
  commit(POST);
  write(POST, post({ draft: false, extra: '\n![그림](./a.png)\n\n<Figure src={a} alt="그림" />\n' }));
  write("apps/web/src/content/posts/9/a.png", "x");
  git("add", ".");
  assert.equal(check().status, 0);
});

test("PASS 하면 scoped 리뷰어의 기준본을 남긴다", (t) => {
  const { dir, write, git, verdict } = setup(t);
  write(POST, post());
  git("add", POST);
  verdict("fact-checker");
  verdict("md-reviewer");
  assert.ok(existsSync(join(dir, ".git/review-snapshot-fact-checker.json")));
  assert.ok(!existsSync(join(dir, ".git/review-snapshot-md-reviewer.json")));
});
