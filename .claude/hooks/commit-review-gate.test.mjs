import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HOOK = fileURLToPath(new URL("./commit-review-gate.mjs", import.meta.url));
const POST = "apps/web/src/content/posts/9/index.mdx";
// GIT_DIR 같은 값을 물려받으면 임시 저장소 대신 실제 저장소를 건드린다.
const ENV = Object.fromEntries(Object.entries(process.env).filter(([key]) => !key.startsWith("GIT_")));

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
  const git = (...args) => execFileSync("git", args, { cwd: dir, env: ENV, encoding: "utf8" });
  const write = (path, text) => {
    mkdirSync(dirname(join(dir, path)), { recursive: true });
    writeFileSync(join(dir, path), text);
  };
  const run = (mode, payload) =>
    spawnSync("node", [HOOK, mode], {
      input: JSON.stringify(payload),
      env: { ...ENV, CLAUDE_PROJECT_DIR: dir },
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
  return { dir, git, write, run, check, verdict, commit };
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
  write(".claude/hooks/a.test.mjs", "// 테스트\n");
  git("add", ".");
  const { stderr } = check();
  for (const agent of ["md-reviewer", "fe", "blog-designer", "test-reviewer"]) assert.match(stderr, new RegExp(`\\[${agent}\\]`));
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

test("표지 줄만 바꾼 커밋은 검토하지 않는다", (t) => {
  const { check, write, git, commit } = setup(t);
  write(POST, post());
  commit(POST);
  write(POST, post().replace("draft: true\n", "draft: true\ncover: ./cover.png\ncoverAlt: 사과\n"));
  git("add", POST);
  assert.equal(check().status, 0);
});

test("PASS 한 글이 그대로면 범위를 전체로 안내한다", (t) => {
  const { check, write, git, verdict } = setup(t);
  const other = "apps/web/src/content/posts/8/index.mdx";
  write(POST, post());
  git("add", POST);
  verdict("fact-checker");
  write(other, post());
  git("add", other);
  assert.ok(check().stderr.includes(`${POST} (전체: 바뀐 구획을 찾지 못함)`));
});

test("fe 가 아닌 리뷰어는 삭제된 파일을 검토하지 않는다", (t) => {
  const { check, git, write, commit } = setup(t);
  write("docs/a.md", "# 문서\n");
  commit("docs/a.md");
  git("rm", "-q", "docs/a.md");
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

test("git 앞 옵션이 붙은 커밋도 막는다", (t) => {
  const { check, write, git } = setup(t);
  write("README.md", "# 바뀜\n");
  git("add", "README.md");
  assert.equal(check("git -C . commit -m x").status, 2);
  assert.equal(check("git -c core.x=y commit -m x").status, 2);
  assert.equal(check("git --no-pager commit -m x").status, 2);
  assert.equal(check("git --git-dir=.git commit -m x").status, 2);
});

test("글이 PASS 를 받으면 통과하고, 그 뒤 그림·표지·draft 줄만 바꿔도 통과한다", (t) => {
  const { check, write, git, verdict } = setup(t);
  write(POST, post());
  git("add", POST);
  for (const agent of ["md-reviewer", "fact-checker", "blog-content-reviewer"]) verdict(agent);
  assert.equal(check().status, 0);
  write(
    POST,
    post({ draft: false, extra: "\n![그림](./a.png)\n" }).replace("---\n\n", "cover: ./cover.png\ncoverAlt: 사과\n---\n\n"),
  );
  git("add", POST);
  assert.equal(check().status, 0);
});

test("바뀐 구획이 frontmatter, 도입부, 여러 h2 이면 그 이름을 모두 안내한다", (t) => {
  const { check, write, git, commit } = setup(t);
  write(POST, post());
  commit(POST);
  const cases = [
    [post().replace("title: 테스트", "title: 바뀜"), "(바뀐 구획: frontmatter)"],
    [post().replace("도입 문단", "도입 고침"), "(바뀐 구획: 도입부)"],
    [post({ apple: "사과 고침", abv: "도수 고침" }), "(바뀐 구획: 사과, 도수)"],
  ];
  for (const [text, scope] of cases) {
    write(POST, text);
    git("add", POST);
    assert.ok(check().stderr.includes(scope), scope);
  }
});

test("검토 범위 안내 줄은 글이 staged 됐을 때만 붙는다", (t) => {
  const { check, write, git } = setup(t);
  const hint = "괄호 안의 검토 범위";
  write("README.md", "# 바뀜\n");
  git("add", "README.md");
  assert.ok(!check().stderr.includes(hint));
  write(POST, post());
  git("add", POST);
  assert.ok(check().stderr.includes(hint));
});

test("앱 폴더의 md 파일은 fe 가 아니라 md-reviewer 가 검토한다", (t) => {
  const { check, write, git } = setup(t);
  write("apps/web/README.md", "# 앱\n");
  git("add", "apps/web/README.md");
  const { stderr } = check();
  assert.match(stderr, /\[md-reviewer\]/);
  assert.doesNotMatch(stderr, /\[fe\]/);
});

test("어떤 구분자로 이어도 스테이징과 커밋을 묶으면 막는다", (t) => {
  const { check } = setup(t);
  for (const command of ["git add . ; git commit -m x", "git add . || git commit -m x", "git add .\ngit commit -m x"]) {
    assert.equal(check(command).status, 2, command);
  }
});

test("heredoc 본문에 든 커밋 명령은 커밋으로 보지 않는다", (t) => {
  const { check, write, git } = setup(t);
  write("README.md", "# 바뀜\n");
  git("add", "README.md");
  assert.equal(check("cat <<'EOF' > a.sh\ngit add .\ngit commit -m x\nEOF").status, 0);
  assert.equal(check("cat <<-EOF > a.sh\n\tgit commit -m x\n\tEOF").status, 0);
});

test("heredoc 을 여는 줄이나 닫은 뒤에 이어진 커밋은 막는다", (t) => {
  const { check, write, git } = setup(t);
  write("README.md", "# 바뀜\n");
  git("add", "README.md");
  assert.equal(check("cat <<EOF > a.txt && git commit -m x\n본문\nEOF").status, 2);
  assert.equal(check("cat <<EOF > a.txt\n본문\nEOF\ngit commit -m x").status, 2);
  assert.equal(check('git commit -m "$(cat <<\'EOF\'\n메시지\nEOF\n)"').status, 2);
});

test("따옴표 안의 << 나 닫히지 않은 heredoc 뒤의 커밋은 막는다", (t) => {
  const { check, write, git } = setup(t);
  write("README.md", "# 바뀜\n");
  git("add", "README.md");
  for (const command of [
    'echo "<<EOF"\ngit commit -m x\nEOF',
    "echo '<<EOF'\ngit commit -m x\nEOF",
    'echo "\\"<<EOF"\ngit commit -m x\nEOF',
    'echo "$(echo \')\')" "<<EOF"\ngit commit -m x\nEOF',
    "cat <<EOF > a.sh\ngit commit -m x",
  ]) {
    assert.equal(check(command).status, 2, command);
  }
});

test("$( 안의 heredoc 본문은 지운다", (t) => {
  const { check, write, git } = setup(t);
  write("README.md", "# 바뀜\n");
  git("add", "README.md");
  assert.equal(check('echo "$(cat <<\'EOF\'\ngit commit -m x\nEOF\n)"').status, 0);
  assert.equal(check('cat <<"EOF" > a.sh\ngit commit -m x\nEOF').status, 0);
});

test("a 가 든 다른 옵션은 한 번에 모두 커밋하는 것으로 보지 않는다", (t) => {
  const { check } = setup(t);
  assert.equal(check("git commit --amend -m x").status, 0);
  assert.equal(check("git commit -m x").status, 0);
});

test("마지막 줄이 PASS 판정이 아니면 통과시키지 않는다", (t) => {
  const { check, write, git, run, verdict } = setup(t);
  write("README.md", "# 바뀜\n");
  git("add", "README.md");
  for (const message of ["VERDICT: PASS\n추가 설명", "", undefined]) {
    verdict("md-reviewer");
    assert.equal(run("stop", { agent_type: "md-reviewer", last_assistant_message: message }).status, 0);
    assert.equal(check().status, 2, String(message));
  }
});

test("등록되지 않은 에이전트의 판정은 PASS 표식을 건드리지 않는다", (t) => {
  const { check, write, git, verdict } = setup(t);
  write("README.md", "# 바뀜\n");
  git("add", "README.md");
  verdict("md-reviewer");
  assert.equal(verdict("unknown-agent", "VERDICT: FAIL").status, 0);
  assert.equal(check().status, 0);
});

test("검토 대상이 staged 되지 않았을 때 받은 PASS 는 표식을 남기지 않는다", (t) => {
  const { dir, write, git, verdict } = setup(t);
  const marker = join(dir, ".git/review-pass-md-reviewer");
  write("README.md", "# 바뀜\n");
  git("add", "README.md");
  verdict("md-reviewer");
  assert.ok(existsSync(marker));
  git("restore", "--staged", "README.md");
  verdict("md-reviewer");
  assert.ok(!existsSync(marker));
});
