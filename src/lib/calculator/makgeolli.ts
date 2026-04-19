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

export function calculateDanyang(totalRice: number, riceForm: RiceForm, nurukRatio: number = 10): BrewResult {
	const totalWater = totalRice * RICE_WATER_RATIO[riceForm];

	const stages: BrewStage[] = [
		{
			name: '전량 투입',
			riceFormLabel: RICE_FORM_LABELS[riceForm],
			rice: totalRice,
			water: totalWater,
			nuruk: nurukForRice(totalRice, nurukRatio)
		}
	];

	return {
		type: 'danyang',
		label: '단양주',
		stages,
		...sumStages(stages)
	};
}

export function calculateIyang(totalRice: number, riceForm: RiceForm, nurukRatio: number = 10): BrewResult {
	const milsulRice = totalRice / 3;
	const deotsulRice = (totalRice * 2) / 3;
	const totalWater = totalRice * RICE_WATER_RATIO[riceForm];

	const stages: BrewStage[] = [
		{
			name: '밑술',
			riceFormLabel: RICE_FORM_LABELS[riceForm],
			rice: milsulRice,
			water: totalWater,
			nuruk: nurukForRice(totalRice, nurukRatio)
		},
		{
			name: '덧술',
			riceFormLabel: GODUBAP,
			rice: deotsulRice,
			water: 0,
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

export function calculateSamyang(totalRice: number, riceForm: RiceForm, nurukRatio: number = 10): BrewResult {
	const milsulRice = totalRice / 6;
	const deotsul1Rice = totalRice / 6;
	const deotsul2Rice = (totalRice * 4) / 6;
	const totalWater = totalRice * RICE_WATER_RATIO[riceForm];
	const halfWater = totalWater / 2;

	const stages: BrewStage[] = [
		{
			name: '밑술',
			riceFormLabel: RICE_FORM_LABELS[riceForm],
			rice: milsulRice,
			water: halfWater,
			nuruk: nurukForRice(totalRice, nurukRatio)
		},
		{
			name: '덧술',
			riceFormLabel: RICE_FORM_LABELS[riceForm],
			rice: deotsul1Rice,
			water: halfWater,
			nuruk: 0
		},
		{
			name: '덧술2',
			riceFormLabel: GODUBAP,
			rice: deotsul2Rice,
			water: 0,
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
