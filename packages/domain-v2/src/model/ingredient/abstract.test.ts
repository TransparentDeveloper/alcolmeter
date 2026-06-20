import { describe, expect, it } from 'vitest';
import { Ingredient } from '.';

class Water extends Ingredient<Water> {
	constructor(amount: number, unit: string) {
		super(amount, unit);
	}
}

class Rice extends Ingredient<Rice> {
	constructor(amount: number, unit: string) {
		super(amount, unit);
	}
}

describe('Ingredient', () => {
	it('양과 단위를 보유한다', () => {
		const water = new Water(500, 'g');
		expect(water.amount).toBe(500);
		expect(water.unit).toBe('g');
	});

	it('같은 종류·양·단위면 동등하다', () => {
		expect(new Water(500, 'g').equals(new Water(500, 'g'))).toBe(true);
	});

	it('양이 다르면 다른 재료다', () => {
		expect(new Water(500, 'g').equals(new Water(300, 'g'))).toBe(false);
	});

	it('단위가 다르면 다른 재료다', () => {
		expect(new Water(1, 'L').equals(new Water(1, 'g'))).toBe(false);
	});

	it('양·단위가 같아도 종류가 다르면 다른 재료다', () => {
		const water = new Water(500, 'g');
		const rice = new Rice(500, 'g') as unknown as Water;
		expect(water.equals(rice)).toBe(false);
	});

	it('음수 양은 만들 수 없다', () => {
		expect(() => new Water(-1, 'g')).toThrow(RangeError);
	});

	it('유한하지 않은 양은 만들 수 없다', () => {
		expect(() => new Water(Infinity, 'g')).toThrow(RangeError);
	});
});
