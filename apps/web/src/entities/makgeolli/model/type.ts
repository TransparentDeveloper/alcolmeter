import type { RiceFormType } from '@alcolmeter/domain-v2';

// 담금 유형(탭). 도메인은 stageCount(숫자)로 받으므로 이 어휘는 앱 전용이다.
type BrewTabType = 'DANYANG' | 'IYANG' | 'SAMYANG';

// 쌀 형태는 도메인 어휘를 그대로 앱의 대표 타입으로 재노출한다(별도 매핑 불필요).
export type { BrewTabType, RiceFormType };
