/**
 * 물·쌀·누룩·배·포도 등 모든 기초 재료의 공통 추상.
 * 양(amount)과 단위(unit)를 가지며, 재료의 종류는 하위 클래스로 구분한다.
 */
export abstract class Ingredient<Self extends Ingredient<Self>> {
	protected constructor(
		public readonly amount: number,
		public readonly unit: string
	) {
		if (!Number.isFinite(amount)) {
			throw new RangeError(`Ingredient amount must be a finite number, got ${amount}`);
		}
		if (amount < 0) {
			throw new RangeError(`Ingredient amount must be non-negative, got ${amount}`);
		}
	}

	equals(other: Self): boolean {
		return (
			other instanceof Ingredient &&
			this.constructor === other.constructor &&
			this.amount === other.amount &&
			this.unit === other.unit
		);
	}
}
