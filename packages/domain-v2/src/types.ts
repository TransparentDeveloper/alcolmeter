/**
 * 외부로 노출하는 경계 DTO 타입. interface(Controller)와 application(Service)이 공유한다.
 * 내부 도메인 타입은 여기 두지 않는다(각 model/calculator에).
 */

/** 입력에 쓰이는 재료 종류. 필요 시 확장(배·포도 등). */
export type IngredientKindType = 'RICE' | 'WATER' | 'NURUK' | 'SUGAR';

/** 양의 단위. 질량(g·kg)·부피(ml·L). */
export type UnitType = 'g' | 'kg' | 'ml' | 'L';

/** 쌀 가공 형태. */
export type RiceFormType = 'GODUBAP' | 'TTEOK' | 'BEOMBUK' | 'JUK';

/** 재료 한 종류의 양. 단계별 투입량 표시에 쓰인다. */
export interface IngredientAmount {
	kind: IngredientKindType;
	amount: number;
	unit: UnitType;
}

/** 입력: 막걸리 빚기 요청. 물·누룩은 쌀 대비 비율(급수율·누룩비율)로 받는다. */
export interface MakgeolliRequest {
	totalRice: IngredientAmount;
	riceForm: RiceFormType;
	waterRatio: number;
	nurukRatio: number;
	stageCount: number;
}

/** 한 담금 단계의 투입 구성 + 그 단계의 쌀 형태. */
export interface MakgeolliStage {
	ingredients: IngredientAmount[];
	riceForm: RiceFormType;
}

/** 출력: 예상 도수 · 생산량 · 최적 급수율(추천) · 담금별 투입 분배. */
export interface MakgeolliResult {
	abvPercent: number;
	volumeLiters: number;
	optimalWaterRatio: number;
	stages: MakgeolliStage[];
}

/** 사과 품종. */
export type AppleVarietyType = 'FUJI' | 'HONGOK' | 'HONGRO' | 'AORI';

/** 입력: 사이다(하드 사이다) 빚기 요청. 가당(addedSugar)은 선택. */
export interface CiderRequest {
	apple: { amount: number; unit: UnitType; variety: AppleVarietyType };
	addedSugar?: IngredientAmount;
}

/** 출력: 예상 도수 · 생산량 · 잔당(단맛). */
export interface CiderResult {
	abvPercent: number;
	volumeLiters: number;
	residualSugarLiters: number;
}
