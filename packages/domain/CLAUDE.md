# packages/domain CLAUDE.md

## 컨벤션

코드 작성 전 반드시 `packages/domain/CONVENTIONS.md`를 확인하고 따른다.

---

## 테스트 코드

### 위치

테스트 파일은 소스 파일 옆에 둔다 (co-location).

```
src/makgeolli/value-objects/mass/
  index.ts
  mass.test.ts          ← 소스 옆
```

VO는 자체 디렉토리(`{name}/index.ts`)로 관리하며, 테스트도 같은 디렉토리에 둔다.

### 내용

테스트 이름은 **도메인 요구사항과 행동**을 기술한다. 구현 방법이 바뀌어도 결과가 같다면 테스트는 통과해야 한다.

**금지:**
- 메서드 이름을 그대로 쓰는 it (`of()로 생성한`, `plus는 두 Mass의 합`)
- 구현 상수·비율을 명시하는 it (`쌀 20%`, `기본값(200)`)
- describe를 메서드명으로 짓는 것 (`describe('Mass.ofGrams')`)

**권장:**
```ts
// 나쁨
it('of()로 생성한 stage는 각 필드를 그대로 보유한다', ...)
it('쌀 20%, 물=쌀량, 누룩 전량', ...)

// 좋음
it('쌀 형태, 쌀량, 물량, 누룩량을 기록한다', ...)
it('누룩은 첫 번째 단계에만 투입된다', ...)
```

## README.md 모델 다이어그램

`README.md`의 mermaid classDiagram은 도메인 모델의 공식 문서다.

**aggregate, value object, 관계가 변경될 때는 커밋 전에 반드시 README.md 다이어그램을 함께 업데이트한다.**

체크 항목:
- 필드 추가·제거·이름 변경
- 클래스 추가·제거
- 관계(화살표) 변경
- 메서드 시그니처 변경
