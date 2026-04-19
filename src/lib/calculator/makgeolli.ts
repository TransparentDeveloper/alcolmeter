import { RICE_WATER_RATIO, RICE_FORM_LABELS, type RiceForm, type BrewResult, type BrewStage } from '$lib/types';

const GODUBAP = '고두밥';

function waterForRice(rice: number, form: RiceForm): number {
	return rice * RICE_WATER_RATIO[form];
}

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
	const totalWater = totalRice; // 총 쌀:물 = 1:1
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
	const milsulRice = totalRice * 0.2;
	const deotsulRice = totalRice * 0.8;
	const milsulWater = waterForRice(milsulRice, riceForm);
	// 떡: 고두밥 투입 시 가수하지 않음 (극단적 단맛 의도)
	const deotsulWater = riceForm === 'tteok' ? 0 : totalRice - milsulWater;

	const stages: BrewStage[] = [
		{
			name: '밑술',
			riceFormLabel: RICE_FORM_LABELS[riceForm],
			rice: milsulRice,
			water: milsulWater,
			nuruk: nurukForRice(totalRice, nurukRatio)
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

export function calculateSamyang(totalRice: number, riceForm: RiceForm, nurukRatio: number = 10): BrewResult {
	const milsulRice = totalRice * 0.15;
	const deotsul1Rice = totalRice * 0.15;
	const deotsul2Rice = totalRice * 0.7;
	const milsulWater = waterForRice(milsulRice, riceForm);
	const deotsul1Water = waterForRice(deotsul1Rice, riceForm);
	// 떡: 고두밥 투입 시 가수하지 않음 (극단적 단맛 의도)
	const deotsul2Water = riceForm === 'tteok' ? 0 : totalRice - milsulWater - deotsul1Water;

	const stages: BrewStage[] = [
		{
			name: '밑술',
			riceFormLabel: RICE_FORM_LABELS[riceForm],
			rice: milsulRice,
			water: milsulWater,
			nuruk: nurukForRice(totalRice, nurukRatio)
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
