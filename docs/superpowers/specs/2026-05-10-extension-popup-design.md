# Extension Popup Calculator — Design Spec

**날짜:** 2026-05-10  
**대상:** `apps/extension`  
**목표:** 도메인 라이브러리를 활용한 막걸리 계산기 팝업 확장프로그램 완성

---

## 1. 개요

WXT 기반 Chrome 확장프로그램의 팝업을 막걸리 배합 계산기로 구현한다. 웹앱(`apps/web`)과 동일한 기능 세트를 제공하되, 팝업 크기에 맞게 압축한다. 계산 로직은 `@alcolmeter/domain`의 `MakgeolliController`에 전적으로 위임한다.

---

## 2. 기술 스택

| 항목 | 선택 | 이유 |
|---|---|---|
| 프레임워크 | Svelte 5 | 웹앱과 동일한 스택, `$state`/`$derived` 반응성 |
| 번들러 | WXT (내장 Vite) | 기존 확장프로그램 빌드 도구 유지 |
| 계산 로직 | `@alcolmeter/domain` | 단일 진실 공급원, 중복 제거 |
| 스타일 | 인라인 CSS (App.svelte `<style>`) | 웹앱 색상 팔레트 동일 적용 |

---

## 3. 파일 구조

```
apps/extension/
  entrypoints/popup/
    index.html          ← <div id="app"> 마운트 포인트, lang="ko"
    main.ts             ← Svelte mount (App.svelte → #app)
    App.svelte          ← 전체 팝업 UI (단일 컴포넌트)
  public/
    logo.svg            ← 기존 유지
  wxt.config.ts         ← Svelte vite plugin 추가
  package.json          ← 의존성 추가
```

---

## 4. 의존성 변경

### `apps/extension/package.json`

추가:
```json
"dependencies": {
  "@alcolmeter/domain": "workspace:*"
},
"devDependencies": {
  "@sveltejs/vite-plugin-svelte": "^7.0.0",
  "svelte": "^5.0.0"
}
```

### `apps/extension/wxt.config.ts`

```ts
import { defineConfig } from 'wxt';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  vite: () => ({ plugins: [svelte()] }),
  manifest: {
    name: 'Alcolmeter',
    description: '막걸리 배합 계산기',
    version: '0.1.0'
  }
});
```

---

## 5. 상태 설계 (`App.svelte`)

```ts
// 입력 상태
let totalRice = $state(0)                          // 쌀 총량 (g)
let riceForm  = $state<RiceFormCode>('JUK')        // 쌀 형태
let waterRatioPercent = $state(100)                // 물 비율 (%)
let nurukRatio = $state(0.20)                      // 누룩 비율 (0~1)
let activeTab  = $state<1 | 2 | 3>(1)             // 선택된 양조 방식

// 파생 계산
const result = $derived(
  totalRice > 0
    ? new MakgeolliController().calculate({
        totalRiceGrams: totalRice,
        riceForm,
        waterRatio: waterRatioPercent / 100,
        nurukRatio,
        brewCount: activeTab
      })
    : null
)
```

**누룩 기본값 정책:**
- 탭 변경 시 자동 세팅: 단양주 `0.20`, 이양주 `0.175`, 삼양주 `0.125`
- 사용자가 슬라이더를 직접 조작한 이후에는 탭 변경 시 자동 세팅하지 않음 (`nurukManuallySet` 플래그로 추적)

**RiceFormCode 타입:** `'GODUBAP' | 'TTEOK' | 'BEOMBUK' | 'JUK'`

---

## 6. UI 레이아웃

팝업 고정 너비: **360px**. 최대 높이: 600px (Chrome 제한).

```
┌─────────────────────────────────────┐
│ 🍶 알콜미터                          │  ← 헤더 (로고 + 타이틀)
├─────────────────────────────────────┤
│ 재료 입력                            │
│  쌀 총량      [________] g          │
│  쌀 형태      [죽          ▼]       │
│  물 비율      [──────────] 100%     │
│  누룩 비율    [──────────]  20%     │
├─────────────────────────────────────┤  ← 조건부: riceForm === 'tteok'
│ ⚠ 떡은 발효가 느리고 단맛이 극단적 …  │
├─────────────────────────────────────┤
│ 배합 결과                            │
│  [단양주] [이양주] [삼양주]          │  ← 탭
│  ┌────────┬──────┬──────┬──────┐   │
│  │ 단계   │  쌀  │  물  │ 누룩 │   │
│  ├────────┼──────┼──────┼──────┤   │
│  │ 밑술   │ 200g │ 600g │  40g │   │
│  │ 덧술   │ 800g │   0g │   0g │   │
│  ├────────┼──────┼──────┼──────┤   │
│  │ 합계   │1000g │ 600g │  40g │   │
│  └────────┴──────┴──────┴──────┘   │
│  예상 생산량: 약 900g               │
└─────────────────────────────────────┘
```

**예상 생산량 계산:** `(총쌀 × 0.3) + 총물` — 웹앱 FAQ와 동일한 공식.

---

## 7. 스타일 원칙

웹앱의 CSS 변수와 동일한 팔레트 사용:
- `--color-primary: #2563eb`
- `--color-bg: #f9fafb`
- `--color-text: #111827`
- `--color-muted: #6b7280`
- `--radius: 8px`, `--radius-lg: 12px`

카드 스타일: `border: 2px solid #e5e7eb`, `border-radius: var(--radius-lg)`, `padding: 1.25rem`.

---

## 8. 빌드 & 배포

```bash
# 개발
pnpm dev:extension

# 빌드 (Chrome용 zip)
pnpm build:extension
pnpm --filter @alcolmeter/extension zip
```

생성 아티팩트: `.output/chrome-mv3/` 디렉토리 → Chrome 웹 스토어 업로드용.

---

## 9. 범위 외

- Firefox 지원 (Chrome MV3만)
- 옵션 페이지
- 컨텍스트 메뉴
- 사이드패널
- 오프라인 캐시 / Service Worker
