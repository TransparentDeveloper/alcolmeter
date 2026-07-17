# CLAUDE.md

## 하위 프로젝트 구성

- `apps/web` — SvelteKit 웹 앱
- `apps/extension` — Chrome 확장프로그램 (WXT + Svelte)
- `packages/domain` — 순수 도메인 로직 (TypeScript)
- `packages/design-system` — 디자인 시스템 라이브러리 (CSS 토큰·모션)

## 환경

- 패키지 매니저: pnpm. 작업 시작 전 `pnpm install` 1회.

## 커맨드

```bash
# 개발
pnpm dev              # web 개발 서버
pnpm dev:extension    # 확장프로그램 개발 서버

# 빌드
pnpm build            # web 프로덕션 빌드
pnpm build:extension  # 확장프로그램 빌드

# 검증
pnpm test:domain      # domain 유닛 테스트
pnpm check            # web 타입 체크
```

## 작업 순서

1. 사용자와 충분히 대화하며 의도를 좁힌다
   - 모호한 부분은 반드시 **`AskUserQuestion` 툴**을 사용해 명시적으로 확인한다
   - 대화가 충분한지의 **판단은 사용자가 한다**. 에이전트가 임의로 다음 단계로 넘어가서는 안 된다
   - 작업 범위가 확정되면 SemVer 변경 유형(MAJOR/MINOR/PATCH)을 판단해 타겟 버전을 사용자와 합의한다
2. **파일을 수정하기 전에 브랜치를 먼저 만든다** (형식은 브랜치 규칙 참고)
3. 합의된 내용을 논리적 작업 단위로 분리해 구현한다 (원자성 = 단일 의도)
4. 사용자 피드백이 완료될 때까지 각 커밋을 `git commit --amend`로 다듬는다
5. 모든 커밋이 승인되면 로컬에서 `main`으로 머지 (PR 없음)
6. 배포는 `main` 머지 후 `main` push로 한다. 작업 브랜치도 필요하면 원격에 push해 리뷰·프리뷰로 관찰할 수 있다
7. **web·extension 작업이면 `main` push 후 릴리즈 태그를 단다** (배포의 마지막 단계). 버전 범프 커밋에 `{앱}-v{SemVer}` 태그를 달아 push하면 GitHub Release가 자동 생성된다. PATCH도 빠짐없이. 라이브러리·`common` 작업은 태그하지 않는다. 상세는 릴리즈/CHANGELOG 참고

## 브랜치 규칙

- 형식 (하위프로젝트별 고정):
  - `web-{SemVer}` — 예: `web-0.2.5`
  - `extension-{SemVer}` — 예: `extension-0.2.1`
  - `domain-{SemVer}` — 예: `domain-0.1.1`
  - `design-system-{SemVer}` — 예: `design-system-0.3.0`
  - `common/{작업명}` — 전역 설정 (CLAUDE.md, 루트 config 등), 버저닝 없음 — 예: `common/branch-convention`
- 한 브랜치 = 한 논리적 작업 단위
- `main`에 직접 작업하지 않는다 (force-push/삭제/머지 커밋 금지)

## 배포

- **web**: main push 시 Vercel 자동 배포
- **extension**: main push 시 `apps/extension/**` 변경 감지 → Chrome Web Store 자동 빌드·배포 (`.github/workflows/deploy-extension.yml`)

## 릴리즈 / CHANGELOG

- **CHANGELOG는 배포되는 앱에만 둔다** — 사용자가 실제로 받는 것 (Keep a Changelog, 최신 위):
  - web → `apps/web/CHANGELOG.md`
  - extension → `apps/extension/CHANGELOG.md`
- **라이브러리(domain·domain-v2·design-system)는 자체 CHANGELOG를 두지 않는다.** 사용자에게 직접 배포되지 않기 때문. 라이브러리 변경의 사용자 영향은 그걸 소비하는 앱의 CHANGELOG에 **버전을 인용**해 서술한다 (예: web `0.4.2`의 "… (design-system 0.3.1)"). 라이브러리 자체 결정 기록은 design-system=`DESIGN.md` Decisions Log, domain=커밋 히스토리·버전으로 충분.
- **web·extension 릴리즈는 반드시 태그를 단다 (배포의 마지막 단계, PATCH 포함 빠짐없이).** `main` 머지·push 후 버전 범프 커밋에 `{앱}-v{SemVer}` 태그(예: `web-v0.4.0`)를 달아 push하면, 태그 prefix가 앱을 식별해 GitHub Release가 자동 생성된다(아래 항목). 누락한 과거 버전은 해당 범프 커밋에 소급 태깅한다. 라이브러리(domain·design-system)는 `package.json` 버전 범프만 하고 태그·Release는 만들지 않는다.
- **GitHub Release**: 태그(`{하위프로젝트}-v{SemVer}`) push 시 `.github/workflows/release.yml`가 태그 prefix로 하위프로젝트를 식별해 그 `CHANGELOG.md`의 해당 버전 섹션을 본문으로 Release를 **자동 생성**한다. (단, 이 워크플로보다 앞선 커밋에 다는 태그는 그 커밋에 워크플로 파일이 없어 자동화되지 않으므로 `gh release create {태그} --notes-file …`로 수동 처리.)
- **CHANGELOG 톤**: 양조장 밤일지 — 존댓말 + 실제 릴리즈 시점(날짜·계절·절기)에 근거한 이탤릭 인용문 + 명확한 변경 불릿. 작성 보조 스킬: `/alcol-release-notes`.
- **pre-push 게이트**: **배포 앱(web·extension)** 에 사용자 영향(비-`chore`) 변경을 `main`에 push하려면 그 앱의 `CHANGELOG.md` 갱신이 필수. `chore` 커밋만 있거나 해당 앱을 안 건드리면 면제. 라이브러리는 게이트 대상이 아니다. 구현: `.githooks/pre-push` + `core.hooksPath=.githooks`(루트 `prepare`가 설정). 클라이언트 훅이라 `--no-verify`로 우회 가능(서버 차단은 아님).

## 스킬

- 알콜미터 전용 스킬은 레포 `.claude/skills/`에 두고, 이름에 **`alcol-` prefix**를 붙인다 (예: `alcol-release-notes`).
- 레포에 커밋되어 공유·버전관리된다 (개인 워크플로우 스킬과 구분).

## 플랜 문서

- `docs/superpowers/` 하위의 스펙·플랜 문서는 커밋하지 않는다 (`.gitignore` 처리)
- 로컬에서만 참고용으로 사용한다

## 커밋 규칙

- 한글 + conventional prefix, 한 줄 요약 (본문 없음)
  - 예: `chore: 패키지 매니저를 npm에서 pnpm으로 전환`
  - 예: `feat: FAQ 페이지에 JSON-LD 추가`
- 작업 단위 내부의 구현 단계는 여러 커밋으로 구분
- 버전 범프는 별도 커밋 — 형식: `chore: {하위프로젝트} 버전을 X.Y.Z로 범프` (예: `chore: domain 버전을 0.1.1로 범프`)
  - CHANGELOG 갱신이 필요한 작업이면 **CHANGELOG 커밋을 버전 범프 커밋보다 먼저** 둔다 (범프 커밋이 항상 마지막)
- SemVer 준수
  - PATCH: 사용자 영향 없는 내부 변경, 리팩토링, 오류 수정
  - MINOR: 기능 추가, UI 변경
  - MAJOR: 정식 버전 제공, 도메인 변경, 기존 link 대체
