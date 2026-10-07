#!/usr/bin/env node
import { existsSync } from "node:fs";
import { join } from "node:path";

const USAGE = `사용법:
  node .claude/scripts/law.mjs search <법령명>
  node .claude/scripts/law.mjs article <법령명> <조번호>   예: 5, 5의2
  node .claude/scripts/law.mjs annex <법령명> [별표번호]`;

const envPath = join(import.meta.dirname, "../../.env");
if (existsSync(envPath)) process.loadEnvFile(envPath);
const OC = process.env.LAW_OC;
if (!OC) fail("LAW_OC 가 .env 에 없다.");

const list = (v) => (v == null ? [] : [].concat(v));

function fail(message) {
  console.error(message);
  process.exit(1);
}

// 응답의 링크에 OC 가 섞여 나오므로 출력 전에 지운다.
const scrub = (text) => text.replaceAll(OC, "***");

async function call(endpoint, params) {
  const url = new URL(`https://www.law.go.kr/DRF/${endpoint}.do`);
  url.search = new URLSearchParams({ OC, type: "JSON", ...params });
  const res = await fetch(url, { signal: AbortSignal.timeout(20_000) });
  if (!res.ok) fail(`HTTP ${res.status}`);
  const body = await res.json();
  if (body.result) fail(`API 오류: ${body.result} ${body.msg ?? ""}\n등록한 IP 와 이 PC 의 공인 IP 가 같은지 확인한다.`);
  return body;
}

async function searchLaws(name) {
  const body = await call("lawSearch", { target: "law", query: name, display: "20" });
  return list(body.LawSearch?.law);
}

async function loadLaw(name) {
  const laws = await searchLaws(name);
  const law = laws.find((l) => l.법령명한글 === name && l.현행연혁코드 === "현행");
  if (!law) {
    const names = laws.map((l) => l.법령명한글).join(", ");
    fail(`현행 법령 "${name}" 을 찾지 못했다.${names ? ` 검색 결과: ${names}` : ""}`);
  }
  const body = await call("lawService", { target: "law", MST: law.법령일련번호 });
  return body.법령;
}

const header = (info) =>
  `${info.법령명_한글} (${info.법종구분?.content ?? "법령"} 제${info.공포번호}호, ${info.공포일자} 공포, ${info.시행일자} 시행)`;

function printArticle(law, no) {
  const [main, branch = ""] = no.split("의");
  const article = list(law.조문?.조문단위).find(
    (a) => a.조문여부 === "조문" && a.조문번호 === main && (a.조문가지번호 ?? "") === branch,
  );
  if (!article) fail(`제${no}조를 찾지 못했다.`);

  const path = `제${main}조${branch ? `의${branch}` : ""}`;
  const lines = [header(law.기본정보), `https://www.law.go.kr/법령/${law.기본정보.법령명_한글}/${path}`, "", article.조문내용.trim()];
  for (const paragraph of list(article.항)) {
    if (paragraph.항내용) lines.push(paragraph.항내용.trim());
    for (const item of list(paragraph.호)) {
      lines.push(`  ${item.호내용.trim()}`);
      for (const sub of list(item.목)) lines.push(`    ${list(sub.목내용).flat().join(" ").trim()}`);
    }
  }
  console.log(scrub(lines.join("\n")));
}

function printAnnex(law, no) {
  const annexes = list(law.별표?.별표단위).filter((a) => !no || Number(a.별표번호) === Number(no));
  if (!annexes.length) fail(no ? `별표 ${no} 를 찾지 못했다.` : "별표가 없다.");

  const lines = [header(law.기본정보)];
  for (const annex of annexes) {
    lines.push("", `[별표${Number(annex.별표번호) ? ` ${Number(annex.별표번호)}` : ""}] ${annex.별표제목}`);
    // 별표내용은 고정 폭으로 채운 줄을 " ," 로 이어 붙인 형태다. 본문 쉼표는 앞에 공백이 없다.
    const text = list(annex.별표내용).flat().join("\n");
    lines.push(...text.split(/\s+,|\n/).map((l) => l.trimEnd()).filter((l) => l.trim()));
  }
  console.log(scrub(lines.join("\n")));
}

const [command, name, arg] = process.argv.slice(2);
if (!command || !name) fail(USAGE);

if (command === "search") {
  const laws = await searchLaws(name);
  if (!laws.length) fail(`"${name}" 검색 결과가 없다.`);
  for (const l of laws) console.log(`${l.법령명한글} | ${l.법령구분명} | ${l.현행연혁코드} | ${l.시행일자} 시행`);
} else if (command === "article") {
  if (!arg) fail(USAGE);
  printArticle(await loadLaw(name), arg);
} else if (command === "annex") {
  printAnnex(await loadLaw(name), arg);
} else {
  fail(USAGE);
}
