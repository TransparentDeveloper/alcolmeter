# packages/design-system

독립 디자인 시스템 라이브러리 (콘셉트: Measurement Notebook).
아직 web/extension에 적용하지 않는다 — 라이브러리 상태로 유지하고 추후 적용한다.

## 단일 소스

UI/시각 결정 전 반드시 `DESIGN.md`를 읽는다. 폰트·색·간격·radius·모션은 전부 거기 정의돼 있다.
토큰 구현은 `src/tokens.css`(CSS 변수) 하나다.

## 토큰 변경

`src/tokens.css`를 수정하고 `DESIGN.md`의 Decisions Log에 한 줄 남긴다.
임의로 토큰을 벗어난 색/간격을 하드코딩하지 않는다.

## JS에서 토큰

별도 JS 토큰 파일을 두지 않는다 (이중 소스 회피). 차트 등 JS에서 색이 필요하면
`getComputedStyle(el).getPropertyValue('--ds-...')`로 CSS 변수를 읽는다 — 테마까지 자동 추적된다.

## preview/

`preview/index.html`은 격리된 임시 미리보기다. 빌드 없이 브라우저로 직접 연다.
프로덕션 코드 아님 — 토큰의 룩앤필 확인용.

## 버전·브랜치

- 브랜치 `design-system-{SemVer}`. 버전 범프는 별도 커밋(`chore: design-system 버전을 X.Y.Z로 범프`).
- 배포 대상 아님(라이브러리). SemVer는 소비처(web/extension) 영향 기준 — 토큰 추가=MINOR, 이름변경/삭제 breaking=MAJOR, 내부 정리=PATCH.
- 참고: 루트 `CLAUDE.md` 브랜치 규칙 목록엔 아직 `design-system-` prefix가 없다. 추가하려면 별도 `common/` 작업으로.
