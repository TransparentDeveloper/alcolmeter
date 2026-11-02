// 커밋 전 리뷰 게이트. 리뷰어는 reviewers/{에이전트}/config.json, 판정은 verdict/{인덱스 트리}/{에이전트}.json 이다.
// git pre-commit 이 `pre-commit` 인자로 부르고, Claude Code 훅(PreToolUse, SubagentStart, SubagentStop)이 stdin JSON 으로 부른다.
// 판정은 리뷰어 관할 파일의 스테이지된 blob 지문에 묶인다. 관할 파일이 바뀌면 그 리뷰어만 바뀐 부분을 다시 본다.
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REVIEWERS = ".claude/hooks/code-review/reviewers";
const VERDICTS = ".claude/hooks/code-review/verdict";
const PENDING = ".pending.json";
const VERDICT_MARK = "code-review/" + "verdict";
const AGENTS = ".claude/agents/pre-commit";
const SUFFIX = "-reviewer";
const PASS = "PASS";
const REJECT = "FAIL";
// ASK 는 커밋을 통과시키되, 커밋 뒤 메인 에이전트가 사용자에게 의도와 맞는지 묻게 한다.
const ASK = "ASK";
const VERDICT_RE = new RegExp(
  `^VERDICT:\\s*(${PASS}|${REJECT}|${ASK})\\s*$`,
  "gm",
);
const VERDICT_FORMAT = `\`VERDICT: ${PASS}\`, \`VERDICT: ${REJECT}\`, \`VERDICT: ${ASK}\` 중 하나`;
const WRITE_TOOLS = new Set(["Edit", "Write", "MultiEdit", "NotebookEdit"]);
const AGENT_TOOLS = new Set(["Agent", "Task"]);
const REVIEW_PROMPT =
  "스테이지된 변경을 검토해라. 범위와 판정 형식은 시작할 때 받은 지시를 따른다.";
const GIT_OPTS = String.raw`(?:\s+(?:-[Cc]\s+\S+|--?[\w.-]+(?:=\S*)?))*`;
const GIT_MUTATING_RE = new RegExp(
  String.raw`\bgit${GIT_OPTS}\s+(?:add|am|apply|checkout|cherry-pick|clean|commit|merge|mv|rebase|reset|restore|revert|rm|stash|switch|update-index)\b`,
);
const SKIP_HOOKS_RE =
  /\bgit\b(?:[^\n;&|]*\bcommit\b[^\n;&|]*--no-verify\b|[^\n;&|]*-c\s*core\.hooksPath=[^\n;&|]*\bcommit\b)/i;
const REASON_LIMIT = 4000;

function git(cwd, args, env = process.env) {
  return execFileSync("git", ["-c", "core.quotePath=false", ...args], {
    cwd,
    env,
    encoding: "utf8",
    maxBuffer: 256 * 1024 * 1024,
    stdio: ["ignore", "pipe", "pipe"],
  });
}

function globToRegExp(glob) {
  let re = "";
  for (let i = 0; i < glob.length; i++) {
    const c = glob[i];
    if (c === "*" && glob[i + 1] === "*") {
      const slash = glob[i + 2] === "/";
      re += slash ? "(?:.*/)?" : ".*";
      i += slash ? 2 : 1;
    } else if (c === "*") {
      re += "[^/]*";
    } else if (c === "?") {
      re += "[^/]";
    } else if (c === "{") {
      const end = glob.indexOf("}", i);
      re += `(?:${glob
        .slice(i + 1, end)
        .split(",")
        .map((s) => s.replace(/[.+^$()|[\]\\]/g, "\\$&"))
        .join("|")})`;
      i = end;
    } else {
      re += c.replace(/[.+^$()|[\]\\]/g, "\\$&");
    }
  }
  return new RegExp(`^${re}$`);
}

function list(value, key, agent) {
  if (value === undefined) {
    return [];
  }
  if (!Array.isArray(value) || value.some((v) => typeof v !== "string")) {
    throw new Error(
      `${REVIEWERS}/${agent}/config.json: ${key} 는 문자열 배열이어야 한다`,
    );
  }
  return value;
}

