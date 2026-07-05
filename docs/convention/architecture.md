# 프론트엔드 아키텍처 컨벤션 (FSD)

`apps/web`은 Feature-Sliced Design(FSD)을 따른다. **새 페이지를 만들거나 기존 페이지 구조를 개선할 때 이 문서를 먼저 읽고 그대로 따른다.** AI 에이전트도 동일하게 적용한다.

## 1. 원칙

- 기존 구조를 한 번에 대체하지 않는다. **페이지 하나씩** 마이그레이션한다.
- 마이그레이션한 페이지만 이 컨벤션을 따른다. 나머지는 레거시 구조(`apps/web/CLAUDE.md`의 "페이지 구조 규칙"·"SEO 규칙")를 그대로 둔다.
- 스택은 **Svelte 5 + SvelteKit**을 유지한다. React·JSX·`.tsx`를 도입하지 않는다. 컴포넌트는 `.svelte`다.

## 2. 레이어

| 레이어 | 역할 | Slicing 기준 | 이 앱에서의 매핑 |
|---|---|---|---|
| `apps` | 진입점·전역 설정, head 주입, 전역 Context | page | 폴더명은 `apps`. `$app`이 SvelteKit 예약어라 단수 `app`은 못 쓴다 |
| `pages` | 선언적 페이지 UI. 비즈니스 로직·지역 상태 금지 | page | |
| `widgets` | 페이지를 구성하는 독립 섹션 UI. 위젯 간 데이터 교환은 `features` 전역 상태로만 | page | 섹션은 `widgets/{page}/ui` 안 컴포넌트 |
| `features` | 사용자 액션 처리, 전역 상태 Store, 비즈니스 로직 | 관심사(Domain/Feature) | |
| `entities` | 도메인 모델·데이터 형태, API 호출·컨버팅 | 관심사(Domain) | |
| `shared` | 프로젝트 전반 공통 모듈 (Slice 구조 없음) | 없음 | |

## 3. 세그먼트 (5종 고정)

Slice 내부 폴더는 아래 5종만 쓴다. 임의 세그먼트 금지.

**슬라이스 바로 아래에는 세그먼트(5종)만 온다.** 섹션·컴포넌트를 슬라이스 밑 별도 폴더로 두지 않는다. 예를 들어 home의 여러 섹션은 `widgets/home/ui/`에 `Hero.svelte`·`DrinkSelection.svelte`처럼 나란히 둔다 (`widgets/home/hero/ui/…` 처럼 중간 폴더를 끼우지 않는다).

- `ui`: 컴포넌트·스타일
- `model`: 상태 관리, 데이터 타입 (Store, Type, Class)
- `api`: 백엔드 통신·데이터 페칭
- `service`: 비즈니스 로직, 데이터타입·에러타입 정형화
- `controller`: 이벤트를 적절한 `service` 로직으로 라우팅

## 4. 배럴·import 규칙

- **모든 세그먼트에 `index.ts` 배럴을 둔다.**
- 상위 레이어가 하위 레이어 모듈을 쓸 때는 **반드시 세그먼트 배럴에서 import**한다. 구체 파일 직접 import 금지.
  ```ts
  // widgets/home/ui/index.ts
  export { default as Hero } from './Hero.svelte';
  export { default as DrinkSelection } from './DrinkSelection.svelte';

  // pages/home/ui/HomePage.svelte
  import { Hero, DrinkSelection } from '$widgets/home/ui';   // OK
  // import Hero from '$widgets/home/ui/Hero.svelte';  // 금지
  ```
- **import 방향은 단방향**이다: `apps → pages → widgets → features → entities → shared`. `shared`는 어디서나 쓸 수 있다. 역방향·동일 레이어 슬라이스 간 import는 금지한다.
- 레이어 alias는 `svelte.config.js`의 `kit.alias`로 등록한다: `$apps` `$pages` `$widgets` `$features` `$entities` `$shared`. `$lib`은 기존 레거시 공용 코드를 가리키며 마이그레이션 완료 전까지 병존한다.

> 참고: 정식 FSD는 슬라이스 루트에 public API(`index.ts`)를 두고 세그먼트를 내부에 감춘다. 이 프로젝트는 세그먼트 배럴을 직접 노출하는 커스텀 규칙을 쓴다.

## 5. SvelteKit 정합

- `routes/**/+page.svelte`는 얇은 진입점이다. 해당 페이지의 `apps/{page}` 컴포넌트를 **렌더만** 한다. 마크업·로직을 두지 않는다.
- head·SEO는 `apps` 레이어에서 주입한다.
- 데이터 로딩(`+page.ts`의 `load`)이 필요하면 `entities`/`api` 세그먼트 함수를 호출해 route에서 얇게 연결한다.

## 6. 마이그레이션 절차 (페이지 1개 기준)

1. 대상 페이지의 현재 `routes` 구현을 분석한다. UI 섹션, 지역 상태, 데이터, 액션을 식별한다.
2. SemVer 유형을 판단하고 `web-{ver}` 브랜치를 만든다.
3. UI 섹션 → `widgets`, 페이지 조립 → `pages`, head·진입 → `apps`에 배치한다.
4. 상태·액션이 있으면 `features`, 도메인 데이터가 있으면 `entities`/`api`로 옮긴다.
5. 각 세그먼트에 배럴을 작성하고 필요한 alias를 확인한다.
6. `routes/**/+page.svelte`를 `apps` 컴포넌트 위임으로 축소한다.
7. `pnpm check`로 타입·import를 검증하고 렌더 결과가 동일한지 확인한다.
8. 원자 단위(단일 의도)로 커밋을 분리한다.

## 7. 체크리스트

- [ ] 컴포넌트가 `.svelte`인가 (`.tsx` 없음)
- [ ] 세그먼트가 5종(`ui`/`model`/`api`/`service`/`controller`) 안에 있는가
- [ ] 슬라이스 바로 아래에 세그먼트만 있는가 (중간 폴더 없음)
- [ ] 세그먼트마다 `index.ts` 배럴이 있는가
- [ ] 크로스 레이어 import가 배럴을 경유하는가
- [ ] import가 단방향인가
- [ ] `routes`는 위임만 하는가
- [ ] 마이그레이션 안 한 기존 페이지에 영향이 없는가

## 부록: home 마이그레이션 (레퍼런스)

정적 랜딩이라 상태·데이터·액션이 없다. `apps` + `pages` + `widgets` + `shared`만 쓴다.

```
routes/+page.svelte                        → <HomeApplication /> 렌더만
apps/home/ui/HomeApplication.svelte        SEO/head 주입 + <HomePage /> 렌더
apps/home/ui/index.ts
pages/home/ui/HomePage.svelte              widgets 조립
pages/home/ui/index.ts
widgets/home/ui/Hero.svelte
widgets/home/ui/DrinkSelection.svelte
widgets/home/ui/Learn.svelte
widgets/home/ui/index.ts                   (ui 세그먼트 배럴, 셋 다 export)
shared/ui/SEO/Seo.svelte + index.ts        ($lib/components/Seo.svelte 복사, home만 사용)
```
