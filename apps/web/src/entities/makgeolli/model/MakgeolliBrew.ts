import type {
	MakgeolliResult,
	MakgeolliStage,
	IngredientKindType,
	RiceFormType
} from '@alcolmeter/domain-v2';

// 한 담금 단계의 투입량(표시 단위). 단계명·쌀형태 라벨은 뷰에서 붙인다.
interface BrewStage {
	riceForm: RiceFormType;
	rice: number; // kg
	water: number; // L
	nuruk: number; // kg
}

interface BrewEstimates {
	volumeLiters: number;
	alcoholPercent: number;
}

interface BrewData {
	stages: BrewStage[];
	totalRice: number;
	totalWater: number;
	totalNuruk: number;
	estimates: BrewEstimates;
}

// 도메인 결과의 단계 투입량은 g으로 온다. kg·L 표시를 위해 1000으로 나눈다.
function amountToKg(stage: MakgeolliStage, kind: IngredientKindType): number {
	return (stage.ingredients.find((item) => item.kind === kind)?.amount ?? 0) / 1000;
}

// 막걸리 계산 결과 뷰모델. domain-v2 결과를 감싸 화면용 수치·구조로 제공한다(라벨 없음).
class MakgeolliBrew {
	private data: BrewData;

	constructor(data: BrewData) {
		this.data = data;
	}

	get stages(): BrewStage[] {
		return this.data.stages;
	}

	get totalRice(): number {
		return this.data.totalRice;
	}

	get totalWater(): number {
		return this.data.totalWater;
	}

	get totalNuruk(): number {
		return this.data.totalNuruk;
	}

	get estimates(): BrewEstimates {
		return this.data.estimates;
	}

	// domain-v2 계산 결과 → 화면용 뷰모델 (g→kg·L 환산 + 합계 산출).
	static fromOutcome(outcome: MakgeolliResult): MakgeolliBrew {
		const stages: BrewStage[] = outcome.stages.map((s) => ({
			riceForm: s.riceForm,
			rice: amountToKg(s, 'RICE'),
			water: amountToKg(s, 'WATER'),
			nuruk: amountToKg(s, 'NURUK')
		}));

		return new MakgeolliBrew({
			stages,
			totalRice: stages.reduce((sum, s) => sum + s.rice, 0),
			totalWater: stages.reduce((sum, s) => sum + s.water, 0),
			totalNuruk: stages.reduce((sum, s) => sum + s.nuruk, 0),
			estimates: { volumeLiters: outcome.volumeLiters, alcoholPercent: outcome.abvPercent }
		});
	}
}

export { MakgeolliBrew };
export type { BrewStage, BrewEstimates };
