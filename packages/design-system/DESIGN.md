# Design System — alcolmeter

> **Concept: Measurement Notebook** — 차분하고 정밀한 브루어의 측정 노트. 빨간펜 한 끗.
>
> 이 문서가 단일 소스(single source of truth)다. UI/시각 결정 전 반드시 읽는다.
> 토큰 구현: `src/tokens.css`(CSS 변수) 하나. JS에서 색이 필요하면 `getComputedStyle`로 읽는다.

## Philosophy

알콜미터는 **측정·추정 도구**다. 그래서 이 디자인 시스템은 한 권의 **측정 노트(Measurement Notebook)** — 차분하고 정밀하며 시원하다. 방향은 Industrial/Utilitarian(계측·데이터 중심) × 에디토리얼 주석. 도트그리드·모눈 종이·여백 주석·종이 카드를 구조 메타포로 삼되, 렌더는 깔끔하고 모던하다. 전통주의 흔한 누런·베이지 클리셰를 의도적으로 피하고, 또렷한 인상을 지향한다.

## Principles

이 시스템이 지키는 것들이다.

1. **시원함은 뉴트럴에서 온다.** 쿨 그래파이트·여백·크리스프한 타입이 분위기를 만든다 — 색이 아니라.
2. **색은 희소하다.** 단 하나의 스파크가 의미를 갖도록 아껴 둔다. 강조의 기본은 ink, 스파크는 그 위의 한 끗.
3. **숫자는 계측기처럼 읽힌다.** 측정값은 등폭(mono)·tabular-nums — 노트의 readout 정체성.
4. **크리스프하다.** 작은 radius·헤어라인 괘선·도트그리드. 일괄 둥근 모서리는 이 시스템의 언어가 아니다.
5. **아이콘은 최소다.** 개성은 타이포·그리드·주석에서 나온다.
6. **모션은 절제되고 접근성을 지킨다.** 바운스 없음, 시그니처(밑줄·탄산)는 드물게. `prefers-reduced-motion`에선 숨기지 않고 정지로 둔다.
7. **한글이 일급이다.** 한글(Pretendard)이 기준, 라틴 디스플레이는 포인트.
8. **모든 값은 한 곳에서 나온다.** 색·간격·radius·모션은 `tokens.css`·`motion.css`에 단일 정의되고, 결정은 이 문서가 기록한다.

## Product Context

- **무엇:** alcolmeter — 집에서 빚은 막걸리·발효주의 재료로 예상 도수(ABV)를 추정.
- **누구:** 홈브루잉 사용자.
- **타입:** 독립 디자인 시스템 라이브러리.
- **상태:** 토큰 + 임시 프리뷰. 컴포넌트는 다음 단계.

## Typography

- **Display/Hero:** Cabinet Grotesk — 모던 그로테스크, 약간의 각. (라틴 전용)
- **Body/UI:** Geist — 깔끔·테크니컬, tabular-nums 지원. (라틴 전용)
- **Data/Numbers/Code:** Geist Mono — 계측기 readout. Geist와 한 슈퍼패밀리.
- **한글:** Pretendard — Cabinet/Geist는 한글 글리프가 없어 한글은 Pretendard로 렌더(스택 폴백). Apple SD Gothic Neo 룩을 크로스플랫폼으로 재현.
- **로딩:** Geist·Geist Mono = Google Fonts / Cabinet Grotesk = Fontshare / Pretendard = jsDelivr (README 참고).
- **스케일(일반 대비 1.2× · base 19.2px):** xs 14.4 · sm 16.8 · base 19.2 · md 21.6 · lg 24 · xl 28.8 · 2xl 38.4 · 3xl 48 (px).
- **행간:** tight 1.2 · snug 1.4 · normal 1.6.

### 두 레이어

타이포는 **primitive**와 **semantic** 두 층이다.

- **primitive(`--ds-text-*`)** = 스케일의 칸. **상수다.** 뷰포트·테마에 따라 값을 재정의하지 않는다. `3xl`이 늘 48px이어야 계산된 크기를 역추적할 수 있기 때문이다.
- **semantic(`--ds-type-*`)** = 그 글자가 **무엇인지**. 소비처는 이쪽만 참조하고, primitive 직접 참조는 시스템 내부에 둔다.

| 역할                | 데스크탑 | 모바일(<768) | 쓰임                             |
| ------------------- | -------- | ------------ | -------------------------------- |
| `--ds-type-display` | 48       | 48           | 문서 제목(위키 용어·커뮤니티 글) |
| `--ds-type-title`   | 38.4     | 28.8         | 페이지 제목                      |
| `--ds-type-h2`      | 38.4     | 28.8         | 본문 섹션 제목                   |
| `--ds-type-h3`      | 28.8     | 24           | 본문 하위 제목                   |
| `--ds-type-h4`      | 24       | 21.6         | 본문 최하위 제목                 |
| `--ds-type-body`    | 19.2     | 19.2         | 흐르는 본문                      |
| `--ds-type-caption` | 14.4     | 14.4         | 메타·힌트·캡션                   |

`display`는 상한이라 고정하고, `body`는 읽기 크기가 목적이라 줄이지 않는다. 그 사이 네 역할만 모바일에서 한 칸씩 내려간다. 본문 위로 제목 네 단계를 다 구별하려면 칸이 하나 모자라서 `md`(21.6)를 스케일에 추가했다.

**한글에서 제목은 크기로만 구별된다.** `--ds-font-display`(Cabinet Grotesk)가 라틴 전용이라 한글은 본문과 같은 Pretendard로 폴백되기 때문이다. 계단 간격을 좁힐 때 이 점을 감안한다.

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

