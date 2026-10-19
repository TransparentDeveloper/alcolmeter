import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { kstDate, publish, readyPosts } from "./publish-next.mjs";

const SCRIPT = fileURLToPath(new URL("./publish-next.mjs", import.meta.url));

const post = (status, extra = "") => `---\ntitle: 테스트\nstatus: ${status}\n${extra}cover: ./cover.png\n---\n\n본문\n`;

test("readyAt 이 가장 이른 ready 글부터 고른다", () => {
  const posts = [
    { id: "3", text: post("ready", "readyAt: 2026-10-20T10:00+09:00\n") },
    { id: "5", text: post("ready", "readyAt: 2026-10-19T23:00+09:00\n") },
    { id: "4", text: post("draft") },
    { id: "1", text: post("published", "publishedAt: 2026-10-01\n") },
  ];
  assert.deepEqual(readyPosts(posts).map((p) => p.id), ["5", "3"]);
});

test("readyAt 이 같으면 폴더 번호가 작은 글을 고른다", () => {
  const posts = [
    { id: "10", text: post("ready", "readyAt: 2026-10-19T09:00+09:00\n") },
    { id: "9", text: post("ready", 'readyAt: "2026-10-19T09:00+09:00"\n') },
  ];
  assert.deepEqual(readyPosts(posts).map((p) => p.id), ["9", "10"]);
});

test("줄 끝 주석은 값에서 뺀다", () => {
  const posts = [
    { id: "1", text: post("ready # 검수 끝", "readyAt: 2026-10-20T09:00+09:00 # 오후\n") },
    { id: "2", text: post('"ready" # 검수 끝', 'readyAt: "2026-10-19T09:00+09:00" # 오전\n') },
    { id: "3", text: post("draft # ready 아님", "readyAt: 2026-10-18T09:00+09:00\n") },
    { id: "4", text: post('"ready # 따옴표 안"', "readyAt: 2026-10-17T09:00+09:00\n") },
    { id: "5", text: post("ready#1", "readyAt: 2026-10-16T09:00+09:00\n") },
  ];
  assert.deepEqual(readyPosts(posts).map((p) => [p.id, p.readyAt.toISOString()]), [
    ["2", "2026-10-19T00:00:00.000Z"],
    ["1", "2026-10-20T00:00:00.000Z"],
  ]);
});

test("주석이 붙은 status 줄도 published 로 바꾼다", () => {
  const out = publish(post("ready # 검수 끝", "readyAt: 2026-10-19T09:00+09:00\n"), "2026-10-20");
  assert.match(out, /^status: published\npublishedAt: 2026-10-20$/m);
  assert.doesNotMatch(out, /검수 끝/);
});

test("readyAt 이 없거나 틀린 ready 글이 있으면 멈춘다", () => {
  assert.throws(() => readyPosts([{ id: "2", text: post("ready") }]), /2번 글/);
  assert.throws(() => readyPosts([{ id: "2", text: post("ready", "readyAt: 어제\n") }]), /2번 글/);
});

test("ready 글이 없으면 빈 목록이다", () => {
  assert.deepEqual(readyPosts([{ id: "1", text: post("draft") }]), []);
});

test("status 를 published 로 바꾸고 발행일을 넣으며, 본문과 다른 줄은 그대로 둔다", () => {
  const text = post("ready", "readyAt: 2026-10-19T09:00+09:00\n");
  assert.equal(
    publish(text, "2026-10-20"),
    "---\ntitle: 테스트\nstatus: published\npublishedAt: 2026-10-20\nreadyAt: 2026-10-19T09:00+09:00\ncover: ./cover.png\n---\n\n본문\n",
  );
});

test("이미 있던 publishedAt 은 발행일로 바꾼다", () => {
  const text = post("ready", "readyAt: 2026-10-19T09:00+09:00\npublishedAt: 2026-01-01\n");
  const out = publish(text, "2026-10-20");
  assert.equal(out.match(/^publishedAt:.*$/gm).join(), "publishedAt: 2026-10-20");
});

