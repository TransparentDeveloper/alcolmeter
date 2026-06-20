import { Ingredient } from './abstract';

// 계수는 정성적 거동용 임시값. 실제 수치는 캘리브레이션 대상(TODO).
const POTENTIAL_ETHANOL_PER_KG = 0.4; // 쌀 1kg이 다 발효되면 나올 잠재 에탄올(L)
const VOLUME_PER_KG = 0.3; // 쌀 1kg의 액체 부피 기여(L)

/** 쌀 — 전분이 당화·발효되어 에탄올이 되고, 액체 부피에도 기여한다. */
export class Rice extends Ingredient<Rice> {
	private constructor(grams: number) {
		super(grams, 'g');
	}

	static ofGrams(grams: number): Rice {
		return new Rice(grams);
	}

	/** 다 발효되면 나올 잠재 에탄올 (L) */
	get potentialEthanolLiters(): number {
		return (this.amount / 1000) * POTENTIAL_ETHANOL_PER_KG;
	}

	/** 액체 부피 기여 (L) */
	get volumeLiters(): number {
		return (this.amount / 1000) * VOLUME_PER_KG;
	}
}
