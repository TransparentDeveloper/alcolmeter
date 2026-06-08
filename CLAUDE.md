# CLAUDE.md

## 하위 프로젝트 구성

- `apps/web` — SvelteKit 웹 앱
- `apps/extension` — Chrome 확장프로그램 (WXT + Svelte)
- `packages/domain` — 순수 도메인 로직 (TypeScript)

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

## 브랜치 규칙

- 형식 (하위프로젝트별 고정):
  - `web-{SemVer}` — 예: `web-0.2.5`
  - `extension-{SemVer}` — 예: `extension-0.2.1`
  - `domain-{SemVer}` — 예: `domain-0.1.1`
  - `common/{작업명}` — 전역 설정 (CLAUDE.md, 루트 config 등), 버저닝 없음 — 예: `common/branch-convention`
- 한 브랜치 = 한 논리적 작업 단위
- `main`에 직접 작업하지 않는다 (force-push/삭제/머지 커밋 금지)

## 플랜 문서

- `docs/superpowers/` 하위의 스펙·플랜 문서는 커밋하지 않는다 (`.gitignore` 처리)
- 로컬에서만 참고용으로 사용한다

## 커밋 규칙

- 한글 + conventional prefix, 한 줄 요약 (본문 없음)
  - 예: `chore: 패키지 매니저를 npm에서 pnpm으로 전환`
  - 예: `feat: FAQ 페이지에 JSON-LD 추가`
- 작업 단위 내부의 구현 단계는 여러 커밋으로 구분
- 버전 범프는 별도 커밋 — 형식: `chore: {하위프로젝트} 버전을 X.Y.Z로 범프` (예: `chore: domain 버전을 0.1.1로 범프`)
- SemVer 준수
  - PATCH: 사용자 영향 없는 내부 변경, 리팩토링, 오류 수정
  - MINOR: 기능 추가, UI 변경
  - MAJOR: 정식 버전 제공, 도메인 변경, 기존 link 대체
