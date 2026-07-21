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
| `features` | 사용자 액션 처리, 전역 상태(`store`), 비즈니스 로직 | 관심사(Domain/Feature) | |
| `entities` | 도메인 모델·데이터 형태, API 호출·컨버팅 | 관심사(Domain) | |
| `shared` | 프로젝트 전반 공통 모듈. 관심사별 슬라이스를 둔다 | 관심사 | 예: `shared/supabase` |

> **`features` vs `entities` 판별:** 사용자 액션·비즈니스 로직(계산·제출·전환 등 "동사")은 `features`, 도메인 데이터의 형태와 변환("명사")은 `entities`다. 예: 막걸리 계산은 `features/calculate-makgeolli`(입력 → 도메인 호출 → 결과 조립)가 맡고, 그 결과의 데이터 형태·매핑은 `entities/makgeolli`(뷰모델 `MakgeolliBrew`)가 맡는다. 한 위젯에 닫힌 뷰 상태는 둘 중 어느 쪽도 아니라 그 위젯 `ui`의 class다(§3 "뷰 상태·연산").

## 3. 세그먼트 (7종 고정)

Slice 내부 폴더는 아래 7종만 쓴다. 임의 세그먼트 금지.

**슬라이스 바로 아래에는 세그먼트(7종)만 온다.** 섹션·컴포넌트를 슬라이스 밑 별도 폴더로 두지 않는다. 예를 들어 home의 여러 섹션은 `widgets/home/ui/`에 `Hero.svelte`·`DrinkSelection.svelte`처럼 나란히 둔다 (`widgets/home/hero/ui/…` 처럼 중간 폴더를 끼우지 않는다).

- `ui`: 컴포넌트·스타일
- `model`: 도메인 모델·데이터 타입 (Type, Class). 전역 상태는 `store`로 분리한다
- `store`: 전역 상태. 하나의 상태 변수와 그것을 읽는 getter·수정하는 setter만 노출한다 (아래 "전역 상태" 참고)
- `api`: 백엔드 통신·데이터 페칭
- `service`: UI 상태와 무관한 비즈니스 로직, 데이터타입·에러타입 정형화
- `controller`: UI 상태와 무관한 이벤트 로직. view가 호출한다
- `lib`: 상태 없는 순수 유틸·헬퍼·상수·정적 데이터. 프레임워크·비즈니스 로직과 무관하다

### 타입·모델 선언

- 도메인 모델은 `model` 세그먼트에 **class**로 둔다. 원시 데이터를 감싸고 접근자(getter)·팩토리(static)를 제공한다. 대표 모델이 하나면 세그먼트 `index.ts`에 바로 선언한다 (예: `entities/user/model/index.ts`의 `UserModel`).
- **외부 변환은 모델 class의 static 팩토리가 흡수한다.** 도메인 패키지 결과·DB row 등 외부 형태와의 변환은 `fromRow`·`fromSupabaseUser`·`fromOutcome` 같은 static 팩토리로 모델 안에 둔다. 이러면 변환 전용 `lib`가 따로 필요 없다 (예: `entities/makgeolli/model`의 `MakgeolliBrew.fromOutcome(outcome)`가 domain-v2 결과를 뷰모델로 매핑해 `lib` 없이 끝낸다).
- **모델·타입에는 표시 라벨을 넣지 않는다.** `model`에는 enum·수치·구조만 담고, 한글 표시 문자열(라벨)은 그걸 그리는 뷰에서 관리한다(아래 "상수·정적 데이터" 참고).
- **객체 형태의 타입은 `interface`로 선언한다.** 예: `interface UserData { … }`, `interface AuthState { … }`.
- **union(리터럴 합집합 등) 타입은 `type` alias로 선언하고, 이름에 `Type` 접미사를 붙인다.** 예: `type AuthProviderType = 'google' | 'kakao'`, `type AuthStatusType = 'loading' | 'signedIn' | 'signedOut'`. (`interface`로 선언한 객체 타입에는 접미사를 붙이지 않는다.)

### 상수·정적 데이터

- 슬라이스에 종속된 상수·정적 콘텐츠는 그 슬라이스의 **`lib/constant.ts`** 에 둔다.
- 종류가 많아지면 `lib/` 아래 목적별 파일(`constant.ts`·`schema.ts` 등)로 나누고 `lib/index.ts` 배럴로 노출한다.
- 상위 레이어는 반드시 `lib` 배럴을 경유해 import한다. 구체 파일 직접 import는 금지한다.
- 예: FAQ 콘텐츠는 `entities/faq/lib/constant.ts`에 두고, 소비처는 `import { sections } from '$entities/faq/lib'`로 읽는다.
- **표시 라벨은 예외로 뷰에서 관리한다.** 탭 라벨·단계명·힌트처럼 화면 요소에 붙는 짧은 표시 문자열은 `lib/constant.ts`가 아니라 그 라벨을 렌더하는 `.svelte`에 둔다. 여러 컴포넌트가 같은 라벨을 쓰면 부모 뷰가 정의해 자식에 prop으로 주입한다. `lib`의 정적 데이터는 그 자체가 콘텐츠인 데이터셋(FAQ 문답 등)이나 라벨이 아닌 설정값에 한한다. (`model`도 마찬가지로 라벨을 두지 않는다 — enum·수치만.)

