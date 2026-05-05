import { ValueObject } from '../../building-blocks';

export class Mass extends ValueObject<Mass> {
	private constructor(public readonly grams: number) {
		super();
		if (!Number.isFinite(grams)) {
			throw new RangeError(`Mass must be a finite number, got ${grams}`);
		}
		if (grams < 0) {
			throw new RangeError(`Mass must be non-negative, got ${grams}`);
		}
	}

	static of(grams: number): Mass {
		return new Mass(grams);
	}

	static zero(): Mass {
		return new Mass(0);
	}

	plus(other: Mass): Mass {
		return Mass.of(this.grams + other.grams);
	}

	minus(other: Mass): Mass {
		return Mass.of(this.grams - other.grams);
	}

	equals(other: Mass): boolean {
		return this.grams === other.grams;
	}
}
