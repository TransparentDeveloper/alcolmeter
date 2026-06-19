# Design System — alcolmeter

> **Concept: Measurement Notebook** — 차분하고 정밀한 브루어의 측정 노트. 빨간펜 한 끗.
>
> 이 문서가 단일 소스(single source of truth)다. UI/시각 결정 전 반드시 읽는다.
> 토큰 구현: `src/tokens.css`(CSS 변수) 하나. JS에서 색이 필요하면 `getComputedStyle`로 읽는다.

## Product Context

- **무엇:** alcolmeter — 집에서 빚은 막걸리·발효주의 재료로 예상 도수(ABV)를 추정.
- **누구:** 홈브루잉 사용자.
- **타입:** 독립 디자인 시스템 라이브러리. 아직 web/extension에 적용하지 않음(라이브러리 상태로 유지, 추후 적용).
- **상태:** 토큰 + 임시 프리뷰. 컴포넌트는 다음 단계.

## Aesthetic Direction

- **방향:** Industrial/Utilitarian(계측·데이터 중심) × 에디토리얼 주석. 모던한 측정 노트.
- **구조 메타포:** 도트그리드/모눈 종이, 여백 주석, 종이 카드 — 단 렌더는 깔끔·모던.
- **무드:** 쿨·차분·정밀, "시원함". 전통주 클리셰(누런/베이지) 의도적 회피.
- **장식:** intentional — 도트그리드, 헤어라인 괘선, 절제된 빨간펜 주석. **아이콘 최소.**

## Typography

- **Display/Hero:** Cabinet Grotesk — 모던 그로테스크, 약간의 각.
- **Body/UI:** Geist — 깔끔·테크니컬, tabular-nums 지원.
- **Data/Numbers/Code:** Geist Mono — 계측기 readout. Geist와 한 슈퍼패밀리.
- **로딩:** Geist·Geist Mono = Google Fonts / Cabinet Grotesk = Fontshare (README 참고).
- **스케일(일반 대비 1.2× · base 19.2px):** xs 14.4 · sm 16.8 · base 19.2 · lg 24 · xl 28.8 · 2xl 38.4 · 3xl 48 (px).
- **행간:** tight 1.2 · snug 1.4 · normal 1.6.

## Color

- **접근:** near-achromatic. 쿨 뉴트럴 + 여백 + 크리스프 타입이 "시원함"을 책임지고, **색은 희소하게.**
- **전경 스케일(ink):** `ink-1` 본문·제목·버튼(최강조) → `ink-2` 보조 → `ink-3` 힌트·캡션·메타 → `ink-4` 비활성·placeholder(가장 옅음).
- **보더 스케일(border):** `border-1` 구분선·테이블 행(가장 옅음) → `border-2` 카드·인풋 등 컴포넌트 → `border-3` 강조·액티브 엣지.
- **스파크(희소 — 라이브 수치·주석·히어로 CTA 한정):** `#f2512d` (hover `#d8431f`, tint `#feede8`).
- **역할:** 기본/프라이머리 액션 = `ink-1`, **스파크 아님.** 스파크는 히어로·라이브 readout에만. 포커스 링 = `info`(쿨, 자주 등장하므로 스파크와 분리). on-action = `surface`(라이트/다크 양쪽에서 ink와 대비).
- **상호작용 상태:** 역할별 `*-hover`/`*-active` — action(ink), accent(spark) 각각. 고스트·행·메뉴 등 중립 요소는 오버레이 `--ds-color-hover`/`--ds-color-active`(ink-1을 6%/12% 섞은 투명 틴트, 테마 자동 적응). 비활성 = `disabled-fg`(ink-4)/`disabled-border`(border-1). 전부 `color-mix`라 뉴트럴·라이트/다크 따라감(accent만 방향이 달라 테마별 토큰).
- **시맨틱:** success `#16a34a` · warning `#d97706` · error `#b91c1c`(스파크보다 깊은 레드, 구분) · info `#0891b2`.
- **뉴트럴 언더톤 — Cool Graphite (확정):** slate 기본 탈피. Deep × Blueprint 채널 평균(옅은 쿨 언더톤). bg `#f2f4f7` · surface `#ffffff` · ink-1 `#141825` · ink-2 `#3b4354` · ink-3 `#5c6478` · ink-4 `#a7adbb` · border-1 `#e6e9ee` · border-2 `#d4d9e2` · border-3 `#b8bfce` · grid `#e8ecf1`. (다크 전체는 tokens.css)

