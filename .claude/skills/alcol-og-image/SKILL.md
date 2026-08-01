---
name: alcol-og-image
description: >-
  alcolmeter web의 OG(공유 미리보기) 이미지를 디자인시스템 "측정 노트" 톤 템플릿에서 자동 생성·갱신하는 스킬.
  새 페이지의 공유 이미지를 만들거나, 기존 이미지를 다시 뽑거나, 디자인시스템이 바뀌어 전체를 재생성할 때 사용하세요.
  "og 이미지", "공유 이미지", "공유 카드", "썸네일 만들어", "미리보기 이미지", "소셜 이미지" 같은 맥락이면
  사용자가 'OG'라고 명시하지 않아도 이 스킬을 사용하세요. 1200×630 PNG를 `apps/web/static/og/{라우트}.png`에
  저장하고 각 페이지의 `<MetaHead image="/og/{라우트}.png" />`에 연결합니다.
---

# alcolmeter OG 이미지 생성

web 페이지별 OG(공유 미리보기) 이미지를 **손으로 디자인하지 않고**, 디자인시스템 토큰을 박아 둔 템플릿(`og-template.html`)에서 헤드리스 브라우저로 자동 렌더한다. 페이지가 늘면 표에 한 줄만 더하고, 디자인시스템이 바뀌면 템플릿 CSS만 고쳐 전부 다시 뽑는다.

## 결과물

- 1200×630 PNG → `apps/web/static/og/{라우트}.png`
- 각 페이지 `apps/{page}/ui/{Page}Application.svelte`의 `<MetaHead image="/og/{라우트}.png" />` (컴포넌트: `apps/web/src/shared/ui/MetaHead/MetaHead.svelte`)

**파일명은 라우트를 따른다.** `/calculate-cider` → `calculate-cider.png`, `/wiki/{slug}` 같은 하위 경로는 `-`로 이어 붙인다. 라우트가 바뀌면 파일명도 함께 바꾸고 옛 파일은 지운다. 정적 파일은 CDN이 먼저 처리해 `hooks.server.ts` 리다이렉트가 닿지 않으니, 옛 경로를 리다이렉트로 살릴 수는 없다(이미 공유된 카드는 캐시 만료까지 이미지가 빠진 채 뜬다).

## 디자인 — "측정 노트" 톤 (design-system 토큰)

- **배경**: dot-grid 모눈 종이를 **전면**에 깐다 (흰 카드 없음). 색은 토큰 `--ds-color-grid #e8ecf1`을 쓰고, 카드가 작게 보이는 매체라 눈금만 실제 화면(8px·1px)보다 키워 깐다(`1.5px`·`32px`).
- **색**: `--bg #f2f4f7`, `--ink1 #141825`(제목), `--ink2 #3b4354`(부제), `--ink3 #5c6478`(라벨), `--spark #f2512d`
- **구성**: 상단 `알콜미터.` + 섹션 라벨 / 중앙 큰 제목 + 부제 / 하단 `alcolmeter.kr` + 측정 눈금
- **손그림 밑줄은 쓰지 않는다** (사용자 선호: 절제)
- 템플릿 파일: 이 스킬 폴더의 `og-template.html`. `?label=`·`?title=`·`?subtitle=`·`?layout=` 쿼리로 문구와 레이아웃을 주입한다. 제목의 줄바꿈은 개행 문자로 넘긴다(`.title`이 `white-space: pre-line`).

### 타이포는 design-system 토큰을 그대로 미러링한다

공유 카드의 로고·제목이 실제 화면과 달라 보이면 대개 여기가 어긋난 것이다. `packages/design-system/src/tokens.css`와 `+layout.svelte`의 `.logo-text`를 기준으로 맞춘다.

| 요소 | 폰트 | 굵기 | 자간 | 색 |
|---|---|---|---|---|
| 로고 `알콜미터.` · 큰 제목 | `--ds-font-display` (Cabinet Grotesk → Geist → Pretendard) | 700 | -0.01em | ink-1 |
| 섹션 라벨 | `--ds-font-mono` (Geist Mono) | 500 | 0.08em | ink-3 |
| 부제 | `--ds-font-sans` (Geist → Pretendard) | 400 | 기본 | ink-2 |

한글은 Latin 서체에 글리프가 없어 Pretendard로 떨어지고, **마침표 같은 Latin 글리프는 Cabinet Grotesk가 그린다.** 그래서 Cabinet Grotesk를 로딩하지 않으면 로고의 점만 Pretendard의 둥근 점으로 바뀐다.

### 강조와 홈 전용 레이아웃

- **`*강조*`**: 제목·부제에서 `*…*`로 감싼 구간만 `--spark`(주황)로 세운다. **홈에서만 쓴다**(절제).
- **`?layout=brand`**: 홈 전용. 가운데에 상표 `알콜미터.`를 크게 세우고 그 아래 한 줄 소개를 놓는다. 홈은 섹션이 아니라 서비스 전체를 대표하므로 `?label=none`으로 섹션 라벨을 감춘다.

### 섹션 라벨

우상단 라벨은 서비스가 아니라 **섹션**을 가리킨다. 알콜미터는 계산기 단독이 아니므로 `BREWING CALCULATOR` 같은 전역 라벨을 쓰지 않는다.

`COMMUNITY` · `ALCOLWIKI` · `CALCULATOR` · `HELP` · `SETTINGS` · `LEGAL`

