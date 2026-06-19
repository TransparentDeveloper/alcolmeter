# @alcolmeter/design-system

alcolmeter의 독립 디자인 시스템 라이브러리. 콘셉트는 **Measurement Notebook**.
아직 web/extension에 적용하지 않는다 (라이브러리 상태로 유지, 추후 적용).

디자인 단일 소스는 [`DESIGN.md`](./DESIGN.md). 토큰은 CSS 변수(`src/tokens.css`) 하나로 관리한다.

## 구성

```
DESIGN.md          디자인 단일 소스 (읽고 시작)
src/tokens.css     CSS 커스텀 프로퍼티 (라이트/다크 + .ds-paper-grid 헬퍼)
preview/index.html 임시 미리보기 (격리된 정적 페이지)
```

## 사용 (추후 적용 시)

```ts
import '@alcolmeter/design-system/tokens.css';
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

다른 서브프로젝트(web `0.3.3` · extension `0.2.1` · domain `0.4.1`)처럼 **자체 SemVer**를 `package.json`에 둔다. 현재 `0.1.0`.

- **브랜치:** `design-system-{SemVer}` (루트 `CLAUDE.md`의 `{하위프로젝트}-{SemVer}` 규칙).
- **버전 범프:** 별도 커밋 — `chore: design-system 버전을 X.Y.Z로 범프`.
- **배포 없음.** web/extension·domain과 달리 이건 라이브러리라 빌드/배포 파이프라인이 없다. web/extension이 `import`해 적용할 때 비로소 사용자에게 영향을 준다. 그래서 SemVer는 *소비처(적용 앱) 영향* 기준으로 판단한다:
  - **PATCH** — 내부 정리, 룩 동일 수준의 값 미세 조정
  - **MINOR** — 토큰·헬퍼 추가 (하위호환)
  - **MAJOR** — 토큰 이름 변경/삭제 등 breaking, 적용 앱의 룩이 달라지는 변경
