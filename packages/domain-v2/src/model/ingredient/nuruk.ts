import { Ingredient } from './abstract';

/** 누룩 — 발효 효소·효모원. 현재 모델에선 당·부피 기여를 0으로 둔다(추후 효모 용량으로 반영 가능). */
export class Nuruk extends Ingredient<Nuruk> {
	private constructor(grams: number) {
		super(grams, 'g');
	}

	static ofGrams(grams: number): Nuruk {
		return new Nuruk(grams);
	}
}
