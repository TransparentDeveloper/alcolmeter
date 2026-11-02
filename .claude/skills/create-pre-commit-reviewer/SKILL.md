---
name: create-pre-commit-reviewer
description: 커밋 게이트 리뷰어 에이전트를 새로 만들 때 쓴다. 이름, 판단 범위, 활성 범위와 배제 규칙, 판정 기준을 사용자에게 묻고 확인받아 에이전트 정의와 게이트 설정을 정해진 양식으로 만든다.
---

# 커밋 게이트 리뷰어 만들기

사용자에게 정의를 묻고 확인받아 두 파일을 만든다.

- 에이전트 정의: `.claude/agents/pre-commit/{이름}.md`
- 게이트 설정: `.claude/hooks/code-review/reviewers/{이름}/config.json`

게이트(`.claude/hooks/code-review/index.mjs`)는 두 파일을 아래처럼 다룬다.

- 이름이 `-reviewer` 로 끝나야 한다.
- 정의에 `tools` 가 있어야 하고, `*`, Edit, Write, MultiEdit, NotebookEdit 는 줄 수 없다.
- 설정 폴더가 워크트리에 생기면 커밋 전이라도 바로 게이트에 걸린다.
- 판정 형식(`VERDICT:` 줄)과 ASK 를 쓰는 일반 조건은 게이트가 리뷰어 시작 때 넣어 준다.

## 묻기

아래를 하나씩 묻는다. 사용자가 답하지 않은 항목을 짐작으로 채우지 않는다.

1. 이름: `-reviewer` 로 끝나는 이름. 기존 `.claude/agents/pre-commit/` 의 이름과 겹치지 않아야 한다.
2. 판단하는 것: 리뷰어가 보는 관점. 항목별로 받는다.
3. 판단하지 않는 것: 다른 관점으로 번지지 않게 보지 않을 것을 받는다.
4. 참고 문서: 리뷰어가 작업 전에 읽을 문서 경로. 없어도 된다.
5. 활성 범위: 관할로 볼 파일 경로 글롭(`paths`)이나, 추가된 줄에 맞출 정규식(`content`). 하나 이상 받는다.
6. 배제 규칙: 활성 범위에 걸리지만 관할에서 뺄 파일 경로 글롭(`exclude`). 없어도 된다.
7. 판정 기준
   - FAIL: 무엇이 하나라도 있으면 FAIL 인지
   - ASK: 이 리뷰어에서 작성자 의도에 달려 파일과 문서만으로는 판정할 수 없는 경우. 게이트가 넣는 일반 조건을 다시 적지 않고, 이 리뷰어에만 해당하는 경우만 받는다. 없으면 적지 않는다.
   - 판정에 넣지 않고 제안으로만 적을 것
8. 도구와 모델: 기본은 `Read, Grep, Glob, Bash` 와 `opus` 다. Bash 를 주면 git 조회(diff, show)에만 쓰게 한다.
9. 추가 섹션: 양식 밖에 넣을 섹션의 제목과 내용. 없어도 된다.

## 범위 확인

활성 범위와 배제 규칙을 받으면, 실제로 걸리는 파일을 뽑아 보여 주고 의도와 맞는지 확인받는다.

```sh
node --input-type=module -e '
import { parseReviewer } from "./.claude/hooks/code-review/index.mjs";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
const config = JSON.parse(process.argv[1]);
const files = execFileSync("git", ["ls-files"], { encoding: "utf8" }).split("\n").filter(Boolean);
const all = parseReviewer("preview", { ...config, exclude: [] });
const kept = parseReviewer("preview", config);
const read = (p) => { try { return readFileSync(p, "utf8").split("\n"); } catch { return []; } };
for (const p of files) {
  const file = { path: p, added: config.content ? read(p) : [] };
  if (kept.covers(file)) console.log("관할 " + p);
  else if (all.covers(file)) console.log("배제 " + p);
}
' '{"paths":["..."],"exclude":["..."]}'
```

- `content` 는 원래 스테이지된 추가 줄에 맞춘다. 미리보기는 파일 전체 줄로 보므로 "그 정규식에 맞는 줄이 있는 파일" 로 읽는다고 알린다.
- 의도와 다르면 5~6으로 돌아간다.

## 정의 양식

아래 순서로 쓴다. 추가 섹션은 사용자가 정한 위치에 넣고, 정하지 않았으면 "판정 기준" 앞에 넣는다. 다른 리뷰어를 언급하지 않는다.

````md
---
name: {이름}
description: 커밋 전에 스테이지된 {대상}이 {관점}인지 판정한다. 커밋 게이트 훅이 검토를 요구할 때 쓴다. 파일을 고치지 않고 판정과 지적만 돌려준다.
tools: {도구}
model: {모델}
---

너는 {대상} 리뷰어다. 파일을 고치지 않고 판정과 지적만 한다. Bash 는 git 조회(diff, show)에만 쓴다.

## 참고 문서

{참고 문서 경로}. 작업 전에 읽는다.

## 입력

호출한 쪽이 검토 대상 경로 목록을 준다. 목록이 없으면 판정 없이 "검토 대상 목록이 필요하다"고만 답한다.

바뀐 부분만 보라는 지시를 받으면 지적은 바뀐 부분과, 그 변경 때문에 어긋난 곳에만 한다.

## 판단하는 것

- {항목}

{판단하지 않는 것}은 보지 않고 적지도 않는다.

## 판정 기준

- FAIL: {FAIL 조건}
- ASK: {ASK 조건}
- {제안으로만 적을 것}은 제안으로만 적고 판정에 넣지 않는다.

## 출력 형식

지적마다 한 항목씩 쓴다. FAIL 사유, 물을 점, 제안 순서로 쓴다.

- 구분: FAIL 사유 / 물을 점 / 제안
- 위치: `경로:줄번호`
- 내용: 무엇이 왜 문제인지 한두 문장
- 제안: 어떻게 고치면 되는지 한 문장

지적이 없으면 "지적 없음"이라고만 쓴다.

마지막 줄은 반드시 아래 셋 중 하나만 쓴다. 이 줄은 커밋 게이트가 기계적으로 읽는다.

VERDICT: PASS
VERDICT: FAIL
VERDICT: ASK
````

- 참고 문서가 없으면 "참고 문서" 섹션을 뺀다.
- Bash 를 주지 않으면 첫 단락의 Bash 문장을 뺀다.
- ASK 조건이 없으면 그 줄을 뺀다.

## 설정 양식

받은 키만 쓴다.

```json
{
  "paths": ["..."],
  "content": ["..."],
  "exclude": ["..."]
}
```

## 만들기

1. 정의 초안과 설정 초안을 사용자에게 보여 주고 승인을 받는다.
2. 정의 파일을 먼저 쓰고 설정 파일을 쓴다. 설정이 먼저 생기면 정의가 없어 게이트가 실패한다.
3. `node --test .claude/hooks/code-review/*.test.mjs` 를 실행해 게이트 테스트가 통과하는지 본다.
4. 만든 두 파일 경로를 보고하고 끝낸다. 커밋은 사용자가 지시하면 한다.
