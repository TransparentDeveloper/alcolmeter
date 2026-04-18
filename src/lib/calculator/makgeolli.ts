import { RICE_WATER_RATIO, type RiceForm, type BrewResult, type BrewStage } from '$lib/types';
import { DEFAULT_NURUK } from '$lib/data/nuruk';

function waterForRice(rice: number, form: RiceForm): number {
	return rice * RICE_WATER_RATIO[form];
}

function nurukForRice(rice: number): number {
	return rice * DEFAULT_NURUK.riceRatio;
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

export function calculateDanyang(totalRice: number, riceForm: RiceForm): BrewResult {
	const stages: BrewStage[] = [
		{
			name: '전량 투입',
			rice: totalRice,
			water: waterForRice(totalRice, riceForm),
			nuruk: nurukForRice(totalRice)
		}
	];

	return {
		type: 'danyang',
		label: '단양주',
		stages,
		...sumStages(stages)
	};
}

export function calculateIyang(totalRice: number, riceForm: RiceForm): BrewResult {
	const milsulRice = totalRice / 3;
	const deotsulRice = (totalRice * 2) / 3;

	const stages: BrewStage[] = [
		{
			name: '밑술',
			rice: milsulRice,
			water: waterForRice(milsulRice, riceForm),
			nuruk: nurukForRice(milsulRice)
		},
		{
			name: '덧술',
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

export function calculateSamyang(totalRice: number, riceForm: RiceForm): BrewResult {
	const milsulRice = totalRice / 6;
	const deotsul1Rice = totalRice / 6;
	const deotsul2Rice = (totalRice * 4) / 6;

	const stages: BrewStage[] = [
		{
			name: '밑술',
			rice: milsulRice,
			water: waterForRice(milsulRice, riceForm),
			nuruk: nurukForRice(milsulRice)
		},
		{
			name: '덧술',
			rice: deotsul1Rice,
			water: waterForRice(deotsul1Rice, riceForm),
			nuruk: 0
		},
		{
			name: '덧술2',
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
