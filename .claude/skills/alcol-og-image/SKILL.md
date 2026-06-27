---
name: alcol-og-image
description: >-
  alcolmeter web의 OG(공유 미리보기) 이미지를 디자인시스템 "측정 노트" 톤 템플릿에서 자동 생성·갱신하는 스킬.
  새 페이지의 공유 이미지를 만들거나, 기존 이미지를 다시 뽑거나, 디자인시스템이 바뀌어 전체를 재생성할 때 사용하세요.
  "og 이미지", "공유 이미지", "공유 카드", "썸네일 만들어", "미리보기 이미지", "소셜 이미지" 같은 맥락이면
  사용자가 'OG'라고 명시하지 않아도 이 스킬을 사용하세요. 1200×630 PNG를 `apps/web/static/og/{page}.png`에
  저장하고 각 페이지의 `<Seo image="/og/{page}.png" />`에 연결합니다.
---

# alcolmeter OG 이미지 생성

web 페이지별 OG(공유 미리보기) 이미지를 **손으로 디자인하지 않고**, 디자인시스템 토큰을 박아 둔 템플릿(`og-template.html`)에서 헤드리스 브라우저로 자동 렌더한다. 페이지가 늘면 텍스트 한 줄만 더하고, 디자인시스템이 바뀌면 템플릿 CSS만 고쳐 전부 다시 뽑는다.

## 결과물

- 1200×630 PNG → `apps/web/static/og/{page}.png`
- 각 페이지 `<svelte:head>`의 `<Seo image="/og/{page}.png" />` (컴포넌트: `apps/web/src/lib/components/Seo.svelte`)

## 디자인 — "측정 노트" 톤 (design-system 토큰)

- **배경**: dot-grid 모눈 종이를 **전면**에 깐다 (흰 카드 없음). `radial-gradient(--grid 1.5px) 32px`
- **색**: `--bg #f2f4f7`, `--ink1 #141825`(제목), `--ink3 #5c6478`(부제·라벨), `--spark #f2512d`는 **붉은 점 하나에만** (브랜드 `알콜미터.`의 점)
- **타이포**: 제목·부제는 Pretendard(한글), 라벨·URL·눈금은 Geist Mono
- **구성**: 상단 `알콜미터.` + `BREWING CALCULATOR` / 중앙 큰 제목 + 부제 / 하단 `alcolmeter.kr` + 측정 눈금
- **손그림 밑줄은 쓰지 않는다** (사용자 선호: 절제)
- 템플릿 파일: 이 스킬 폴더의 `og-template.html`. `#title`·`#subtitle` 텍스트만 페이지별로 교체한다.

## 페이지 목록 (이미지에 들어가는 문구)

이미지 속 제목/부제는 시각용이며, 페이지 `<title>`·`description`(SEO 메타)과는 별개다.

| 파일 | 제목(`#title`) | 부제(`#subtitle`) |
|---|---|---|
| `home.png` | 전통주 양조 계산기 | 쌀의 양만 입력하면 최적의 배합 비율을 알려드립니다 |
| `makgeolli.png` | 막걸리 계산기 | 쌀 총량과 형태를 입력하면 단·이·삼양주 배합을 자동 계산합니다 |
| `dictionary.png` | 전통주 용어사전 | 막걸리·전통주 양조 용어를 입문자 눈높이로 풀어 설명합니다 |
| `faq.png` | 자주 묻는 질문 | 막걸리 도수·생산량 예측, 배합 계산에 대한 질문과 답변 |
| `settings.png` | 설정 | 화면 테마 등 알콜미터 환경설정 |
| `privacy.png` | 개인정보처리방침 | 알콜미터는 사용자 데이터를 수집하지 않습니다 |

> 용어사전 개별 용어(`/dictionary/[slug]`)는 **용어별 이미지를 만들지 않고** 공통 `dictionary.png`를 쓴다.

## 생성 절차 (Playwright MCP)

1. **로컬 HTTP 서버로 템플릿을 띄운다** (`file://`는 브라우저가 차단함). 이 스킬 폴더에서:
   ```bash
   python3 -m http.server 8765
   ```
2. **Playwright**로 렌더한다:
   - `browser_navigate` → `http://localhost:8765/og-template.html`
   - `browser_resize` → width 1200, height 630
   - `browser_evaluate` → `async () => { await document.fonts.ready; }` (웹폰트 로딩을 기다린다)
   - 페이지마다: `browser_evaluate`로 `#title`·`#subtitle`의 `textContent`를 바꾼 뒤 `browser_take_screenshot`
3. **스크린샷을 옮긴다**: Playwright MCP는 허용된 루트(`.playwright-mcp` 임시 폴더)에만 저장할 수 있다. 거기에 저장한 뒤 `apps/web/static/og/{page}.png`로 복사한다.
4. **페이지에 연결**: 해당 페이지의 `<Seo image="/og/{page}.png" />`를 확인·수정한다. (기본값은 `/og/home.png`)
5. **검증**: `pnpm build` 후 `.svelte-kit/output/prerendered/pages/*.html`에서 `og:image`가 페이지별로 하나씩 박혔는지 확인한다.

## 실전 함정 (꼭 기억할 것)

- **`file://` 차단** → 반드시 로컬 HTTP 서버를 거친다.
- **폰트 fallback** → `document.fonts.ready`를 기다린 뒤 스크린샷. 안 그러면 Pretendard/Geist Mono가 시스템 폰트로 대체된다.
- **저장 경로** → 스크린샷은 `.playwright-mcp` 루트 안에만 쓸 수 있다. 워크트리로 바로 못 쓰니 저장 후 복사한다.
- **`base64`/`cat`/`cp`가 "command not found"** 날 수 있다(샌드박스 PATH). 파일 복사·인코딩은 `python3`(shutil/base64 모듈)로 처리한다.
- 시안을 사용자에게 보여줄 때는 PNG를 data URI로 인라인한 HTML을 **Artifact**로 발행하면 한 번에 비교할 수 있다(외부 호스트 CSP 차단 때문에 인라인 필수).
