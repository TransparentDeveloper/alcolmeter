# 시스템 아키텍처

alcolmeter.kr 의 서비스 구성, 앱 경계, 주소, 배포 구조를 다룬다. 메인 에이전트가 관리한다.

## 서비스

- alcolmeter.kr 에 여러 서비스를 올린다. 주 서비스는 주류 유통 플랫폼이고, 글과 계산기는 부가 서비스다.
- 유통 플랫폼은 별도 앱으로 둔다. 폴더와 이름은 정하지 않았다.
- 통합검색은 범위 밖이다.

## 앱 구성

| 폴더 | 패키지 | 주소 | 기술 | 브랜드 |
| --- | --- | --- | --- | --- |
| `apps/web` | `@alcolmeter/web` | `/`(통합홈) | Next.js | 알콜미터(사이트 전체) |
| `apps/articles` | `@alcolmeter/articles` | `/articles`, `/articles/{id}` | Astro | 알콜피드 |
| `apps/calculators` | `@alcolmeter/calculators` | `/calculators`, `/calculators/{술}` | Next.js 정적 export(React) | - |
| `packages/ds` | `@alcolmeter/ds` | - | 토큰 CSS, 글꼴, 컴포넌트 | - |

- 첫 계산기는 `cider`(`/calculators/cider`)다.
- 사이트 첫 화면을 가리키는 링크는 `/` 를 쓴다.

## 이름 규칙

- 서비스 앱의 폴더 이름과 주소의 첫 경로를 같게 짓는다. 복수형으로 쓴다.
- `web` 은 경로가 없는 입구라 예외다.
- 패키지 이름은 `@alcolmeter/{폴더}` 다.

## 경계

- 앱이 ds 를 쓰고, ds 는 앱을 모른다.
- ds 의 컴포넌트는 `.astro` 라 React 앱(web, calculators)이 쓸 수 없다. React 앱과 공유하는 것은 토큰 CSS 다.
- 공통 헤더를 ds 에 React 로 둘지는 정하지 않았다. 이슈 "apps/web 통합홈 만들기" 의 결정할 것이다.
- 한 서비스만 쓰는 설정, 자원, 스크립트는 그 앱 폴더에 둔다. 루트에는 워크스페이스 공통 설정과, 도구가 루트 위치를 요구하는 파일(`.github/workflows/`)만 둔다.

## 배포

- 앱마다 별도 Vercel 프로젝트(Hobby)로 배포한다. 각 프로젝트의 Root Directory 는 자기 앱 폴더다.
- 도메인 alcolmeter.kr 은 web 프로젝트가 갖는다. web 이 `/articles/*` 와 `/calculators/*` 를 각 프로젝트의 배포 주소로 rewrite 한다.
- 서비스 앱은 자기 주소 아래에서만 파일을 내보낸다.
  - articles: Astro `base: '/articles'`. RSS, sitemap, favicon, 정적 자원까지 `/articles` 아래에 둔다.
  - calculators: Next `basePath: '/calculators'`.
- robots.txt 와 앱별 sitemap 을 묶는 일은 web 이 맡는다.
- 변경 없는 프로젝트는 배포를 건너뛴다. 예약 발행 커밋이 다른 앱을 다시 배포하지 않게 한다.

## 현재 코드와 이 문서의 차이 (옮길 목록)

지금 코드는 아래 상태다. 항목마다 옮기는 이슈를 적는다. 옮기면 그 항목을 지운다.

- 앱은 `apps/blog`(`@alcolmeter/blog`) 하나다. `apps/web`, `apps/calculators` 는 없다. 이슈 "apps/blog 를 apps/articles 로 옮기기", "apps/web 통합홈 만들기".
- `apps/blog` 의 주소는 아래와 같다. `base` 가 없어 favicon, `robots.txt`, `sitemap-index.xml` 도 사이트 루트에 나간다. 이슈 "apps/blog 를 apps/articles 로 옮기기".

  | 주소 | 파일 | 내용 |
  | --- | --- | --- |
  | `/` | 없음 | `/posts` 로 302 리다이렉트 |
  | `/posts` | `src/pages/posts/index.astro` | 글 목록 |
  | `/posts/{id}` | `src/pages/posts/[id].astro` | 글 상세. `id` 는 글 폴더 번호 |
  | `/rss.xml` | `src/pages/rss.xml.ts` | RSS |

- `/` 는 통합홈이 생기기 전까지 `/posts` 로 302(임시) 리다이렉트한다. 배포의 HTTP 302 는 루트 `vercel.json` 의 `redirects`(`statusCode: 302`)가 낸다. `apps/blog/astro.config.mjs` 의 `redirects` 는 개발 서버의 302 와, 정적 출력에 남는 `dist/index.html`(meta refresh 대체 페이지)을 만든다. 두 곳은 함께 고친다. 글 목록을 가리키는 링크는 `/posts` 를 쓴다. 이슈 "apps/web 통합홈 만들기".
- 배포는 루트 `vercel.json` 하나로 하는 Vercel 프로젝트 하나다. 도메인도 이 프로젝트가 갖는다. 이슈 "Vercel 프로젝트 3개 설정과 도메인을 web 으로 옮기기".