### 뷰 상태·연산 (ui)

- 위젯의 지역 상태와 뷰 연산(검색·필터·그룹핑 등)은 해당 `ui` 세그먼트에 **`{Name}.svelte.ts` class**로 둔다. React식 `use…` 훅을 두지 않는다.
- class는 `$state`·`$derived` 룬을 필드·게터에 쓰고, 컴포넌트가 인스턴스화해 바인딩한다.
- 한 위젯에 닫힌 상태는 이 class로 충분하다. 여러 위젯이 공유해야 하는 상태만 `features`의 `store` 세그먼트로 올린다.
- **class 이름은 `{이름}State`** 로 짓고(`State` 접미사), 파일명은 class명과 같은 `{이름}State.svelte.ts`로 둔다. 컴포넌트는 `import { {이름}State } from './{이름}State.svelte'`로 인스턴스화한다(`.svelte.ts`는 import 경로에 `.svelte`까지만 쓴다). class명과 컴포넌트명이 꼭 같을 필요는 없다.
- 예: `widgets/wiki/ui/WikiList.svelte` ↔ `WikiIndexState`, `widgets/community/ui/PostEditor.svelte` ↔ `PostEditorState`, `widgets/calculate-makgeolli/ui/MakgeolliCalculator.svelte` ↔ `MakgeolliCalculatorState`.

### 전역 상태 (store)

- 여러 위젯·페이지가 공유하는 전역 상태는 `store` 세그먼트에 둔다. 한 위젯에 닫힌 지역 상태는 위 `ui`의 `{Name}.svelte.ts` class로 충분하다.
- **store는 상태만 담는다.** 비즈니스 로직·부수효과·외부 호출을 두지 않는다. 액션(로그인·페칭 등)은 `api`·`service`·`controller`에 두고, 그것들을 상태와 엮는 조합은 view(컴포넌트)에서 한다.
- 형태: 룬을 쓰므로 `.svelte.ts`. **하나의 private 상태 변수 + 그 값을 읽는 getter + 통째로 교체하는 setter**만 노출하는 class로 쓰고, 전역 공유를 위해 **단일 인스턴스**를 export한다.
  ```ts
  // features/auth/store/index.svelte.ts
  type AuthStatusType = 'loading' | 'signedIn' | 'signedOut';

  interface AuthState {
  	user: UserModel | null;
  	status: AuthStatusType;
  	error: string | null;
  }

  class AuthStore {
  	private state = $state<AuthState>({ user: null, status: 'loading', error: null });

  	get value(): AuthState {
  		return this.state;
  	}

  	set(next: AuthState): void {
  		this.state = next;
  	}
  }

  const authStore = new AuthStore();

  export { authStore };
  export type { AuthState, AuthStatusType };
  ```
- 소비: `import { authStore } from '$features/auth/store/index.svelte'`로 가져와 `authStore.value.status`로 읽고 `authStore.set({ ...authStore.value, error })`로 갱신한다. 룬 파일(`index.svelte.ts`)이라 import 경로에 `/index.svelte`를 명시한다. TS가 `.svelte.ts`를 디렉토리 진입점으로 자동 resolve하지 못하기 때문이며, `store`는 이 이유로 대표 선언을 `index.svelte.ts`에 두는 유일한 세그먼트다.

## 4. public API·import·export 규칙

- **모든 세그먼트는 `index.ts`(룬이 필요하면 `index.svelte.ts`)를 public API로 갖는다.**
- **세그먼트에 대표 선언이 하나뿐이면 별도 구현 파일을 두지 말고 그 `index.ts`에 바로 선언한다.** 예: `entities/user/model/index.ts`에 `UserModel`을 직접 선언한다 (`UserModel.ts` + 배럴로 나누지 않는다). 대표 이름이 슬라이스명과 맞으면(`user`→`UserModel`) 특히 그렇다. 선언이 여러 개로 늘면 그때 목적별 파일로 쪼개고 `index.ts`를 재-export 배럴로 전환한다.
- **바꿔 말하면, `index.ts`에 직접 선언할 수 있는 건 그 선언이 슬라이스/세그먼트를 "대표"할 때뿐이다.** 대표하지 못하는 선언(도메인의 일부일 뿐인 결과 뷰모델 등)은 목적별 파일에 두고 `index.ts`는 **순수 재-export 배럴**로만 쓴다. 예: `entities/makgeolli/model`은 `MakgeolliBrew.ts`(결과 뷰모델 class)·`type.ts`(union 어휘)로 나누고 `index.ts`는 배럴이다. `MakgeolliBrew`는 계산 결과일 뿐 makgeolli 도메인 전체를 대표하지 못하기 때문이다. (타입만 있는 `faq`·`theme`의 `model`도 `type.ts` + 배럴 꼴이다.)
- 상위 레이어가 하위 레이어 모듈을 쓸 때는 **반드시 세그먼트 index에서 import**한다. 구체 파일 직접 import 금지.
  ```ts
  // pages/home/ui/HomePage.svelte
  import { Hero, DrinkSelection } from '$widgets/home/ui';   // OK
  // import Hero from '$widgets/home/ui/Hero.svelte';  // 금지
  ```
