# 알콜미터 (Alcolmeter)

술을 빚는 사람과 즐기는 사람 모두의 커뮤니티.

양조 기록과 후기를 나누고, 알콜위키로 술과 양조의 용어를 함께 써 나가고, 계산기로 배합과 도수를 잡습니다.

## 주요 기능

- **커뮤니티** — 양조 기록과 후기, 질문을 나눕니다
- **알콜위키** — 술과 양조의 용어를 누구나 편집하는 참여형 위키 (편집 이력·되돌리기 지원)
- **막걸리 계산기** — 쌀 총량과 형태를 넣으면 단양주·이양주·삼양주별 쌀/물/누룩 배합을 계산합니다
- **사이다 계산기** — 사과 양과 품종을 넣으면 하드 사이다의 예상 도수와 생산량을 계산합니다
- **크롬 확장프로그램** — 막걸리 배합 계산을 브라우저 팝업에서 바로

## 구성

| 경로 | 설명 |
|---|---|
| `apps/web` | SvelteKit 웹 앱 |
| `apps/extension` | 크롬 확장프로그램 (WXT + Svelte) |
| `packages/domain` | 순수 도메인 로직 (TypeScript) |
| `packages/design-system` | 디자인 시스템 (CSS 토큰·모션) |

## 기술 스택

- SvelteKit 2 + Svelte 5 (Feature-Sliced Design)
- TypeScript · Vitest
- Supabase (인증·커뮤니티·알콜위키 데이터)
- adapter-vercel

## 로컬 실행

```bash
pnpm install
pnpm dev              # web 개발 서버
pnpm dev:extension    # 확장프로그램 개발 서버
```

## 검증

```bash
pnpm test:domain      # domain 유닛 테스트
pnpm check            # web 타입 체크
```

## 배포

- **web**: `main` push 시 Vercel 자동 배포 → https://alcolmeter.kr
- **extension**: `main` push 시 `apps/extension/**` 변경을 감지해 Chrome Web Store로 자동 배포
