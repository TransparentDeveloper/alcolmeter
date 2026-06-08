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

## 사이트맵 동기화 규칙

`src/routes/` 아래에서 다음 작업이 발생하면 반드시 `static/sitemap.xml`도 함께 수정한다:

- 새 페이지 추가 (`+page.svelte` 생성) → `<url>` 항목 추가
- 페이지 제거 → 해당 `<url>` 항목 삭제
- 라우트 디렉토리 이름 변경 (URL 변경) → `<loc>` 수정

### sitemap.xml 작성 기준

- `<loc>`: `https://alcolmeter.kr/{경로}`
- `<lastmod>`: 작업일 (YYYY-MM-DD)
- `<changefreq>`: 페이지 성격에 맞게 선택
  - 자주 바뀌는 콘텐츠: `weekly`
  - 일반 페이지: `monthly`
  - 거의 안 바뀌는 페이지 (약관, 개인정보 등): `yearly`
- `<priority>`: 홈 `1.0` → 주요 기능 `0.9` → 보조 페이지 `0.7` → 법적 페이지 `0.3`
