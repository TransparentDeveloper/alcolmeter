# packages/domain-v2 CLAUDE.md

`@alcolmeter/domain`을 대체할 v2 도메인 라이브러리. 술 빚기·도수 추정 전반(전통주에 한정하지 않음). 발효주 먼저, 증류주·담금주는 추후.

## 커맨드

```bash
pnpm test          # 유닛 테스트 1회 실행
pnpm test:watch    # 감시 모드
pnpm check         # 타입 체크
```

## 컨벤션

코드 작성 전 반드시 `packages/domain-v2/CONVENTIONS.md`를 확인하고 따른다.

## 계층

의존 방향 `interface → application → calculator → model`.

- **공개 표면은 `LiquorController`(interface)와 `types.ts`의 DTO뿐.** 서비스·도메인 모델은 외부에 노출하지 않는다(루트 `index.ts`에서 export 금지).
- 개념·타입을 추가할지는 외부 API가 아니라 **"연산에 필요한가"** 로만 판단한다.
- 도메인 모델(`model/`)은 **개념별**로 묶는다(`ingredient/`, `wash/` …). DDD 패턴(vo/entity/aggregate)별로 나누지 않는다.
- 모델 객체는 **자기 고유 행동만** 갖는다(재료의 당·부피, `Wash`의 상태 전이). 모델끼리 의존하지 않는다.
- **여러 모델을 엮는 연산은 `calculator/`** 에 둔다(예: 발효 시뮬). 각 계산기는 추상 `Calculator<In, Out>`를 상속해 `calculate(input)`를 구현한다(술 종류별: 발효·증류·담금). `application`은 use case 번역·조율만 하고 연산은 calculator에 위임한다.

---

## 테스트 코드

### 위치

테스트 파일은 소스 파일 옆에 둔다 (co-location).

```
model/wash/
  index.ts
  wash.test.ts          ← 소스 옆
```

### 내용

테스트 이름은 **도메인 요구사항과 행동**을 기술한다. 구현 방법이 바뀌어도 결과가 같다면 테스트는 통과해야 한다.

**금지:**
- 메서드 이름을 그대로 쓰는 it (`feed()로 투입한`, `ferment는 당을 변환`)
- 구현 상수·비율을 명시하는 it (`농도 한계 6%`, `내성 18%`)
- describe를 메서드명으로 짓는 것 (`describe('Wash.ferment')`)

**권장:**
```ts
// 나쁨
it('feed()로 투입한 당이 sugar에 더해진다', ...)
// 좋음
it('당 농도가 한계를 넘으면 초과분은 단맛으로 굳는다', ...)
```

## README.md 모델 다이어그램

`README.md`의 mermaid classDiagram은 도메인 모델의 공식 문서다.

**클래스·필드·관계(화살표)·메서드 시그니처가 변경될 때는 커밋 전에 반드시 README.md 다이어그램을 함께 업데이트한다.**
