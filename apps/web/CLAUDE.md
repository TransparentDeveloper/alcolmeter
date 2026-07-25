# apps/web

## 커맨드

```bash
pnpm dev      # 개발 서버
pnpm build    # 프로덕션 빌드
pnpm check    # 타입 체크
```

## 아키텍처 (FSD)

`apps/web`은 Feature-Sliced Design(FSD)을 따른다. 전 페이지 마이그레이션이 완료됐다. **새 페이지를 만들거나 기존 페이지 구조를 개선할 때는 `docs/convention/architecture.md`를 먼저 읽고 그 컨벤션(레이어·세그먼트·배럴·import 규칙)을 그대로 따른다.**

## SEO·공유 메타 규칙

페이지의 title·description·canonical·OpenGraph·Twitter·JSON-LD 메타는 `apps` 레이어에서 `shared/ui/MetaHead`로 주입한다. 각 페이지의 `apps/{page}/ui/{Page}Application.svelte`에서 `<MetaHead title=… description=… path=… image=… schemas=… />`를 호출한다(JSON-LD는 `schemas` prop으로 넘긴다. 상세는 `docs/convention/architecture.md` §5).

- **`app.html`에는 전역 공유 메타(title·description·og·twitter)를 두지 않는다.** app.html 정적 메타와 페이지 head가 합쳐져 태그가 중복되기 때문이다. 전 페이지 공통 메타(keywords·author·theme-color·site-verification)만 app.html에 둔다.
- **사이트 전역 구조화 데이터(Organization·WebSite)는 `shared/ui/SiteMeta`가 담당**하고 루트 `+layout.svelte`에서 한 번만 호출한다. 페이지별 스키마는 MetaHead의 `schemas`로 넘긴다.
- **색인에서 빼야 하는 화면**(로그인·작성·수정·이력)도 `svelte:head`를 직접 쓰지 않고 MetaHead에 `noindex`를 넘긴다.
- **시점이 있는 콘텐츠**(커뮤니티 글·알콜위키 용어)는 `type="article"`과 `publishedTime`·`modifiedTime`·`authorName`을 함께 넘긴다.
- **OG 이미지**는 `static/og/{라우트}.png`(1200×630)로 페이지별로 두고 `image` prop에 `/og/{라우트}.png`를 넘긴다. 파일명은 라우트를 따른다(`/wiki/guidelines` → `wiki-guidelines.png`). 알콜위키 개별 용어(`/wiki/{slug}`)는 `main_image ?? /og/wiki.png`, 커뮤니티 글(`/community/{id}`)은 본문 첫 이미지 `?? /og/community.png`를 쓴다.
- **`og:image:width/height`는 `/og/*` 경로일 때만 방출된다.** 업로드·외부 이미지는 크기를 모르므로 MetaHead가 알아서 생략한다. 크기를 하드코딩하지 말 것.
- OG 이미지를 새로 만들거나 디자인시스템 변경으로 다시 뽑을 때는 `/alcol-og-image` 스킬(템플릿 + 헤드리스 Chrome 렌더)을 쓴다.

## 사이트맵 규칙

사이트맵은 **동적 엔드포인트** `src/routes/sitemap.xml/+server.ts`가 생성한다 (`prerender = false`라 요청마다 서버에서 생성). 정적 `static/sitemap.xml`은 사용하지 않는다.

- **고정 페이지**: `+server.ts`의 `staticEntries` 배열을 직접 수정한다.
  - 새 페이지 추가 (`+page.svelte` 생성) → `staticEntries`에 항목 추가
  - 페이지 제거 → 해당 항목 삭제
  - 라우트 디렉토리 이름 변경 → `loc` 수정
  - 알콜위키 목록 페이지는 고정 항목 `/wiki`로 들어간다.
- **알콜위키(`/wiki/{slug}`)**: 빌드 시 고정되지 않고 요청마다 `wiki_terms` 테이블을 조회해 **자동 생성**된다. 용어를 추가·수정해도 사이트맵 코드는 손대지 않는다.

### 작성 기준

- `loc`: `https://alcolmeter.kr/{경로}` (한글 slug는 `encodeURIComponent`)
- `lastmod`: 작업일 (YYYY-MM-DD). 알콜위키 용어는 DB `updated_at`을 그대로 사용(자동)
- `changefreq`: 자주 바뀌는 콘텐츠 `weekly`(또는 `daily`) · 일반 `monthly` · 약관 등 `yearly`
- `priority`: 홈 `1.0` → 주요 기능 `0.9` → 보조 페이지 `0.7` → 용어 페이지 `0.6` → 법적 페이지 `0.3`

## 알콜위키(/wiki) 규칙

- 콘텐츠는 파일이 아니라 Supabase에 있다: 현재 버전은 `wiki_terms`, 편집 이력은 `wiki_revisions` 테이블.
- 편집은 앱 UI에서 한다: 가입자가 새 용어를 추가하고(`/wiki/new`) 기존 용어를 수정하며(`/wiki/{slug}/edit`), 이력 조회·되돌리기도 UI에서 처리한다(`/wiki/{slug}/history`).
- `slug`은 제목에서 자동 생성되고(`entities/wiki/lib/slug.ts`) 이후 고정된다.
- 본문은 마크다운으로 저장되고 `shared/lib/wiki-render`가 런타임에 렌더링한다. 위키링크 `[[slug]]`(표시문구가 다르면 `[[slug|표시]]`)를 지원한다.
- 작성·수정 폼의 본문은 `shared/ui/Editor`(합성 툴바 WYSIWYG)로 편집하고, `shared/lib/markdown`이 DOM↔마크다운을 변환한다(`MarkdownWriter`=DOM→md, `MarkdownConverter`=md→편집용 HTML). **저장 포맷은 마크다운 그대로**라 렌더·편집이력·SEO 파이프라인은 손대지 않는다. 사용자에게 마크다운 문법을 노출하지 않는 게 원칙이다.