- **`export`는 파일 하단에 모아 쓴다.** 선언부에 `export`를 붙이지 않고(`export class`·`export function`·`export const` 금지), 파일 끝에서 `export { … }` / `export type { … }`로 한 번에 내보낸다. 컴포넌트를 모으는 재-export 배럴(`export { default as … } from …`)은 선언이 아니므로 이 규칙에서 예외다.
  ```ts
  // shared/supabase/api/index.ts
  class Supabase { /* … */ }

  export { Supabase };
  ```
- **import 방향은 단방향**이다: `apps → pages → widgets → features → entities → shared`. `shared`는 어디서나 쓸 수 있다. 역방향·동일 레이어 슬라이스 간 import는 금지한다.
- 레이어 alias는 `svelte.config.js`의 `kit.alias`로 등록한다: `$apps` `$pages` `$widgets` `$features` `$entities` `$shared`. `$lib`은 기존 레거시 공용 코드를 가리키며 마이그레이션 완료 전까지 병존한다.

> 참고: 정식 FSD는 슬라이스 루트에 public API(`index.ts`)를 두고 세그먼트를 내부에 감춘다. 이 프로젝트는 세그먼트 index를 직접 노출하는 커스텀 규칙을 쓴다.

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
- [ ] 세그먼트가 7종(`ui`/`model`/`store`/`api`/`service`/`controller`/`lib`) 안에 있는가
- [ ] 슬라이스 바로 아래에 세그먼트만 있는가 (중간 폴더 없음)
- [ ] 전역 상태가 `store`에서 상태 변수 하나 + getter/setter만 노출하는가 (로직 없음)
- [ ] 상수·정적 데이터가 `lib/constant.ts`에 있는가
- [ ] 세그먼트마다 `index.ts`(또는 `index.svelte.ts`) public API가 있는가
- [ ] 대표 선언이 하나뿐인 세그먼트는 `index.ts`에 바로 선언했는가 (불필요한 배럴 분리 없음)
- [ ] 슬라이스를 대표 못 하는 선언은 목적별 파일 + 순수 배럴로 나눴는가
- [ ] 표시 라벨이 뷰(`.svelte`)에 있는가 (`model`·`lib`에 한글 라벨 없음)
- [ ] 외부 변환이 모델 class의 static 팩토리에 들어갔는가 (변환 전용 `lib` 없음)
- [ ] 뷰 상태 class 이름이 `{이름}State`이고 파일명과 같은가
- [ ] `export`가 파일 하단에 모여 있는가 (선언부 inline export 없음)
- [ ] 크로스 레이어 import가 세그먼트 index를 경유하는가
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
shared/ui/MetaHead/MetaHead.svelte + index.ts  ($lib/components/Seo.svelte 복사, home만 사용)
```

## 부록: 막걸리 계산기 마이그레이션 (레퍼런스)

상태·연산·도메인 데이터가 모두 있는 페이지. **상태는 위젯, 계산 액션은 `features`, 데이터 형태·매핑은 `entities`** 로 갈린다. 라벨은 뷰에, 변환은 모델 class에 흡수돼 `lib` 세그먼트는 두지 않았다.

```
routes/calculate-makgeolli/+page.svelte            → <CalculateMakgeolliApplication /> 렌더만
apps/calculate-makgeolli/ui/…Application.svelte    MetaHead 주입 + 페이지 렌더
pages/calculate-makgeolli/ui/…Page.svelte          위젯 조립
widgets/calculate-makgeolli/ui/
  MakgeolliCalculator.svelte                       레이아웃 + 표시 라벨(탭·단계명·힌트·쌀형태)
  MakgeolliCalculatorState.svelte.ts               뷰 상태 class ($state 입력·activeTab, $derived 결과)
  IngredientInput.svelte · ResultTable.svelte      입력 폼 · 결과 표 (라벨은 prop 주입)
  index.ts                                         (ui 배럴, 컴포넌트만 export)
features/calculate-makgeolli/service/index.ts      MakgeolliCalcService.calculate(input) → MakgeolliBrew (계산 액션)
entities/makgeolli/model/
  MakgeolliBrew.ts                                 결과 뷰모델 class (static fromOutcome로 domain-v2 결과 매핑)
  type.ts                                          union 어휘(BrewTabType 등)
  index.ts                                         (재-export 배럴)
```

- **라벨은 뷰**(`MakgeolliCalculator.svelte`가 정의해 자식에 prop 주입), **상태는 위젯 class**, **계산은 `features/service`**, **데이터 형태·매핑은 `entities` 모델 class**. `model`엔 enum·수치만.
- 옛 경로 이전은 라우트 디렉터리 없이 `hooks.server.ts`에서 `redirect(301, …)`로 처리한다(구 `/dictionary`→`/wiki` 선례와 동일).
- import 방향: `widgets`(상태 class) → `features`(service) → `entities`(model) → domain-v2(외부 패키지).
