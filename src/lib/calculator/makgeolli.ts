import { RICE_WATER_RATIO, RICE_FORM_LABELS, type RiceForm, type BrewResult, type BrewStage } from '$lib/types';

const GODUBAP = '고두밥';

function nurukForRice(rice: number, ratioPercent: number): number {
	return rice * (ratioPercent / 100);
}

/**
 * 밑술/덧술 단계에 형태 비율대로 물을 배분하되,
 * 총 물 예산(totalWater)을 초과하지 않도록 비례 축소.
 * 최종 덧술(고두밥)에 나머지 물 배분.
 * 떡/고두밥은 최종 덧술 가수 없음.
 */
function distributeWater(
	stageRices: number[],
	riceForm: RiceForm,
	totalWater: number,
	noFinalWater: boolean
): number[] {
	const formRatio = RICE_WATER_RATIO[riceForm];

	// 최종 덧술 제외 단계들의 이상적 물량
	const preFinalStages = stageRices.slice(0, -1);
	const idealWaters = preFinalStages.map(r => r * formRatio);
	const idealSum = idealWaters.reduce((a, b) => a + b, 0);

	let preWaters: number[];
	if (idealSum <= totalWater) {
		// 예산 내: 이상적 비율 그대로
		preWaters = idealWaters;
	} else {
		// 예산 초과: 비례 축소
		const scale = totalWater / idealSum;
		preWaters = idealWaters.map(w => w * scale);
	}

	const usedWater = preWaters.reduce((a, b) => a + b, 0);
	const finalWater = noFinalWater ? 0 : Math.max(0, totalWater - usedWater);

	return [...preWaters, finalWater];
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

export function calculateDanyang(availableRice: number, riceForm: RiceForm, waterRatio: number = 1, nurukRatio: number = 10): BrewResult {
	const totalWater = availableRice * waterRatio;
	const stages: BrewStage[] = [
		{
			name: '전량 투입',
			riceFormLabel: RICE_FORM_LABELS[riceForm],
			rice: availableRice,
			water: totalWater,
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
	const milsulRice = availableRice * 0.2;
	const deotsulRice = availableRice * 0.8;
	const totalWater = availableRice * waterRatio;
	const noFinalWater = riceForm === 'tteok' || riceForm === 'godubap';
	const [milsulWater, deotsulWater] = distributeWater(
		[milsulRice, deotsulRice], riceForm, totalWater, noFinalWater
	);

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
	const milsulRice = availableRice * 0.15;
	const deotsul1Rice = availableRice * 0.15;
	const deotsul2Rice = availableRice * 0.7;
	const totalWater = availableRice * waterRatio;
	const noFinalWater = riceForm === 'tteok' || riceForm === 'godubap';
	const [milsulWater, deotsul1Water, deotsul2Water] = distributeWater(
		[milsulRice, deotsul1Rice, deotsul2Rice], riceForm, totalWater, noFinalWater
	);

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