## 페이지 목록 (이미지에 들어가는 문구)

이미지 속 제목/부제는 시각용이며, 페이지 `<title>`·`description`(SEO 메타)과는 별개다.

| 파일 | 라벨 | 제목 | 부제 |
|---|---|---|---|
| `home.png` | (없음, `label=none`) | `layout=brand`의 상표 `알콜미터.` | `*술* 즐기는 사람들의 커뮤니티` |
| `community.png` | COMMUNITY | 커뮤니티 | 양조 기록과 후기, 질문을 나누는 자리 |
| `wiki.png` | ALCOLWIKI | 알콜위키 | 술과 양조의 낱말을 함께 써 나가는 참여형 위키 |
| `calculate-makgeolli.png` | CALCULATOR | 막걸리 계산기 | 쌀 총량과 형태를 넣으면 단·이·삼양주 배합을 계산합니다 |
| `calculate-cider.png` | CALCULATOR | 사이다 계산기 | 사과 양과 품종을 넣으면 예상 도수와 생산량을 계산합니다 |
| `faq.png` | HELP | 자주 묻는 질문 | 계산기와 알콜위키, 커뮤니티에 대한 질문과 답변 |
| `settings.png` | SETTINGS | 설정 | 화면 테마 등 알콜미터 환경설정 |
| `privacy.png` | LEGAL | 개인정보처리방침 | 무엇을 받아 적고 어디에 맡기고 언제까지 두는지 |
| `terms.png` | LEGAL | 이용약관 | 계정과 저작물의 권리, 금지 행위와 면책의 범위 |
| `policy.png` | LEGAL | 운영정책 | 작성 기준과 편집 규칙, 신고와 조치의 절차 |

> 알콜위키 개별 용어(`/wiki/{slug}`)와 커뮤니티 글(`/community/{id}`)은 **개별 이미지를 만들지 않는다.** 등록된 대표 이미지가 있으면 그걸 쓰고, 없으면 섹션 공통 이미지(`wiki.png`·`community.png`)로 폴백한다.

## 생성 절차 (헤드리스 Chrome)

1. **로컬 HTTP 서버로 템플릿을 띄운다** (`file://`는 브라우저가 차단함). 이 스킬 폴더를 루트로:
   ```bash
   python3 -m http.server 8765
   ```
2. **페이지마다 Chrome을 한 번씩 돌린다.** 문구는 URL 쿼리로 주입한다(한글은 URL 인코딩).
   ```bash
   "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
     --headless=new --disable-gpu --hide-scrollbars \
     --force-device-scale-factor=1 --window-size=1200,630 \
     --virtual-time-budget=10000 \
     --user-data-dir=/tmp/og-profile-{page} \
     --screenshot=/tmp/og-out/{page}.png \
     "http://127.0.0.1:8765/og-template.html?label=…&title=…&subtitle=…"
   ```
3. **`apps/web/static/og/{라우트}.png`로 복사**하고, 라우트가 바뀐 옛 파일은 지운다.
4. **페이지에 연결**: 해당 `Application.svelte`의 `<MetaHead image="/og/{라우트}.png" />`를 확인·수정한다(기본값은 `/og/home.png`).
5. **검증**: 렌더한 PNG를 **눈으로 확인한다**(폰트가 fallback으로 대체되지 않았는지). 그다음 `pnpm build`로 페이지별 `og:image`가 하나씩 박혔는지 본다.

## 실전 함정 (꼭 기억할 것)

- **Cabinet Grotesk를 반드시 로딩한다.** 빠지면 로고 `알콜미터.`의 마침표가 Pretendard의 크고 둥근 점으로 바뀌어 실제 화면과 달라진다. 폰트 link는 `apps/web/src/app.html`과 같은 조합(Geist·Geist Mono·Cabinet Grotesk·Pretendard)을 유지한다.
- **굵기를 800으로 올리지 않는다.** 실제 화면의 제목·로고는 `--ds-weight-bold`(700)다. 카드가 작게 보인다고 굵기를 키우면 로고가 다른 서체처럼 보인다.
- **Chrome이 스크린샷을 쓰고도 종료하지 않는다.** `--screenshot`은 파일을 만든 뒤 프로세스가 매달릴 때가 있다. 파일 크기가 안정되면 직접 `terminate()` 해야 한다. 그냥 기다리면 90초 타임아웃까지 끌려간다.
- **프로필을 페이지마다 새로 판다.** 같은 `--user-data-dir`을 재사용하면 뒤 실행이 앞 브라우저 인스턴스에 붙어 스크린샷을 찍지 않고 매달린다.
- **`file://` 차단** → 반드시 로컬 HTTP 서버를 거친다.
- **폰트 fallback** → `--virtual-time-budget`을 넉넉히(10초) 주고, 뽑은 PNG를 눈으로 확인한다. 안 그러면 Pretendard/Geist Mono가 시스템 폰트로 대체된 걸 놓친다.
- **사용자 Chrome을 죽이지 않는다.** 정리할 때는 `pkill -f "{임시 프로필 경로}"`처럼 내 프로필 경로로만 좁혀서 죽인다.
- **`base64`/`cat`/`cp`가 "command not found"** 날 수 있다(샌드박스 PATH). 파일 복사·인코딩은 `python3`(shutil/base64 모듈)로 처리한다.
