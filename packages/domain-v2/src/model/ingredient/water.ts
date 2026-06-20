import { Ingredient } from './abstract';

/** 물 — 부피에만 기여한다(밀도 1 가정, 1 g = 1 mL). */
export class Water extends Ingredient<Water> {
	private constructor(grams: number) {
		super(grams, 'g');
	}

	static ofGrams(grams: number): Water {
		return new Water(grams);
	}

	/** 액체 부피 기여 (L) */
	get volumeLiters(): number {
		return this.amount / 1000;
	}
}
