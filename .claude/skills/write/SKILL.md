---
name: write
description: lecture 스킬로 강의를 마친 주제를 블로그 글로 쓸 때 쓴다. 강의 자료·강의 내용·질문 파일로 초안을 쓰고, 커밋 리뷰를 통과시켜 draft 해제 직전까지 만든다.
---

# 글쓰기

강의 파일을 바탕으로 글을 쓰고, 커밋 게이트의 리뷰를 모두 통과한 `draft: true` 글로 커밋한다. draft 해제는 하지 않는다.

## 대상 찾기

- 인자로 번호를 받으면 `apps/web/src/content/posts/{번호}/` 를 쓴다.
- 번호가 없으면 `lecture.md` 가 `status: done` 이고 `index.mdx` 가 없는 폴더를 찾는다. 여럿이면 어느 것을 쓸지 묻는다.
- 대상 폴더의 `lecture.md` 가 `status: done` 이 아니면 쓰지 않고 lecture 스킬로 강의를 먼저 마치라고 안내한다.

## 초안

1. 대상 폴더의 `research.md`, `lecture.md`, `questions.md` 와 `.claude/docs/blog-content-reviewer/글쓰기.md`, 루트 `README.md` 의 핵심 타깃을 읽는다.
2. `index.mdx` 를 쓴다.
   - `lecture.md` 의 강의 내용과 `questions.md` 의 질문·답을 합쳐 `글쓰기.md` 의 글 구조에 맞게 다시 짠다. 강의 순서는 따르지 않아도 된다.
   - 사용자가 막힌 곳은 독자도 막힐 곳으로 보고 더 풀어 쓴다.
   - 사실 문장에는 `research.md` 의 출처만 각주로 단다. 노트에 없는 사실은 쓰지 않는다.
   - "엇갈림", "못 찾음" 으로 남은 내용은 단정하지 않거나 뺀다.
   - frontmatter 는 `draft: true`, `publishedAt` 은 오늘 날짜로 둔다.
   - 표지가 아직 없으면 `글쓰기.md` 의 alt 절에 있는 임시 표지 예외를 따른다.
3. `.nvmrc` 의 Node 버전으로 `pnpm -F @alcolmeter/web build` 를 실행해 글이 빌드되는지 확인한다.

## 리뷰

1. 대상 폴더의 파일을 `git add` 하고, 따로 `git commit` 을 실행한다.
2. 커밋 게이트가 요구하는 리뷰어를 게이트가 안내한 순서대로 부른다.
3. 지적은 루트 `AGENTS.md` 의 "리뷰 지적 처리" 를 따라 반영 여부를 정한다. 고친 뒤 다시 `git add` 하고 커밋을 다시 실행한다.
4. 커밋이 통과할 때까지 2~3을 되풀이한다. push 는 하지 않는다.

## 끝

아래를 보고하고 끝낸다.

- 커밋 해시와 글 경로
- 지적별 반영 여부와 이유
- fact-checker 의 "확인 필요" 항목
- 표지를 임시로 뒀다면 진짜 표지가 필요하다는 것
- draft 해제는 Claude 에게 시키라는 것
