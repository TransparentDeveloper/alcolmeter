import { Calculator } from '../abstract';
import { Nuruk, Rice, Water } from '../../model/ingredient';
import { Wash } from '../../model/wash';

// 발효 파라미터 — 정성적 거동용 임시값. 실제 수치는 캘리브레이션 대상(TODO).
const MAX_SUGAR_CONCENTRATION = 0.06; // 한 단계에 녹을 수 있는 당 농도 한계 (에탄올 환산 분율)
const MAX_ABV = 0.18; // 효모 알코올 내성 — 도달 가능한 최대 도수 (0~1)

/** 발효 연산 입력. */
export interface FermentationInput {
	rice: Rice;
	water: Water;
	nuruk: Nuruk;
	stageCount: number;
}

/** 한 담금 단계에 투입되는 재료. */
export interface StageMaterials {
	rice: Rice;
	water?: Water;
	nuruk?: Nuruk;
}

export interface FermentationOutcome {
	abvPercent: number;
	volumeLiters: number;
	residualSugarLiters: number;
	stages: StageMaterials[];
}

/**
 * 발효 계산기(calculator 계층) — 재료와 발효횟수로 단계별 발효를 시뮬레이션한다.
 * 여러 모델(재료·Wash)을 엮는 연산이라 model이 아니라 calculator에 둔다.
 *
 * 유도(초기 규칙, 추후 정교화 예정): 물·누룩은 1단계(밑술)에 전량, 쌀은 N단계 균등 분할.
 * 물을 앞에 깔고 쌀(당)을 나눠 먹이면 단계 사이 발효가 당을 비워, 단수↑ → 도수↑ (방법 A).
 */
export class FermentationCalculator extends Calculator<FermentationInput, FermentationOutcome> {
	calculate(input: FermentationInput): FermentationOutcome {
		const { rice, water, nuruk, stageCount } = input;
		if (!Number.isInteger(stageCount) || stageCount < 1) {
			throw new RangeError(`stageCount must be a positive integer, got ${stageCount}`);
		}

		const sugarPerStage = rice.potentialEthanolLiters / stageCount;
		const riceVolumePerStage = rice.volumeLiters / stageCount;
		const riceGramsPerStage = rice.amount / stageCount;

		let wash = Wash.empty();
		const stages: StageMaterials[] = [];

		for (let stage = 0; stage < stageCount; stage++) {
			const isFirst = stage === 0;
			const addedVolume = riceVolumePerStage + (isFirst ? water.volumeLiters : 0);
			wash = wash.feed(addedVolume, sugarPerStage, MAX_SUGAR_CONCENTRATION).ferment(MAX_ABV);
			stages.push(
				isFirst
					? { rice: Rice.ofGrams(riceGramsPerStage), water, nuruk }
					: { rice: Rice.ofGrams(riceGramsPerStage) }
			);
		}

		return {
			abvPercent: wash.abv * 100,
			volumeLiters: wash.volume,
			residualSugarLiters: wash.residualSugar,
			stages
		};
	}
}
