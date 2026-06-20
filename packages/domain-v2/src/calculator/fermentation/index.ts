import { Calculator } from '../abstract';
import { Wash } from '../../model/wash';

// 발효 파라미터 — 캘리브레이션 전 임시값. 실제 수치는 캘리브레이션 대상(TODO).
const MAX_SUGAR_CONCENTRATION = 0.05; // 한 단계에 녹을 수 있는 당 농도 한계 (에탄올 환산 분율)
const MAX_ABV = 0.185; // 효모 알코올 내성 — 도달 가능한 최대 도수 (0~1)
const EXCESS_LOSS_RATIO = 0.6; // 농도 초과분 중 굳어 영구 손실되는 비율 (0~1). 나머지는 다음 단계로 이월

/** 한 담금 단계의 투입 — 발효 시뮬은 부피·당만 필요하다(재료 형태 등은 모른다). */
export interface Feed {
	addedVolume: number; // L (물 + 쌀의 부피 기여)
	addedSugar: number; // 에탄올 환산 L (잠재 알코올)
}

export interface FermentationOutcome {
	abvPercent: number;
	volumeLiters: number;
	residualSugarLiters: number;
}

/**
 * 발효 시뮬 — 모든 발효주 공용 foundation. 단계별 투입(`Feed`) 시퀀스를 받아
 * `Wash`로 단계 발효를 돌려 도수·생산량·잔당을 낸다. **술 종류·재료 형태는 모른다.**
 * 술별 유도(분배)는 이 위 계층(`calculator/makgeolli` 등)에서 `Feed[]`를 만들어 넘긴다.
 */
export class Fermentation extends Calculator<Feed[], FermentationOutcome> {
	calculate(feeds: Feed[]): FermentationOutcome {
		let wash = Wash.empty();
		for (const { addedVolume, addedSugar } of feeds) {
			wash = wash
				.feed(addedVolume, addedSugar, MAX_SUGAR_CONCENTRATION, EXCESS_LOSS_RATIO)
				.ferment(MAX_ABV);
		}
		return {
			abvPercent: wash.abv * 100,
			volumeLiters: wash.volume,
			residualSugarLiters: wash.residualSugar
		};
	}

	/** 총당이 잔당 없이 내성까지 발효될 때의 총 부피(L). 최적 급수율 산출에 쓰인다. */
	ceilingVolume(totalSugarLiters: number): number {
		return totalSugarLiters / MAX_ABV;
	}
}
