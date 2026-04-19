# 알콜미터 (Alcolmeter)

전통주 양조를 위한 정밀 배합 계산기.

가용 쌀의 양과 형태를 입력하면 단양주, 이양주, 삼양주별 최적의 쌀/물/누룩 배합 비율을 자동으로 계산합니다.

## 주요 기능

- **단양주 / 이양주 / 삼양주** 단계별 배합표 자동 계산
- **쌀 형태별 물 비율** 반영 (고두밥, 떡, 범벅, 죽)
- **물/누룩 비율** 사용자 입력 가능 (표준값 제공)
- 형태 비율과 총 비율 충돌 시 자동 최적화
- 예상 술 생산량 표시

## 기술 스택

- SvelteKit 2 + Svelte 5
- TypeScript
- Vitest
- adapter-static (Vercel 배포)

## 로컬 실행

```bash
npm install
npm run dev
```

## 테스트

```bash
npm run test
```

## 배포

Vercel에 자동 배포됩니다.

- Production: https://alcolmeter.vercel.app
