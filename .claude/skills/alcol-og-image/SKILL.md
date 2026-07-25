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

**파일명은 라우트를 따른다.** `/calculate-cider` → `calculate-cider.png`, `/wiki/guidelines` → `wiki-guidelines.png`. 라우트가 바뀌면 파일명도 함께 바꾸고 옛 파일은 지운다. 정적 파일은 CDN이 먼저 처리해 `hooks.server.ts` 리다이렉트가 닿지 않으니, 옛 경로를 리다이렉트로 살릴 수는 없다(이미 공유된 카드는 캐시 만료까지 이미지가 빠진 채 뜬다).

## 디자인 — "측정 노트" 톤 (design-system 토큰)

- **배경**: dot-grid 모눈 종이를 **전면**에 깐다 (흰 카드 없음). `radial-gradient(--grid 1.5px) 32px`
- **색**: `--bg #f2f4f7`, `--ink1 #141825`(제목), `--ink3 #5c6478`(부제·라벨), `--spark #f2512d`는 **붉은 점 하나에만** (브랜드 `알콜미터.`의 점)
- **타이포**: 제목·부제는 Pretendard(한글), 라벨·URL·눈금은 Geist Mono
- **구성**: 상단 `알콜미터.` + 섹션 라벨 / 중앙 큰 제목 + 부제 / 하단 `alcolmeter.kr` + 측정 눈금
- **손그림 밑줄은 쓰지 않는다** (사용자 선호: 절제)
- 템플릿 파일: 이 스킬 폴더의 `og-template.html`. `?label=`·`?title=`·`?subtitle=` 쿼리로 문구를 주입한다. 제목의 줄바꿈은 개행 문자로 넘긴다(`.title`이 `white-space: pre-line`).

### 섹션 라벨

우상단 라벨은 서비스가 아니라 **섹션**을 가리킨다. 알콜미터는 계산기 단독이 아니므로 `BREWING CALCULATOR` 같은 전역 라벨을 쓰지 않는다.

`COMMUNITY` · `ALCOLWIKI` · `CALCULATOR` · `HELP` · `SETTINGS` · `LEGAL`

## 페이지 목록 (이미지에 들어가는 문구)

이미지 속 제목/부제는 시각용이며, 페이지 `<title>`·`description`(SEO 메타)과는 별개다.

| 파일 | 라벨 | 제목 | 부제 |
|---|---|---|---|
| `home.png` | COMMUNITY | 술을 빚는 사람과\n즐기는 사람 모두 | 양조 기록과 후기, 알콜위키와 계산기까지 |
| `community.png` | COMMUNITY | 커뮤니티 | 양조 기록과 후기, 질문을 나누는 자리 |
| `wiki.png` | ALCOLWIKI | 알콜위키 | 술과 양조의 낱말을 함께 써 나가는 참여형 위키 |
| `wiki-guidelines.png` | ALCOLWIKI | 이용 안내 | 문서 라이선스와 편집 규칙, 신고와 면책 안내 |
| `calculate-makgeolli.png` | CALCULATOR | 막걸리 계산기 | 쌀 총량과 형태를 넣으면 단·이·삼양주 배합을 계산합니다 |
| `calculate-cider.png` | CALCULATOR | 사이다 계산기 | 사과 양과 품종을 넣으면 예상 도수와 생산량을 계산합니다 |
| `faq.png` | HELP | 자주 묻는 질문 | 계산기와 알콜위키, 커뮤니티에 대한 질문과 답변 |
| `settings.png` | SETTINGS | 설정 | 화면 테마 등 알콜미터 환경설정 |
| `privacy.png` | LEGAL | 개인정보처리방침 | 무엇을 받아 적고 어디에 맡기고 언제까지 두는지 |

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

- **Chrome이 스크린샷을 쓰고도 종료하지 않는다.** `--screenshot`은 파일을 만든 뒤 프로세스가 매달릴 때가 있다. 파일 크기가 안정되면 직접 `terminate()` 해야 한다. 그냥 기다리면 90초 타임아웃까지 끌려간다.
- **프로필을 페이지마다 새로 판다.** 같은 `--user-data-dir`을 재사용하면 뒤 실행이 앞 브라우저 인스턴스에 붙어 스크린샷을 찍지 않고 매달린다.
- **`file://` 차단** → 반드시 로컬 HTTP 서버를 거친다.
- **폰트 fallback** → `--virtual-time-budget`을 넉넉히(10초) 주고, 뽑은 PNG를 눈으로 확인한다. 안 그러면 Pretendard/Geist Mono가 시스템 폰트로 대체된 걸 놓친다.
- **사용자 Chrome을 죽이지 않는다.** 정리할 때는 `pkill -f "{임시 프로필 경로}"`처럼 내 프로필 경로로만 좁혀서 죽인다.
- **`base64`/`cat`/`cp`가 "command not found"** 날 수 있다(샌드박스 PATH). 파일 복사·인코딩은 `python3`(shutil/base64 모듈)로 처리한다.
