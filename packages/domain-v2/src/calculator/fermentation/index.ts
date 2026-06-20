import { Calculator } from '../abstract';
import { Nuruk, Rice, Water } from '../../model/ingredient';
import { Wash } from '../../model/wash';

// 발효 파라미터 — 캘리브레이션 전 임시값. 실제 수치는 캘리브레이션 대상(TODO).
const MAX_SUGAR_CONCENTRATION = 0.05; // 한 단계에 녹을 수 있는 당 농도 한계 (에탄올 환산 분율)
const MAX_ABV = 0.185; // 효모 알코올 내성 — 도달 가능한 최대 도수 (0~1)
const EXCESS_LOSS_RATIO = 0.6; // 농도 초과분 중 굳어 영구 손실되는 비율 (0~1). 나머지는 다음 단계로 이월

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
 * 유도(분배): 단계가 갈수록 커진다. 물은 앞 단계에 많이(묽은 밑술), 쌀은 뒤 단계에
 * 많이(된 덧술), 누룩은 1단계(밑술)에 전량. 단계마다 당을 나눠 먹이면 사이사이 발효가
 * 당을 비워 더 많이 발효되므로, 발효횟수↑ → 도수↑. 농도 초과분 손실은 Wash.feed 참고.
 */
export class FermentationCalculator extends Calculator<FermentationInput, FermentationOutcome> {
	calculate(input: FermentationInput): FermentationOutcome {
		const { rice, water, nuruk, stageCount } = input;
		if (!Number.isInteger(stageCount) || stageCount < 1) {
			throw new RangeError(`stageCount must be a positive integer, got ${stageCount}`);
		}

		// 단계 가중치 합 (1+2+…+N). 쌀은 뒤로 갈수록(stage+1), 물은 앞으로 갈수록(N−stage) 많이.
		const weightSum = (stageCount * (stageCount + 1)) / 2;

		let wash = Wash.empty();
		const stages: StageMaterials[] = [];

		for (let stage = 0; stage < stageCount; stage++) {
			const riceFraction = (stage + 1) / weightSum; // 밑술 작게 → 덧술 크게
			const waterFraction = (stageCount - stage) / weightSum; // 밑술 묽게 → 덧술 되게

			const addedVolume = rice.volumeLiters * riceFraction + water.volumeLiters * waterFraction;
			const addedSugar = rice.potentialEthanolLiters * riceFraction;
			wash = wash
				.feed(addedVolume, addedSugar, MAX_SUGAR_CONCENTRATION, EXCESS_LOSS_RATIO)
				.ferment(MAX_ABV);

			const stageRice = Rice.ofGrams(rice.amount * riceFraction);
			const stageWater = Water.ofGrams(water.amount * waterFraction);
			stages.push(
				stage === 0
					? { rice: stageRice, water: stageWater, nuruk }
					: { rice: stageRice, water: stageWater }
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
