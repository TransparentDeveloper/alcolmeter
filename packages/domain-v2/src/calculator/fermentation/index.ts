import { Calculator } from '../abstract';
import { Wash } from '../../model/wash';

/** 발효 상수 — 기질·효모에 따라 다르므로 술별 계산기가 주입한다. */
export interface FermentationParams {
	maxConcentration: number; // 한 단계에 녹을 수 있는 당 농도 한계 (에탄올 환산 분율)
	maxAbv: number; // 효모 알코올 내성 — 도달 가능한 최대 도수 (0~1)
	lossRatio: number; // 농도 초과분 중 굳어 영구 손실되는 비율 (0~1)
}

/** 한 담금 단계의 투입 — 발효 시뮬은 부피·당만 필요하다(재료 형태 등은 모른다). */
export interface Feed {
	addedVolume: number; // L (물 + 재료의 부피 기여)
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
 * 발효 상수(농도 한계·내성·손실률)는 술별 계산기가 생성자로 주입한다.
 */
export class Fermentation extends Calculator<Feed[], FermentationOutcome> {
	constructor(private readonly params: FermentationParams) {
		super();
	}

	calculate(feeds: Feed[]): FermentationOutcome {
		const { maxConcentration, maxAbv, lossRatio } = this.params;
		let wash = Wash.empty();
		for (const { addedVolume, addedSugar } of feeds) {
			wash = wash.feed(addedVolume, addedSugar, maxConcentration, lossRatio).ferment(maxAbv);
		}
		return {
			abvPercent: wash.abv * 100,
			volumeLiters: wash.volume,
			residualSugarLiters: wash.residualSugar
		};
	}

	/** 총당이 잔당 없이 내성까지 발효될 때의 총 부피(L). 최적 급수율 산출에 쓰인다. */
	ceilingVolume(totalSugarLiters: number): number {
		return totalSugarLiters / this.params.maxAbv;
	}
}
