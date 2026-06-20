/**
 * 외부로 노출하는 경계 DTO 타입. interface(Controller)와 application(Service)이 공유한다.
 * 내부 도메인 타입은 여기 두지 않는다(각 model 폴더에).
 */

/** 입력에 쓰이는 재료 종류. 필요 시 확장(배·포도 등). */
export type IngredientKindType = 'RICE' | 'WATER' | 'NURUK';

/** 양의 단위. 질량(g·kg)·부피(ml·L). 필요 시 확장(개 등). */
export type UnitType = 'g' | 'kg' | 'ml' | 'L';

/** 재료 한 종류의 양. 입력 총량과 단계별 투입량 모두에 쓰인다. */
export interface IngredientAmount {
	kind: IngredientKindType;
	amount: number;
	unit: UnitType;
}

/** 입력: 각 재료의 총량 + 총 발효횟수. */
export interface FermentationRequest {
	ingredients: IngredientAmount[];
	stageCount: number;
}

/** 한 담금 단계의 투입 구성. */
export interface StageComposition {
	ingredients: IngredientAmount[];
}

/** 출력: 예상 도수 · 생산량 · 담금별 투입 분배. */
export interface FermentationResult {
	abvPercent: number;
	volumeLiters: number;
	stages: StageComposition[];
}
