import { ValueObject } from '../../../building-blocks';

const PRECISION = 1e5; // 소수점 5자리 보장

export class Mass extends ValueObject<Mass> {
	private static round(n: number): number {
		return Math.round(n * PRECISION) / PRECISION;
	}

	private constructor(public readonly grams: number) {
		super();
		if (!Number.isFinite(grams)) {
			throw new RangeError(`Mass must be a finite number, got ${grams}`);
		}
		if (grams < 0) {
			throw new RangeError(`Mass must be non-negative, got ${grams}`);
		}
	}

	/** 리터 단위로 변환 (1L = 1000g) */
	get liters(): number {
		return this.grams / 1000;
	}

	/** 그램(g) 단위로 생성 */
	static ofGrams(grams: number): Mass {
		return new Mass(Mass.round(grams));
	}

	/** 리터(L) 단위로 생성 (1L = 1000g) */
	static ofLiters(liters: number): Mass {
		return new Mass(Mass.round(liters * 1000));
	}

	static zero(): Mass {
		return new Mass(0);
	}

	plus(other: Mass): Mass {
		return Mass.ofGrams(this.grams + other.grams);
	}

	minus(other: Mass): Mass {
		return Mass.ofGrams(this.grams - other.grams);
	}

	times(factor: number): Mass {
		return Mass.ofGrams(this.grams * factor);
	}

	equals(other: Mass): boolean {
		return other instanceof Mass && this.grams === other.grams;
	}
}
