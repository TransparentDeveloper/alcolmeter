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

글은 writer 에이전트가 쓴다. 메인 에이전트는 글을 직접 쓰거나 고치지 않는다.

1. 비교 표에 쓸 수치(독자가 아는 술의 도수 등)가 대상 폴더의 `research.md` 에 있는지 본다. 없으면 researcher 에이전트에게 그 항목만 넘겨 노트를 보태게 한다.
2. writer 에이전트에게 대상 글 폴더 경로와 주제를 넘겨 `index.mdx` 를 쓰게 한다. writer 는 노트 없이 초안을 쓴 뒤 근거를 대조한다(W-011). 메인 에이전트는 강의 내용이나 질문을 writer 에게 요약해 넘기지 않는다. writer 가 조사가 더 필요하다고 돌려주면 1로 돌아간다.
3. `.nvmrc` 의 Node 버전으로 `pnpm -F @alcolmeter/web build` 를 실행해 글이 빌드되는지 확인한다.

## 리뷰

1. 대상 폴더의 파일을 `git add` 하고, 따로 `git commit` 을 실행한다.
2. 커밋 게이트가 요구하는 리뷰어를 게이트가 안내한 순서대로 부른다.
3. 지적은 루트 `AGENTS.md` 의 "리뷰 지적 처리" 를 따라 반영 여부를 정한다. 반영할 지적과 결정을 같은 writer 에이전트에게 넘겨 고치게 하고, 다시 `git add` 한 뒤 커밋을 다시 실행한다.
4. 커밋이 통과할 때까지 2~3을 되풀이한다. push 는 하지 않는다.

## 그림

커밋이 통과하면 illustrator 에이전트에게 글 경로를 넘겨 `.claude/docs/blog-designer/아이덴티티.md` 원칙 3 에 맞는 그림 초안을 만들게 한다. 초안을 사용자에게 보여 주고 승인을 받는다. 표지는 illustrator 가 frontmatter 에 넣고, 본문 그림은 illustrator 가 돌려준 위치와 alt 안을 writer 에게 넘겨 넣게 한다. 그림을 넣은 뒤에는 위 리뷰 절차를 다시 거쳐 커밋한다.

## 끝

아래를 보고하고 끝낸다.

- 커밋 해시와 글 경로
- 지적별 반영 여부와 이유
- fact-checker 의 "확인 필요" 항목
- illustrator 가 그린 그림 목록
- draft 해제는 Claude 에게 시키라는 것
