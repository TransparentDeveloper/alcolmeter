# @alcolmeter/blog

alcolmeter 블로그 사이트다. 글 목록, 글 상세, RSS 를 제공하고 정적 페이지로 만들어 Vercel 에 배포한다.

## 주소

주소와 리다이렉트는 `.claude/docs/fe/아키텍처.md` "라우트" 절이 원본이다.

## 글 상태

글 frontmatter 의 `status` 가 공개 여부를 정한다. 배포에는 `published` 글만 나가고, 개발 서버에는 모든 글이 보인다.

| status | 뜻 | 함께 쓰는 필드 |
| --- | --- | --- |
| `draft` | 작업 중 | 없음 |
| `ready` | 검수를 마치고 발행을 기다림 | `readyAt`(ready 로 바꾼 시각. `2026-10-19T14:30+09:00` 처럼 초 없이 시각과 시간대까지, 달력에 있는 값으로 쓴다) |
| `published` | 발행됨 | `publishedAt`(발행일) |

`ready` 와 `published` 글은 참고 자료가 1개 이상 있어야 하고 임시 표지를 쓸 수 없다.

## 예약 발행

`.github/workflows/publish.yml` 이 매일 20:47(KST)에 이 디렉터리에서 `scripts/publish-next.mjs` 를 실행해 `ready` 글 1개를 발행한다. `readyAt` 이 가장 이른 글을 고르고, 같으면 폴더 번호가 작은 글을 고른다. 고른 글을 `status: published` 로 바꾸고 `publishedAt` 에 그날 날짜(KST)를 넣은 다음, 빌드가 통과하면 main 에 push 한다. Vercel 은 이 push 로 배포한다.

- GitHub 의 예약 실행은 예약 시각보다 늦게 돌거나 건너뛸 수 있다.
- `ready` 글이 없거나, 고른 글의 `cover` 가 아직 임시 표지(`draft-cover`)면 워크플로가 실패해 알림이 간다. 이때는 아무 글도 발행하지 않는다. 발행 뒤 남은 `ready` 글이 없으면 경고를 남긴다.
- Actions 탭에서 손으로 실행(`workflow_dispatch`)하거나 `gh workflow run publish.yml` 을 실행하면 바로 1개를 발행한다. 예약 실행이 건너뛰어졌을 때 쓴다.

## 실행

이 디렉터리에서 실행한다.

```
pnpm dev       개발 서버 (draft·ready 글도 보임)
pnpm build     정적 빌드 (published 글만)
pnpm preview   빌드 결과 미리보기
```
