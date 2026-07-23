import { sugarGramsToEthanolLiters } from '../../utils/sugar-helper';
import { Ingredient } from './abstract';

// 설탕 용해 시 부피 기여(L/g) — 설탕 밀도 ~1.59 g/mL. 캘리브레이션 전 임시값.
const VOLUME_LITERS_PER_GRAM = 0.000629;

/** 가당용 순설탕 — 발효 가능한 당으로 잠재 에탄올에 기여하고, 용해 시 소량 부피에도 기여한다. */
export class Sugar extends Ingredient<Sugar> {
	private constructor(grams: number) {
		super(grams, 'g');
	}

	static ofGrams(grams: number): Sugar {
		return new Sugar(grams);
	}

	/** 다 발효되면 나올 잠재 에탄올 (L) */
	get potentialEthanolLiters(): number {
		return sugarGramsToEthanolLiters(this.amount);
	}

	/** 용해 시 액체 부피 기여 (L) */
	get volumeLiters(): number {
		return this.amount * VOLUME_LITERS_PER_GRAM;
	}
}
