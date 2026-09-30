# @alcolmeter/web

alcolmeter 블로그 사이트. Astro 정적 빌드로 Vercel 에 배포한다.

## 구조

```
src/
  content/posts/{slug}/   글 하나당 폴더. index.mdx 와 이미지를 함께 둔다
  content.config.ts       글 frontmatter 스키마
  layouts/                공통 레이아웃과 메타 태그
  lib/                    글 조회와 날짜 포맷
  pages/                  목록(/), 상세(/posts/{slug}), RSS
```

## 명령어

이 디렉터리에서 실행한다.

```
pnpm dev       개발 서버 (draft 글도 보임)
pnpm build     정적 빌드 (draft 글 제외)
pnpm preview   빌드 결과 미리보기
```