- **접근:** grid-disciplined. 모바일 우선이며 기본 1열, 브레이크포인트 이상에서 다열로 전환한다.
- **컨테이너:** 680px(본문) · 960px(와이드) · 1280px(허브·커뮤니티 홈).
- **브레이크포인트:** md 768px · lg 1024px. CSS 변수는 `@media` 조건절에 못 쓰므로(런타임에 var 미해석) 이 값들은 **문서 상수**다. 각 컴포넌트가 리터럴로 직접 쓰되 반드시 이 표에 통일하고, 임의 브레이크포인트는 쓰지 않는다.
- **Radius:** xs 2 · sm 4 · md 6 · lg 8 · full 9999(필/아바타 한정). 크리스프 — 일괄 둥근 radius 금지.

## Motion

- **접근:** minimal-functional. 바운스 없음.
- **이징:** out `cubic-bezier(.16,1,.3,1)` · in `(.4,0,1,1)` · in-out `(.4,0,.2,1)`.
- **지속:** micro 80 · short 160 · medium 240 · long 400 (ms).
- **유틸(`motion.css`, 별도 import):** 키프레임 + 헬퍼를 라이브러리에서 관리. `prefers-reduced-motion` 존중.
  - `.ds-underline-draw` — SVG `<path pathLength="1">`에 적용. 손그림 밑줄이 그려졌다 → 멈췄다 → 지워졌다 반복(빨간펜 주석 시그니처의 모션화).
  - `.ds-fizz` / `.ds-fizz__bubble` — 탄산 거품이 올라오며 터짐. 색 `--ds-fizz-color`(기본 spark). 양조/발효 테마.
  - `.ds-page-cover` — 라우트 전환 커버. 오른쪽에서 밀려들어와 덮고 → 중립 구간에 머물고 → 왼쪽으로 빠져나감(슬라이드 넘기는 결). 판은 스파크(`--ds-color-accent`), 그 위 마크는 흰색(`--ds-color-on-accent`) 상속. 단계는 소비처가 `data-phase="covering|revealing"`로, 길이는 `--ds-page-cover-in/out-duration`으로 넘긴다(전환 진행을 JS가 재면 그쪽이 타이밍 소스).
- **시그니처:** 위 두 모션은 *희소하게* — 히어로/브랜드 모먼트에만.

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
| 2026-06-19 | 폰트 스택에 한글 Pretendard 추가 (v0.2.0)     | Cabinet/Geist는 라틴 전용 → 한글 제품(web)에선 폰트 정체성이 한글에 안 먹음. Pretendard로 Apple SD Gothic Neo 룩을 크로스플랫폼 재현. |
| 2026-06-20 | 모션 레이어 `motion.css` 추가 (v0.3.0)        | 애니메이션을 라이브러리에서 관리. 밑줄 드로인 + 탄산 fizz 키프레임/유틸. 모션 토큰 재사용, reduced-motion 존중. 별도 export로 토큰만 쓰는 소비처엔 비용 0. |
| 2026-06-20 | reduce-motion에서 fizz 정지 노출 (v0.3.1)     | 기존 폴백 `opacity:0`(완전 숨김)이 동작 줄이기 사용자에게 탄산을 통째로 가렸음. 모션은 끄되 정적 표시(흩뿌린 거품)로 변경 — 접근성 유지 + 가시성 확보. |
| 2026-06-20 | 철학·원칙을 DESIGN.md로 일원화 (v0.3.2)        | README에 흩어졌던 철학·원칙을 SSOT인 이 문서로 이관(`Aesthetic Direction` 흡수). README는 포인터만 남김. 라이브러리 문서는 라이브러리 자체 내용만 담는다는 원칙(사용처·소비처 지시 배제). |
| 2026-08-01 | 타이포 semantic 레이어 `--ds-type-*` + 모바일 재정의 (v0.5.0) | 소비처가 primitive 칸(`--ds-text-lg`)을 직접 골라 쓰다 보니 같은 칸을 페이지 제목과 화살표 글리프가 공유했고, 모바일 대응을 하려면 무관한 소비처까지 딸려왔다. 역할 토큰을 얹어 뷰포트 의존을 역할 단위로 격리. primitive는 상수 유지. |
| 2026-08-01 | 스케일에 `md` 21.6 추가 (v0.5.0)               | 본문 19.2 위로 제목 네 단계(24·28.8·38.4·48)를 쓰면 스케일 상단 다섯 칸을 전부 소진해 모바일 압축 시 갈 자리가 없었다. base와 lg 사이를 메워 계단 하나를 확보. |
| 2026-08-20 | 전환 커버 `.ds-page-cover` 신설 (v0.6.0) | 라우트 전환에 중립 구간을 둬 페이지 교체를 가린다. 판을 스파크로 칠하고 마크를 흰색으로 얹어 전환 자체를 브랜드 모먼트로 쓴다. 스파크 희소성 원칙의 예외인데, 전면 노출이지만 지속이 짧고 화면에 남지 않기 때문이다. 길이는 소비처(JS)가 CSS 변수로 넘겨 타이밍 소스를 하나로 둔다. |
| 2026-07-20 | 허브 컨테이너 1280px + 브레이크포인트 표준 (v0.4.0) | web 커뮤니티 허브 전환이 넓은 데스크탑 폭과 반응형 그리드를 요구. 기존 680/960에 1280(허브)을 추가하고, md 768·lg 1024 브레이크포인트를 문서 상수로 정립(CSS var는 `@media`에 못 써 리터럴로 통일). web 최초 본격 반응형의 기준선. |