test("본문의 status: 줄은 건드리지 않는다", () => {
  const text = post("ready", "readyAt: 2026-10-19T09:00+09:00\n") + "status: ready\n";
  assert.ok(publish(text, "2026-10-20").endsWith("본문\nstatus: ready\n"));
});

test("발행일은 한국 날짜다", () => {
  assert.equal(kstDate(new Date("2026-10-20T12:00:00Z")), "2026-10-20");
  assert.equal(kstDate(new Date("2026-10-20T15:30:00Z")), "2026-10-21");
});

function run(t, posts) {
  const dir = mkdtempSync(join(tmpdir(), "publish-next-"));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  const path = (id) => join(dir, "apps/web/src/content/posts", id, "index.mdx");
  for (const [id, text] of Object.entries(posts)) {
    mkdirSync(join(path(id), ".."), { recursive: true });
    writeFileSync(path(id), text);
  }
  const output = join(dir, "output");
  writeFileSync(output, "");
  const result = spawnSync(process.execPath, [SCRIPT], { cwd: dir, env: { ...process.env, GITHUB_OUTPUT: output } });
  return { status: result.status, read: (id) => readFileSync(path(id), "utf8"), output: () => readFileSync(output, "utf8") };
}

test("ready 글이 없으면 실패하고 아무 글도 바꾸지 않는다", (t) => {
  const draft = post("draft");
  const { status, read, output } = run(t, { 1: draft });
  assert.equal(status, 1);
  assert.equal(read("1"), draft);
  assert.equal(output(), "");
});

test("고른 글 하나만 발행하고 번호와 남은 수를 출력한다", (t) => {
  const later = post("ready", "readyAt: 2026-10-21T09:00+09:00\n");
  const { status, read, output } = run(t, { 1: post("ready", "readyAt: 2026-10-20T09:00+09:00\n"), 2: later });
  assert.equal(status, 0);
  assert.match(read("1"), /^status: published\npublishedAt: \d{4}-\d{2}-\d{2}$/m);
  assert.equal(read("2"), later);
  assert.equal(output(), "post=1\nremaining=1\n");
});

test("고른 글이 임시 표지를 쓰면 실패하고 아무 글도 바꾸지 않는다", (t) => {
  const draftCover = post("ready", "readyAt: 2026-10-19T09:00+09:00\n").replace("cover: ./cover.png", "cover: ../../../assets/draft-cover.png");
  const later = post("ready", "readyAt: 2026-10-20T09:00+09:00\n");
  const { status, read, output } = run(t, { 1: draftCover, 2: later });
  assert.equal(status, 1);
  assert.equal(read("1"), draftCover);
  assert.equal(read("2"), later);
  assert.equal(output(), "");
});

test("임시 표지는 다음 차례 글에만 있으면 막지 않는다", (t) => {
  const draftCover = post("ready", "readyAt: 2026-10-20T09:00+09:00\n").replace("cover: ./cover.png", "cover: ../../../assets/draft-cover.png");
  const { status, read, output } = run(t, { 1: post("ready", "readyAt: 2026-10-19T09:00+09:00\n"), 2: draftCover });
  assert.equal(status, 0);
  assert.match(read("1"), /^status: published$/m);
  assert.equal(read("2"), draftCover);
  assert.equal(output(), "post=1\nremaining=1\n");
});

test("글 번호가 아닌 폴더는 보지 않는다", (t) => {
  const ready = post("ready", "readyAt: 2026-10-19T09:00+09:00\n");
  const { status, read, output } = run(t, { 0: ready, abc: ready, 3: post("ready", "readyAt: 2026-10-20T09:00+09:00\n") });
  assert.equal(status, 0);
  assert.equal(read("0"), ready);
  assert.equal(read("abc"), ready);
  assert.equal(output(), "post=3\nremaining=0\n");
});
