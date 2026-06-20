# @alcolmeter/domain-v2 컨벤션

## 변수명 규칙

형식: `{자원}{단위}` (camelCase)

| 접미사 | 단위 | 예 |
|---|---|---|
| `Grams` | 그램 (g) | `totalRiceGrams`, `riceGrams` |
| `Liters` | 리터 (L) | `volumeLiters` |
| `Percent` | 퍼센트 (%) | `abvPercent` |

## 타입 선언 규칙

`type` alias로 선언한 타입은 `Type` 접미사를 붙인다. `interface` 선언에는 붙이지 않는다.

| 선언 | 예 |
|---|---|
| `type` alias | `IngredientKindType` |
| `interface` | `FermentationRequest`, `FermentationResult` (접미사 없음) |

## 공용 헬퍼

순수 공용 함수는 `utils/`에 두고, 파일명은 `{대상}-helper.ts`로 한다 (예: `unit-helper.ts`). 단, 특정 개념(모델·계층)에 속하는 로직은 utils가 아니라 그 개념 옆에 둔다.

## 임포트·멤버 순서

- `import type ...`(타입 전용 import)는 값 import보다 위에 두고, **그 사이에 빈 줄 한 칸**을 둔다.
- 클래스 멤버는 private 헬퍼를 먼저 정의하고, 그것을 사용하는 public 메서드를 뒤에 둔다.
