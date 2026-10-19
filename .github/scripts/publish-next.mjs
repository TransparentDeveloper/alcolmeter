#!/usr/bin/env node
import { appendFileSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const POSTS = "apps/web/src/content/posts";

// YAML 처럼 따옴표 밖의 " #" 뒤는 주석으로 본다.
const field = (text, name) => {
  const front = text.match(/^---\n([\s\S]*?)\n---\n/)?.[1] ?? "";
  const raw = front.match(new RegExp(`^${name}:\\s*(.*)$`, "m"))?.[1];
  if (raw === undefined) return undefined;
  const quoted = raw.match(/^(["'])(.*?)\1/);
  return quoted ? quoted[2] : raw.replace(/(^|\s)#.*$/, "").trim();
};

// 발행일은 한국 날짜다. 러너 시간대는 UTC 라서 직접 바꾼다.
export const kstDate = (now) => new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Seoul" }).format(now);

// readyAt 이 가장 이른 ready 글. 같으면 폴더 번호가 작은 글.
export function readyPosts(posts) {
  return posts
    .filter(({ text }) => field(text, "status") === "ready")
    .map(({ id, text }) => {
      const readyAt = new Date(field(text, "readyAt") ?? "");
      if (Number.isNaN(readyAt.valueOf())) throw new Error(`${id}번 글의 readyAt 을 읽지 못했다.`);
      return { id, text, readyAt };
    })
    .sort((a, b) => a.readyAt - b.readyAt || Number(a.id) - Number(b.id));
}

export function publish(text, date) {
  const [, front, body] = text.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  const lines = front
    .split("\n")
    .filter((line) => !line.startsWith("publishedAt:"))
    .flatMap((line) => (line.startsWith("status:") ? ["status: published", `publishedAt: ${date}`] : [line]));
  return `---\n${lines.join("\n")}\n---\n${body}`;
}

function main() {
  const posts = readdirSync(POSTS)
    .filter((id) => /^[1-9]\d*$/.test(id))
    .map((id) => ({ id, text: readFileSync(join(POSTS, id, "index.mdx"), "utf8") }));
  const [next, ...rest] = readyPosts(posts);
  if (!next) {
    console.error("발행할 ready 글이 없다.");
    process.exit(1);
  }
  if (field(next.text, "cover")?.includes("draft-cover")) {
    console.error(`${next.id}번 글이 아직 임시 표지를 쓴다. 진짜 표지로 바꾼 뒤 다시 실행한다.`);
    process.exit(1);
  }
  writeFileSync(join(POSTS, next.id, "index.mdx"), publish(next.text, kstDate(new Date())));
  console.log(`${next.id}번 글을 발행했다. 남은 ready 글: ${rest.length}개`);
  if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `post=${next.id}\nremaining=${rest.length}\n`);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) main();
