/** 쌀 가공 형태 */
export type RiceForm = 'tteok' | 'beombuk' | 'juk';

/** 쌀 형태 한글 라벨 */
export const RICE_FORM_LABELS: Record<RiceForm, string> = {
	tteok: '떡 (설기)',
	beombuk: '범벅',
	juk: '죽'
};

/** 쌀 형태별 쌀:물 비율 (쌀 1 기준 물의 비율) */
export const RICE_WATER_RATIO: Record<RiceForm, number> = {
	tteok: 1,
	beombuk: 3,
	juk: 5
};

/** 양조 단계 */
export interface BrewStage {
	name: string;
	rice: number;
	water: number;
	nuruk: number;
}

/** 양조 유형별 결과 */
export interface BrewResult {
	type: 'danyang' | 'iyang' | 'samyang';
	label: string;
	stages: BrewStage[];
	totalRice: number;
	totalWater: number;
	totalNuruk: number;
}

/** 누룩 종류 */
export interface NurukType {
	id: string;
	name: string;
	saccharificationPower: number; // SP
	/** 밑술 쌀 대비 누룩 투입 비율 (0.1 = 10%) */
	riceRatio: number;
}