## Spacing

- **base 4px**, density comfortable.
- **스케일:** 2xs 2 · xs 4 · sm 8 · md 12 · lg 16 · xl 24 · 2xl 32 · 3xl 48 · 4xl 64.
- **노트 그리드 셀:** 8px (`.ds-paper-grid` 헬퍼로 도트그리드 배경).

## Layout

- **접근:** grid-disciplined.
- **컨테이너:** 680px(본문) · 960px(와이드).
- **Radius:** xs 2 · sm 4 · md 6 · lg 8 · full 9999(필/아바타 한정). 크리스프 — 일괄 둥근 radius 금지.

## Motion

- **접근:** minimal-functional. 바운스 없음.
- **이징:** out `cubic-bezier(.16,1,.3,1)` · in `(.4,0,1,1)` · in-out `(.4,0,.2,1)`.
- **지속:** micro 80 · short 160 · medium 240 · long 400 (ms).
- **시그니처:** 빨간펜 주석이 가끔 "그려지는"(~300ms) 효과, 아주 절제.

## Decisions Log

| Date       | Decision                                       | Rationale                                                                                             |
| ---------- | ---------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| 2026-06-19 | 시스템 신설 — "Measurement Notebook"           | 브레인스토밍 합의: 노트/스케치북 구조 + 모던·시원, 전통주 누런/베이지 회피.                            |
| 2026-06-19 | near-achromatic + 단일 워밍 스파크 `#f2512d`   | 쿨 뉴트럴이 "시원함" 담당. 제너릭 블루 프라이머리 기각(현 앱이 이미 블루 → 브랜드 상승 없음). 스파크 = 빨간펜 주석 정체성, 희소 유지. |
| 2026-06-19 | 타이포 Cabinet Grotesk / Geist / Geist Mono    | 모던 그로테스크 + 테크니컬 본문 + 모노 숫자 = 계측 readout 시그니처.                                   |
| 2026-06-19 | 크리스프 small radius + 모노 숫자              | 정밀한 측정 계측기 느낌 강화.                                                                          |
| 2026-06-19 | JS 토큰(`tokens.ts`) 제거                      | 현재 JS 소비처 없음(YAGNI). 차트 등에서 색이 필요하면 `getComputedStyle`로 CSS 변수를 읽어 테마까지 자동 추적. 이중 소스 동기화 부담 제거. |
| 2026-06-19 | 전경 `ink-1..4` + 보더 `border-1..3` 스케일화 | 이름이 제각각(`ink`/`text-2`/`muted`/`hairline`)이라 스케일로 안 보였음. 4단계 전경 + 3단계 보더로 통일. `--ds-text-*`(폰트 크기)와 안 겹치게 색은 `ink-*`. |
| 2026-06-19 | 뉴트럴 언더톤 재검토 (slate 탈피)              | 기존 `#0f172a`/`#64748b`가 Tailwind slate 기본값이라 템플릿 룩. near-achromatic은 뉴트럴이 화면 대부분을 칠하므로 개성의 핵심. 3안(Blueprint/Petrol/Deep) 비교. |
| 2026-06-19 | 뉴트럴 확정 — Cool Graphite                    | Deep × Blueprint 채널 평균. 진짜 뉴트럴과 청사진 블루 사이의 옅은 쿨 언더톤. slate 템플릿 룩 회피하면서 과하지 않게. |
| 2026-06-19 | 타입 스케일 1.2× 확대 (base 19.2px)           | 일반 16px base 대비 1.2배. 약간 큼직한 읽기. (1.5×는 과해서 1.2×로 조정)                                |
| 2026-06-19 | 상호작용 상태 토큰화 (hover/active/disabled)  | 역할별 `*-hover`/`*-active` + 중립 오버레이(`--ds-color-hover/active`) + disabled. `color-mix`로 테마 자동 적응. |
| 2026-06-19 | ink-3 다크닝 `#6e7689 → #5c6478` (라이트)     | 틴트 bg 위 4.13:1(AA 미달) → 5.37:1로 통과. 작은 캡션·메타 가독 확보. 다크 ink-3는 이미 5.5:1라 유지. |
