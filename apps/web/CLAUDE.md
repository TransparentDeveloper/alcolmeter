# apps/web

## 커맨드

```bash
pnpm dev      # 개발 서버
pnpm build    # 프로덕션 빌드
pnpm check    # 타입 체크
```

## 아키텍처 (FSD)

`apps/web`은 Feature-Sliced Design으로 전환 중이다. **새 페이지를 만들거나 기존 페이지 구조를 개선할 때는 `docs/convention/architecture.md`를 먼저 읽고 그 컨벤션(레이어·세그먼트·배럴·import 규칙)을 따른다.** 마이그레이션은 페이지 단위로 점진 진행하며, 아직 옮기지 않은 페이지는 아래 레거시 규칙을 유지한다.

## 페이지 구조 규칙 (레거시 · 미마이그레이션 페이지 한정)

> FSD로 마이그레이션한 페이지에는 적용하지 않는다. 신규·개선 작업은 `docs/convention/architecture.md`를 따른다.

로직이 있는 페이지는 라우트 디렉토리 안에 다음 세 파일로 구성한다:

```
src/routes/{page}/
  types.ts               ← 이 페이지에서만 쓰는 타입 (export만, 로직 없음)
  use{Page}.svelte.ts    ← $state/$derived + 도메인 호출 (한글 문자열 없음)
  +page.svelte           ← 텍스트 데이터(라벨·힌트 등) + 템플릿
```

### 역할 분리 원칙

- **`types.ts`**: 타입만 export. 구현 없음.
- **`use{Page}.svelte.ts`**: 상태·파생값·도메인 호출. 한글 문자열을 두지 않는다. 표시용 텍스트는 파라미터로 주입받는다.
- **`+page.svelte`**: 텍스트 데이터(탭 라벨, 단계 이름, 힌트 등)를 스크립트에서 정의하고 hook에 주입한다. 템플릿과 스타일만 나머지에 둔다.

### 참고: `src/routes/makgeolli/`

## SEO·공유 메타 규칙 (레거시 · 미마이그레이션 페이지 한정)

> FSD로 마이그레이션한 페이지는 SEO를 `apps` 레이어에서 `shared/ui/MetaHead`로 주입한다. 아래는 아직 옮기지 않은 페이지 기준이다.

페이지의 title·description·canonical·OpenGraph·Twitter 메타는 `src/lib/components/Seo.svelte` 한 컴포넌트로 주입한다.

- 각 페이지 `+page.svelte`에서 `<Seo title=… description=… path=… image=… />`를 호출한다. 구조화 데이터(JSON-LD)는 페이지의 별도 `<svelte:head>`에 둔다.
- **`app.html`에는 전역 공유 메타(title·description·og·twitter)를 두지 않는다.** app.html 정적 메타와 페이지 `<svelte:head>`가 합쳐져 태그가 중복되기 때문이다. 전 페이지 공통 메타(keywords·author·theme-color·site-verification)만 app.html에 둔다.
- **OG 이미지**는 `static/og/{page}.png`(1200×630)로 페이지별로 두고 `image` prop에 `/og/{page}.png`를 넘긴다. 알콜위키 개별 용어(`/wiki/{slug}`)는 `main_image ?? /og/dictionary.png`를 쓴다(등록된 이미지가 없으면 공통 이미지로 대체).
- OG 이미지를 새로 만들거나 디자인시스템 변경으로 다시 뽑을 때는 `/alcol-og-image` 스킬(템플릿 + Playwright 렌더)을 쓴다.

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
