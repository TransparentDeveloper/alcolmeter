# apps/web

## 사이트맵 동기화 규칙

`src/routes/` 아래에서 다음 작업이 발생하면 반드시 `static/sitemap.xml`도 함께 수정한다:

- 새 페이지 추가 (`+page.svelte` 생성) → `<url>` 항목 추가
- 페이지 제거 → 해당 `<url>` 항목 삭제
- 라우트 디렉토리 이름 변경 (URL 변경) → `<loc>` 수정

### sitemap.xml 작성 기준

- `<loc>`: `https://alcolmeter.vercel.app/{경로}`
- `<lastmod>`: 작업일 (YYYY-MM-DD)
- `<changefreq>`: 페이지 성격에 맞게 선택
  - 자주 바뀌는 콘텐츠: `weekly`
  - 일반 페이지: `monthly`
  - 거의 안 바뀌는 페이지 (약관, 개인정보 등): `yearly`
- `<priority>`: 홈 `1.0` → 주요 기능 `0.9` → 보조 페이지 `0.7` → 법적 페이지 `0.3`