// 파일이 관할이려면 exclude 에 안 맞고, paths 에 맞거나 추가된 줄이 content 정규식에 맞아야 한다.
export function parseReviewer(agent, config) {
  const paths = list(config?.paths, "paths", agent).map(globToRegExp);
  const content = list(config?.content, "content", agent).map(
    (s) => new RegExp(s, "u"),
  );
  const exclude = list(config?.exclude, "exclude", agent).map(globToRegExp);
  if (paths.length === 0 && content.length === 0) {
    throw new Error(
      `${REVIEWERS}/${agent}/config.json: paths 나 content 가 없다`,
    );
  }
  return {
    agent,
    covers: (file) =>
      !exclude.some((re) => re.test(file.path)) &&
      (paths.some((re) => re.test(file.path)) ||
        file.added.some((line) => content.some((re) => re.test(line)))),
  };
}

const subdirs = (dir) =>
  existsSync(dir)
    ? readdirSync(dir, { withFileTypes: true })
        .filter((e) => e.isDirectory())
        .map((e) => e.name)
    : [];

function frontmatterList(text, key) {
  const front = text.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? "";
  const inline = front.match(new RegExp(`^${key}:[ \\t]*(\\S.*)$`, "m"));
  if (inline) {
    return inline[1]
      .split(",")
      .map((t) => t.trim().replace(/^["']|["']$/g, ""));
  }
  const block = front.match(
    new RegExp(`^${key}:\\s*\\n((?:[ \\t]+-.*\\n?)+)`, "m"),
  );
  return block
    ? block[1]
        .split("\n")
        .map((l) =>
          l
            .replace(/^\s*-\s*/, "")
            .trim()
            .replace(/^["']|["']$/g, ""),
        )
        .filter(Boolean)
    : null;
}

// 리뷰어는 이름이 -reviewer 로 끝나고, 프로젝트 에이전트 정의에 쓰기 도구가 없어야 한다.
// tools 를 비우면 모든 도구를 받으므로 비워 둘 수 없다.
export function checkAgent(root, agent) {
  if (!agent.endsWith(SUFFIX)) {
    throw new Error(
      `${REVIEWERS}/${agent}: 리뷰어 이름은 ${SUFFIX} 로 끝나야 한다`,
    );
  }
  const file = path.join(root, AGENTS, `${agent}.md`);
  if (!existsSync(file)) {
    throw new Error(`${agent}: ${AGENTS}/${agent}.md 가 없다`);
  }
  const tools = frontmatterList(readFileSync(file, "utf8"), "tools");
  if (!tools) {
    throw new Error(
      `${AGENTS}/${agent}.md: tools 를 적어야 한다. 없으면 쓰기 도구까지 모두 받는다`,
    );
  }
  const bad = tools.filter((t) => t === "*" || WRITE_TOOLS.has(t));
  if (bad.length > 0) {
    throw new Error(
      `${AGENTS}/${agent}.md: 리뷰어에게 쓰기 도구를 줄 수 없다: ${bad.join(", ")}`,
    );
  }
}

export function readReviewers(root) {
  const dir = path.join(root, REVIEWERS);
  return subdirs(dir).map((agent) => {
    checkAgent(root, agent);
    return parseReviewer(
      agent,
      JSON.parse(readFileSync(path.join(dir, agent, "config.json"), "utf8")),
    );
  });
}

function addedLines(root, env) {
  const added = new Map();
  let file = null;
  let header = false;
  const diff = git(
    root,
    ["diff", "--cached", "-U0", "--no-color", "--no-ext-diff", "--no-renames"],
    env,
  );
  for (const line of diff.split("\n")) {
    if (line.startsWith("diff --git ")) {
      header = true;
      file = null;
    } else if (header && line.startsWith("+++ ")) {
      file = line.startsWith("+++ b/") ? line.slice(6) : null;
    } else if (line.startsWith("@@")) {
      header = false;
    } else if (!header && file !== null && line.startsWith("+")) {
      if (!added.has(file)) {
        added.set(file, []);
      }
      added.get(file).push(line.slice(1));
    }
  }
  return added;
}

export function stagedChanges(root, env = process.env) {
  const raw = git(
    root,
    ["diff", "--cached", "--raw", "-z", "--no-abbrev", "--no-renames"],
    env,
  ).split("\0");
  const added = addedLines(root, env);
  const files = [];
  for (let i = 0; i + 1 < raw.length; i += 2) {
    const [, , , blob] = raw[i].split(" ");
    const file = raw[i + 1];
    files.push({ path: file, blob, added: added.get(file) ?? [] });
  }
  return files;
}

function fingerprint(files) {
  const hash = createHash("sha256");
  for (const f of [...files].sort((a, b) => a.path.localeCompare(b.path))) {
    hash.update(`${f.path}\0${f.blob}\n`);
  }
  return hash.digest("hex");
}

// 훅 여럿이 동시에 돌고 커밋 중에는 git 이 인덱스를 잠그므로 복사본으로 트리를 만든다.
function indexTree(root, env = process.env) {
  const index = git(
    root,
    ["rev-parse", "--path-format=absolute", "--git-path", "index"],
    env,
  ).trim();
  const tmp = mkdtempSync(path.join(tmpdir(), "otata-review-"));
  try {
    const copy = path.join(tmp, "index");
    copyFileSync(path.resolve(root, index), copy);
    return git(root, ["write-tree"], { ...env, GIT_INDEX_FILE: copy }).trim();
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
}

function readJson(file) {
  try {
    return JSON.parse(readFileSync(file, "utf8"));
  } catch {
    return null;
  }
}

function verdictEntries(root) {
  const dir = path.join(root, VERDICTS);
  return subdirs(dir).flatMap((tree) =>
    readdirSync(path.join(dir, tree)).map((name) => ({
      tree,
      name,
      file: path.join(dir, tree, name),
    })),
  );
}

function lastVerdict(root, agent) {
  const entry = verdictEntries(root).find((e) => e.name === `${agent}.json`);
  const data = entry && readJson(entry.file);
  return data ? { ...data, tree: entry.tree } : null;
}

function pendingOf(root, agentId) {
  for (const e of verdictEntries(root)) {
    if (e.name.endsWith(PENDING)) {
      const data = readJson(e.file);
      if (data?.agentId === agentId) {
        return { ...data, tree: e.tree, file: e.file };
      }
    }
  }
  return null;
}

function writeVerdictFile(root, tree, name, data) {
  const dir = path.join(root, VERDICTS, tree);
  mkdirSync(dir, { recursive: true });
  writeFileSync(path.join(dir, name), `${JSON.stringify(data, null, 2)}\n`);
}

// 리뷰어마다 마지막 판정 하나만 남기고, 빈 트리 폴더는 지운다.
function recordVerdict(root, tree, agent, data) {
  for (const e of verdictEntries(root)) {
    if (e.name === `${agent}.json`) {
      rmSync(e.file, { force: true });
    }
  }
  writeVerdictFile(root, tree, `${agent}.json`, data);
  pruneVerdicts(root);
}

function pruneVerdicts(root) {
  const dir = path.join(root, VERDICTS);
  for (const tree of subdirs(dir)) {
    if (readdirSync(path.join(dir, tree)).length === 0) {
      rmSync(path.join(dir, tree), { recursive: true, force: true });
    }
  }
}

export function reviewStatus(root, env = process.env) {
  const reviewers = readReviewers(root);
  if (reviewers.length === 0) {
    return [];
  }
  const changes = stagedChanges(root, env);
  return reviewers.flatMap((reviewer) => {
    const files = changes.filter(reviewer.covers);
    if (files.length === 0) {
      return [];
    }
    const fp = fingerprint(files);
    const last = lastVerdict(root, reviewer.agent);
    const passed =
      (last?.verdict === PASS || last?.verdict === ASK) &&
      last.fingerprint === fp;
    return [{ agent: reviewer.agent, files, fingerprint: fp, last, passed }];
  });
}

function describe(s) {
  if (!s.last) {
    return "검토 전";
  }
  return s.last.verdict === REJECT
    ? "반려됨, 지난 검토 이후 바뀐 부분을 다시 본다"
    : "통과 뒤 관할 파일이 바뀌어 바뀐 부분을 다시 본다";
}

export function preCommit(root, env = process.env) {
  const status = reviewStatus(root, env);
  const needed = status.filter((s) => !s.passed);
  if (needed.length === 0) {
    const asked = status.filter((s) => s.last.verdict === ASK);
    if (asked.length === 0) {
      return { code: 0, message: "" };
    }
    const lines = [
      `${ASK} 판정이 있어 커밋은 통과시켰다. 아래 내용이 의도와 맞는지 사용자에게 물어라. 고치기로 하면 추가 커밋으로 고친다.`,
    ];
    for (const s of asked) {
      lines.push("", `- ${s.agent}:`, s.last.reason);
    }
    return { code: 0, message: lines.join("\n") };
  }
  const lines = [
    "리뷰어 판정이 없어 커밋을 막았다. 아래 리뷰어를 Agent 도구로 한 메시지에서 함께 불러 병렬로 검토받아라.",
    "리뷰어에게 주는 프롬프트는 훅이 고정 문장으로 바꾸므로 따로 쓸 필요가 없다.",
    "",
  ];
  for (const s of needed) {
    lines.push(`- ${s.agent}: ${describe(s)}`);
    for (const f of s.files) {
      lines.push(`    ${f.path}`);
    }
  }
  lines.push(
    "",
    "반려되면 지적을 고치고 git add 한 뒤 다시 커밋해라. 관할 파일이 바뀐 리뷰어만 바뀐 부분을 다시 본다.",
  );
  if (env.GIT_INDEX_FILE && path.basename(env.GIT_INDEX_FILE) !== "index") {
    lines.push(
      "git commit -a 나 경로를 지정한 커밋은 리뷰어가 본 인덱스와 다르다. git add 로 스테이지하고 인자 없이 커밋해라.",
    );
  }
  return { code: 1, message: lines.join("\n") };
}

const quote = (s) => `'${s.replaceAll("'", "'\\''")}'`;

export function subagentStart(input, root) {
  const s = reviewStatus(root).find((x) => x.agent === input.agent_type);
  if (!s) {
    return null;
  }
  const tree = indexTree(root);
  // 중단된 리뷰는 SubagentStop 이 오지 않아 표시가 남는다. 같은 리뷰어는 한 번에 하나만 돈다고 보고 지운다.
  for (const e of verdictEntries(root)) {
    if (e.name === `${s.agent}${PENDING}`) {
      rmSync(e.file, { force: true });
    }
  }
  pruneVerdicts(root);
  writeVerdictFile(root, tree, `${s.agent}${PENDING}`, {
    agentId: input.agent_id,
    fingerprint: s.fingerprint,
  });
  const files = s.files.map((f) => quote(f.path)).join(" ");
  const lines = [
    "이번 실행은 커밋 전 리뷰다. 파일을 고치지 말고 판정만 한다. 파일 쓰기 도구와 git 상태를 바꾸는 명령은 훅이 막는다.",
    `검토 대상은 스테이지된 아래 파일이다: ${s.files.map((f) => f.path).join(", ")}`,
  ];
  if (s.last?.tree && s.last.fingerprint !== s.fingerprint) {
    lines.push(
      `지난 검토(판정: ${s.last.verdict}) 이후 바뀐 부분만 본다: git diff ${s.last.tree} ${tree} -- ${files}`,
    );
    if (s.last.verdict === REJECT && s.last.reason) {
      lines.push(
        "지난 반려의 지적이 해결됐는지도 확인한다. 지난 반려 내용:",
        s.last.reason,
      );
    }
  } else {
    lines.push(`변경은 git diff --cached -- ${files} 로 본다.`);
  }
  lines.push(
    `마지막 줄에 ${VERDICT_FORMAT}를 쓴다. ${REJECT}이면 그 위에 고칠 점을 파일:줄과 함께 쓴다.`,
    `${ASK} 는 파일과 규칙 문서만으로는 판정할 수 없고 작성자의 의도에 달린 지적이 있을 때만 쓴다. 그 위에 사용자에게 물을 점을 파일:줄과 함께 쓴다. 확인할 수 있는 지적이 하나라도 ${REJECT} 감이면 ${REJECT} 를 쓴다.`,
  );
  return {
    hookSpecificOutput: {
      hookEventName: "SubagentStart",
      additionalContext: lines.join("\n"),
    },
  };
}

function lastAssistantText(transcript) {
  if (!transcript || !existsSync(transcript)) {
    return "";
  }
  const entries = readFileSync(transcript, "utf8").trim().split("\n");
  for (let i = entries.length - 1; i >= 0; i--) {
    const entry = safeParse(entries[i]);
    const content = entry?.type === "assistant" ? entry.message?.content : null;
    const text = Array.isArray(content)
      ? content
          .filter((c) => c.type === "text")
          .map((c) => c.text)
          .join("\n")
      : "";
    if (text) {
      return text;
    }
  }
  return "";
}

function safeParse(line) {
  try {
    return JSON.parse(line);
  } catch {
    return null;
  }
}

export function subagentStop(input, root) {
  const pending = pendingOf(root, input.agent_id);
  if (!pending) {
    return null;
  }
  const agent = input.agent_type;
  const done = () => {
    rmSync(pending.file, { force: true });
    pruneVerdicts(root);
  };
  const message =
    input.last_assistant_message ||
    lastAssistantText(input.agent_transcript_path);
  const verdict = [...message.matchAll(VERDICT_RE)].at(-1)?.[1];
  if (!verdict) {
    if (!input.stop_hook_active) {
      return {
        decision: "block",
        reason: `판정이 없다. 마지막 줄에 ${VERDICT_FORMAT}를 써라.`,
      };
    }
    done();
    return null;
  }
  done();
  const now = reviewStatus(root).find((s) => s.agent === agent);
  if (now?.fingerprint !== pending.fingerprint) {
    return {
      systemMessage: `${agent} 검토 중에 스테이지가 바뀌어 판정을 기록하지 않았다.`,
    };
  }
  recordVerdict(root, pending.tree, agent, {
    verdict,
    fingerprint: pending.fingerprint,
    reason: verdict === PASS ? null : message.slice(-REASON_LIMIT),
  });
  return null;
}

function deny(reason) {
  return {
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "deny",
      permissionDecisionReason: reason,
    },
  };
}

function writesVerdict(input, root) {
  const target = input.tool_input?.file_path ?? input.tool_input?.notebook_path;
  if (WRITE_TOOLS.has(input.tool_name) && typeof target === "string") {
    const rel = path.relative(
      root,
      path.resolve(input.cwd || process.cwd(), target),
    );
    return rel === VERDICTS || rel.startsWith(`${VERDICTS}/`);
  }
  return false;
}

// 메인 에이전트가 리뷰어의 판단을 이끌지 못하게 프롬프트를 고정하고, 모델은 에이전트 정의를 따르게 한다.
function pinReviewerPrompt(input) {
  const type = input.tool_input?.subagent_type;
  if (!AGENT_TOOLS.has(input.tool_name) || !type?.endsWith(SUFFIX)) {
    return null;
  }
  const { model, ...rest } = input.tool_input;
  return {
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "allow",
      updatedInput: { ...rest, prompt: REVIEW_PROMPT },
    },
  };
}

export function preToolUse(input, root) {
  const pinned = pinReviewerPrompt(input);
  if (pinned) {
    return pinned;
  }
  const command =
    input.tool_name === "Bash" ? String(input.tool_input?.command ?? "") : "";
  if (writesVerdict(input, root) || command.includes(VERDICT_MARK)) {
    return deny("판정 기록은 훅만 쓴다. 리뷰어를 불러 판정을 받아라.");
  }
  if (input.agent_id && pendingOf(root, input.agent_id)) {
    if (WRITE_TOOLS.has(input.tool_name)) {
      return deny("리뷰어는 파일을 고치지 않는다. 지적은 판정 메시지에 쓴다.");
    }
    if (GIT_MUTATING_RE.test(command)) {
      return deny(
        "리뷰어는 git 상태를 바꾸지 않는다. 조회(diff, show, log)만 한다.",
      );
    }
  }
  if (SKIP_HOOKS_RE.test(command)) {
    return deny("커밋 훅을 건너뛰지 않는다(AGENTS.md).");
  }
  return null;
}

const HANDLERS = {
  PreToolUse: preToolUse,
  SubagentStart: subagentStart,
  SubagentStop: subagentStop,
};

function main() {
  if (process.argv[2] === "pre-commit") {
    try {
      const { code, message } = preCommit(
        git(process.cwd(), ["rev-parse", "--show-toplevel"]).trim(),
      );
      if (message) {
        console.error(message);
      }
      return code;
    } catch (e) {
      console.error(`코드 리뷰 설정 오류로 커밋을 막았다: ${e.message}`);
      return 1;
    }
  }
  const input = safeParse(readFileSync(0, "utf8"));
  const handler = HANDLERS[input?.hook_event_name];
  if (!handler) {
    return 0;
  }
  let top;
  try {
    top = git(input.cwd || process.cwd(), [
      "rev-parse",
      "--show-toplevel",
    ]).trim();
  } catch {
    return 0;
  }
  const output = handler(input, top);
  if (output) {
    process.stdout.write(JSON.stringify(output));
  }
  return 0;
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  process.exit(main());
}
