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
 * 밑술/덧술 단계의 쌀 배분량을 계산.
 * 형태 비율을 지키면서 물 예산 안에 들도록 조정하고,
 * 남는 쌀은 최종 덧술(고두밥)에 전량 투입.
 *
 * @param totalRice 가용 쌀 전량 (전부 사용)
 * @param preFinalCount 최종 덧술 이전 단계 수 (이양주=1, 삼양주=2)
 * @param defaultFractions 기본 비율 (이양주: [0.2], 삼양주: [0.15, 0.15])
 * @param formRatio 쌀 형태별 물 비율
 * @param waterBudget 물 예산
 * @returns [각 단계별 쌀량 배열, 각 단계별 물량 배열]
 */
function distribute(
	totalRice: number,
	defaultFractions: number[],
	formRatio: number,
	waterBudget: number,
	noFinalWater: boolean
): { rices: number[]; waters: number[] } {
	const preFinalCount = defaultFractions.length;

	// 기본 비율로 밑술/덧술 쌀량 계산
	let preFinalRices = defaultFractions.map(f => totalRice * f);
	let preFinalWaters = preFinalRices.map(r => r * formRatio);
	let preFinalWaterSum = preFinalWaters.reduce((a, b) => a + b, 0);

	// 물 예산 초과 시: 예산에 맞게 밑술/덧술 쌀을 균등 축소
	if (preFinalWaterSum > waterBudget && formRatio > 0) {
		// 각 단계 동일 비율이라 가정 → 단계당 최대 쌀 = waterBudget / (preFinalCount * formRatio)
		const maxPerStage = waterBudget / (preFinalCount * formRatio);
		preFinalRices = preFinalRices.map(() => maxPerStage);
		preFinalWaters = preFinalRices.map(r => r * formRatio);
		preFinalWaterSum = preFinalWaters.reduce((a, b) => a + b, 0);
	}

	// 나머지 쌀 → 최종 덧술(고두밥)
	const preFinalRiceSum = preFinalRices.reduce((a, b) => a + b, 0);
	const finalRice = totalRice - preFinalRiceSum;
	const finalWater = noFinalWater ? 0 : Math.max(0, waterBudget - preFinalWaterSum);

	return {
		rices: [...preFinalRices, finalRice],
		waters: [...preFinalWaters, finalWater]
	};
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
	const { rices, waters } = distribute(availableRice, [0.2], formRatio, waterBudget, noFinalWater);

	const stages: BrewStage[] = [
		{
			name: '밑술',
			riceFormLabel: RICE_FORM_LABELS[riceForm],
			rice: rices[0],
			water: waters[0],
			nuruk: nurukForRice(availableRice, nurukRatio)
		},
		{
			name: '덧술',
			riceFormLabel: GODUBAP,
			rice: rices[1],
			water: waters[1],
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
	const { rices, waters } = distribute(availableRice, [0.15, 0.15], formRatio, waterBudget, noFinalWater);

	const stages: BrewStage[] = [
		{
			name: '밑술',
			riceFormLabel: RICE_FORM_LABELS[riceForm],
			rice: rices[0],
			water: waters[0],
			nuruk: nurukForRice(availableRice, nurukRatio)
		},
		{
			name: '덧술',
			riceFormLabel: RICE_FORM_LABELS[riceForm],
			rice: rices[1],
			water: waters[1],
			nuruk: 0
		},
		{
			name: '덧술2',
			riceFormLabel: GODUBAP,
			rice: rices[2],
			water: waters[2],
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
