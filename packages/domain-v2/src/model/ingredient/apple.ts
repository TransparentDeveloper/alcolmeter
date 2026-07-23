import type { AppleVariety } from '../apple-variety';

import { sugarGramsToEthanolLiters } from '../../utils/sugar-helper';
import { Ingredient } from './abstract';

// 착즙액 밀도(kg/L) — Brix를 당 질량으로 환산할 때 쓴다. 캘리브레이션 전 임시값.
const JUICE_DENSITY = 1.05;

/** 사과 — 착즙액의 당이 발효되어 에탄올이 되고, 즙 부피에 기여한다. */
export class Apple extends Ingredient<Apple> {
	private constructor(
		grams: number,
		private readonly variety: AppleVariety
	) {
		super(grams, 'g');
	}

	static of(grams: number, variety: AppleVariety): Apple {
		return new Apple(grams, variety);
	}

	/** 착즙 부피 (L) = 사과 kg × 품종 착즙률 */
	get juiceVolumeLiters(): number {
		return (this.amount / 1000) * this.variety.juiceYield;
	}

	/** 다 발효되면 나올 잠재 에탄올 (L) — 착즙액 당량을 에탄올로 환산 */
	get potentialEthanolLiters(): number {
		// 즙 속 당 질량(g) = 즙 부피(L) × 밀도(kg/L) × Brix(g당/100g) × 1000(g/kg) / 100
		const sugarGrams = this.juiceVolumeLiters * JUICE_DENSITY * this.variety.brix * 10;
		return sugarGramsToEthanolLiters(sugarGrams);
	}
}
