import { ValueObject } from '../../building-blocks';

export class Ratio extends ValueObject<Ratio> {
	private constructor(public readonly value: number) {
		super();
		if (!Number.isFinite(value)) {
			throw new RangeError(`Ratio must be a finite number, got ${value}`);
		}
		if (value < 0) {
			throw new RangeError(`Ratio must be non-negative, got ${value}`);
		}
	}

	static ofFraction(value: number): Ratio {
		return new Ratio(value);
	}

	equals(other: Ratio): boolean {
		return this.value === other.value;
	}
}
