# apps/web

## 커맨드

```bash
pnpm dev      # 개발 서버
pnpm build    # 프로덕션 빌드
pnpm check    # 타입 체크
```

## 페이지 구조 규칙

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

## 사이트맵 규칙

사이트맵은 **동적 엔드포인트** `src/routes/sitemap.xml/+server.ts`가 생성한다 (`prerender = true`라 빌드 시 정적 파일로 출력). 정적 `static/sitemap.xml`은 사용하지 않는다.

- **고정 페이지**: `+server.ts`의 `staticEntries` 배열을 직접 수정한다.
  - 새 페이지 추가 (`+page.svelte` 생성) → `staticEntries`에 항목 추가
  - 페이지 제거 → 해당 항목 삭제
  - 라우트 디렉토리 이름 변경 → `loc` 수정
- **용어사전(`/dictionary/*`)**: `src/content/dictionary/*.md` frontmatter에서 **자동 생성**된다. 용어를 추가·삭제해도 사이트맵은 손대지 않는다.

### 작성 기준

- `loc`: `https://alcolmeter.kr/{경로}` (한글 slug는 `encodeURIComponent`)
- `lastmod`: 작업일 (YYYY-MM-DD). 용어는 frontmatter `updated` 사용
- `changefreq`: 자주 바뀌는 콘텐츠 `weekly`(또는 `daily`) · 일반 `monthly` · 약관 등 `yearly`
- `priority`: 홈 `1.0` → 주요 기능 `0.9` → 보조 페이지 `0.7` → 용어 페이지 `0.6` → 법적 페이지 `0.3`

## 용어사전(/dictionary) 콘텐츠 규칙

- 용어 파일: `src/content/dictionary/{slug}.md` (mdsvex). frontmatter: `title·slug·summary·category·domain·order·related·updated`.
- **slug은 공백 없이** 한 토큰으로 둔다 (예: `알코올발효`, `효모내성`). URL이 `%20`으로 깨지거나 공유·메신저에서 잘리는 것을 막는다. 표시 이름은 `title`에 공백 그대로 둔다 (예: `알코올 발효`).
- 본문 위키링크는 `[[slug]]`, 표시문구가 slug와 다르면 `[[slug|표시]]` (예: `[[알코올발효|알코올 발효]]`).
- `related`는 slug 배열. 인덱스 정렬은 `order`(작을수록 먼저, 10단위 갭), 관련용어 박스는 가나다순.
