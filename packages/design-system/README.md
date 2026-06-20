# @alcolmeter/design-system

alcolmeter의 독립 디자인 시스템 라이브러리. 콘셉트는 **Measurement Notebook**.

디자인 단일 소스는 [`DESIGN.md`](./DESIGN.md). 토큰은 CSS 변수(`src/tokens.css`) 하나로 관리한다.

## 철학

알콜미터는 **측정·추정 도구**다. 그래서 이 디자인 시스템은 한 권의 **측정 노트(Measurement Notebook)** —
차분하고 정밀하며 시원하다. 전통주의 흔한 누런·베이지를 피하고, 모던하고 또렷한 인상을 지향한다.

## 원칙

이 시스템이 지키는 것들이다.

1. **시원함은 뉴트럴에서 온다.** 쿨 그래파이트·여백·크리스프한 타입이 분위기를 만든다 — 색이 아니라.
2. **색은 희소하다.** 단 하나의 스파크가 의미를 갖도록 아껴 둔다. 강조의 기본은 ink, 스파크는 그 위의 한 끗.
3. **숫자는 계측기처럼 읽힌다.** 측정값은 등폭(mono)·tabular-nums — 노트의 readout 정체성.
4. **크리스프하다.** 작은 radius·헤어라인 괘선·도트그리드. 일괄 둥근 모서리는 이 시스템의 언어가 아니다.
5. **아이콘은 최소다.** 개성은 타이포·그리드·주석에서 나온다.
6. **모션은 절제되고 접근성을 지킨다.** 바운스 없음, 시그니처(밑줄·탄산)는 드물게. `prefers-reduced-motion`에선 숨기지 않고 정지로 둔다.
7. **한글이 일급이다.** 한글(Pretendard)이 기준, 라틴 디스플레이는 포인트.
8. **모든 값은 한 곳에서 나온다.** 색·간격·radius·모션은 `tokens.css`·`motion.css`에 단일 정의되고, 결정은 `DESIGN.md`가 기록한다.

> 정확한 값·전체 스펙은 [`DESIGN.md`](./DESIGN.md). README = "왜·원칙", DESIGN.md = "무엇".

## 구성

```
DESIGN.md          디자인 단일 소스 (읽고 시작)
src/tokens.css     CSS 커스텀 프로퍼티 (라이트/다크 + .ds-paper-grid 헬퍼)
src/motion.css     모션 키프레임/유틸 (밑줄 드로인 · 탄산 fizz, reduced-motion 존중)
preview/index.html 임시 미리보기 (격리된 정적 페이지)
```

## 사용

```ts
import '@alcolmeter/design-system/tokens.css';
import '@alcolmeter/design-system/motion.css'; // 애니메이션 쓸 때만
```

```css
.button {
	background: var(--ds-color-action);
	border-radius: var(--ds-radius-md);
	padding: var(--ds-space-sm) var(--ds-space-lg);
}
```

### JS에서 토큰이 필요하면 (차트 등)

별도 JS 토큰 파일을 두지 않는다. 살아있는 값을 CSS 변수에서 직접 읽으면 테마(라이트/다크)까지 자동으로 따라온다.

```ts
const spark = getComputedStyle(document.documentElement)
	.getPropertyValue('--ds-color-spark')
	.trim(); // 라이트 #f2512d · 다크 #ff6a47
```

## 미리보기

격리된 정적 페이지. 빌드/서버 없이 브라우저로 직접 연다.

```bash
pnpm --filter @alcolmeter/design-system preview   # = open preview/index.html
```

폰트(Cabinet Grotesk·Geist·Geist Mono)는 CDN에서 로드한다. 오프라인이면 시스템 폰트로 폴백.

## 폰트 소스

- Geist / Geist Mono — Google Fonts
- Cabinet Grotesk — Fontshare
- **Pretendard (한글)** — jsDelivr (`cdn.jsdelivr.net/gh/orioncactus/pretendard`). 라틴 폰트엔 한글 글리프가 없어 한글은 Pretendard로 렌더된다.

## 토큰 변경 규칙

`src/tokens.css`를 수정하고, `DESIGN.md`의 Decisions Log에 한 줄 남긴다.

## 버전 관리

**자체 SemVer**를 `package.json`에 둔다 (현재 버전은 `package.json` 참조).

- **브랜치:** `design-system-{SemVer}` (루트 `CLAUDE.md`의 `{하위프로젝트}-{SemVer}` 규칙).
- **버전 범프:** 별도 커밋 — `chore: design-system 버전을 X.Y.Z로 범프`.
- **배포 없음.** 라이브러리라 빌드/배포 파이프라인이 없다. SemVer는 토큰 API 호환성 기준으로 판단한다:
  - **PATCH** — 내부 정리, 룩 동일 수준의 값 미세 조정
  - **MINOR** — 토큰·헬퍼 추가 (하위호환)
  - **MAJOR** — 토큰 이름 변경/삭제 등 breaking, 룩이 달라지는 변경
