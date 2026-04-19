import { RICE_WATER_RATIO, RICE_FORM_LABELS, type RiceForm, type BrewResult, type BrewStage } from '$lib/types';

const GODUBAP = '고두밥';

function nurukForRice(rice: number, ratioPercent: number): number {
	return rice * (ratioPercent / 100);
}

function sumStages(stages: BrewStage[]): { totalRice: number; totalWater: number; totalNuruk: number } {
	return stages.reduce(
		(acc, s) => ({
			totalRice: acc.totalRice + s.rice,
			totalWater: acc.totalWater + s.water,
			totalNuruk: acc.totalNuruk + s.nuruk
		}),
		{ totalRice: 0, totalWater: 0, totalNuruk: 0 }
	);
}

/**
 * 형태 비율을 정확히 지키면서 물 예산 안에 들어가는 최대 쌀량을 계산.
 *
 * @param availableRice 가용 쌀 총량
 * @param preFinalFractions 최종 덧술 제외 단계들의 쌀 비율 (예: [0.2] 또는 [0.15, 0.15])
 * @param formRatio 쌀 형태별 물 비율 (떡=1, 범벅=3, 죽=5)
 * @param waterBudget 물 예산 (availableRice * waterRatio)
 * @returns 실제 사용할 쌀량
 */
function optimizeRice(
	availableRice: number,
	preFinalFractions: number[],
	formRatio: number,
	waterBudget: number
): number {
	if (formRatio === 0) return availableRice; // 고두밥: 물 불필요
	const waterPerRice = preFinalFractions.reduce((sum, f) => sum + f, 0) * formRatio;
	if (waterPerRice <= 0) return availableRice;
	const maxRice = waterBudget / waterPerRice;
	return Math.min(availableRice, maxRice);
}

export function calculateDanyang(availableRice: number, riceForm: RiceForm, waterRatio: number = 1, nurukRatio: number = 10): BrewResult {
	const waterBudget = availableRice * waterRatio;
	const stages: BrewStage[] = [
		{
			name: '전량 투입',
			riceFormLabel: RICE_FORM_LABELS[riceForm],
			rice: availableRice,
			water: waterBudget,
			nuruk: nurukForRice(availableRice, nurukRatio)
		}
	];

	return {
		type: 'danyang',
		label: '단양주',
		stages,
		...sumStages(stages)
	};
}

export function calculateIyang(availableRice: number, riceForm: RiceForm, waterRatio: number = 1, nurukRatio: number = 10): BrewResult {
	const formRatio = RICE_WATER_RATIO[riceForm];
	const waterBudget = availableRice * waterRatio;
	const noFinalWater = riceForm === 'tteok' || riceForm === 'godubap';
	const actualRice = optimizeRice(availableRice, [0.2], formRatio, waterBudget);

	const milsulRice = actualRice * 0.2;
	const deotsulRice = actualRice * 0.8;
	const milsulWater = milsulRice * formRatio;
	const deotsulWater = noFinalWater ? 0 : Math.max(0, waterBudget - milsulWater);

	const stages: BrewStage[] = [
		{
			name: '밑술',
			riceFormLabel: RICE_FORM_LABELS[riceForm],
			rice: milsulRice,
			water: milsulWater,
			nuruk: nurukForRice(actualRice, nurukRatio)
		},
		{
			name: '덧술',
			riceFormLabel: GODUBAP,
			rice: deotsulRice,
			water: deotsulWater,
			nuruk: 0
		}
	];

	return {
		type: 'iyang',
		label: '이양주',
		stages,
		...sumStages(stages)
	};
}

export function calculateSamyang(availableRice: number, riceForm: RiceForm, waterRatio: number = 1, nurukRatio: number = 10): BrewResult {
	const formRatio = RICE_WATER_RATIO[riceForm];
	const waterBudget = availableRice * waterRatio;
	const noFinalWater = riceForm === 'tteok' || riceForm === 'godubap';
	const actualRice = optimizeRice(availableRice, [0.15, 0.15], formRatio, waterBudget);

	const milsulRice = actualRice * 0.15;
	const deotsul1Rice = actualRice * 0.15;
	const deotsul2Rice = actualRice * 0.7;
	const milsulWater = milsulRice * formRatio;
	const deotsul1Water = deotsul1Rice * formRatio;
	const deotsul2Water = noFinalWater ? 0 : Math.max(0, waterBudget - milsulWater - deotsul1Water);

	const stages: BrewStage[] = [
		{
			name: '밑술',
			riceFormLabel: RICE_FORM_LABELS[riceForm],
			rice: milsulRice,
			water: milsulWater,
			nuruk: nurukForRice(actualRice, nurukRatio)
		},
		{
			name: '덧술',
			riceFormLabel: RICE_FORM_LABELS[riceForm],
			rice: deotsul1Rice,
			water: deotsul1Water,
			nuruk: 0
		},
		{
			name: '덧술2',
			riceFormLabel: GODUBAP,
			rice: deotsul2Rice,
			water: deotsul2Water,
			nuruk: 0
		}
	];

	return {
		type: 'samyang',
		label: '삼양주',
		stages,
		...sumStages(stages)
	};
}
