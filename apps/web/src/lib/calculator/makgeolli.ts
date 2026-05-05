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
 * 물 예산 = 가용쌀 × waterRatio (고정)
 *
 * 1. 밑술/덧술 단계의 쌀은 물 예산에 맞춰 결정 (형태 비율 정확히 유지)
 * 2. 최종 덧술(고두밥)에 남은 가용쌀 전부 투입 (물 없이)
 * 3. 결과: 가용쌀 전량 사용, 형태 비율 유지, 총 쌀:물 비율 유지
 */
function calcPreFinalRicePerStage(
	availableRice: number,
	defaultFraction: number,
	formRatio: number,
	waterBudget: number,
	preFinalCount: number
): number {
	if (formRatio === 0) return availableRice * defaultFraction;
	const defaultRice = availableRice * defaultFraction;
	const defaultTotalWater = defaultRice * preFinalCount * formRatio;
	if (defaultTotalWater <= waterBudget) return defaultRice;
	// 축소: 물 예산에 맞는 단계당 최대 쌀
	return waterBudget / (preFinalCount * formRatio);
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

	const milsulRice = calcPreFinalRicePerStage(availableRice, 0.2, formRatio, waterBudget, 1);
	const milsulWater = milsulRice * formRatio;
	// 남은 가용쌀 전부 → 덧술(고두밥)
	const deotsulRice = availableRice - milsulRice;
	const deotsulWater = noFinalWater ? 0 : Math.max(0, waterBudget - milsulWater);

	const stages: BrewStage[] = [
		{
			name: '밑술',
			riceFormLabel: RICE_FORM_LABELS[riceForm],
			rice: milsulRice,
			water: milsulWater,
			nuruk: nurukForRice(availableRice, nurukRatio)
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

	const milsulRice = calcPreFinalRicePerStage(availableRice, 0.15, formRatio, waterBudget, 2);
	const deotsul1Rice = milsulRice; // 밑술과 동일
	const milsulWater = milsulRice * formRatio;
	const deotsul1Water = deotsul1Rice * formRatio;
	// 남은 가용쌀 전부 → 덧술2(고두밥)
	const deotsul2Rice = availableRice - milsulRice - deotsul1Rice;
	const deotsul2Water = noFinalWater ? 0 : Math.max(0, waterBudget - milsulWater - deotsul1Water);

	const stages: BrewStage[] = [
		{
			name: '밑술',
			riceFormLabel: RICE_FORM_LABELS[riceForm],
			rice: milsulRice,
			water: milsulWater,
			nuruk: nurukForRice(availableRice, nurukRatio)
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
