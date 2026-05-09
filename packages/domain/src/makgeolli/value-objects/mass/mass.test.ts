import { describe, expect, it } from 'vitest';
import { Mass } from '.';

describe('Mass', () => {
	describe('생성', () => {
		it('그램 단위로 생성할 수 있다', () => {
			expect(Mass.ofGrams(100).grams).toBe(100);
		});

		it('리터 단위로 생성할 수 있다 (1L = 1000g)', () => {
			expect(Mass.ofLiters(1).grams).toBe(1000);
			expect(Mass.ofLiters(1.5).grams).toBe(1500);
		});

		it('0은 허용한다', () => {
			expect(Mass.zero().grams).toBe(0);
		});

		it('음수는 허용하지 않는다', () => {
			expect(() => Mass.ofGrams(-1)).toThrow(RangeError);
			expect(() => Mass.ofLiters(-1)).toThrow(RangeError);
		});

		it('무한대는 허용하지 않는다', () => {
			expect(() => Mass.ofGrams(Number.POSITIVE_INFINITY)).toThrow(RangeError);
		});

		it('NaN은 허용하지 않는다', () => {
			expect(() => Mass.ofGrams(Number.NaN)).toThrow(RangeError);
		});
	});

	describe('단위 변환', () => {
		it('그램을 리터로 환산한다 (1000g = 1L)', () => {
			expect(Mass.ofGrams(1000).liters).toBe(1);
			expect(Mass.ofGrams(500).liters).toBe(0.5);
		});
	});

	describe('산술', () => {
		it('두 질량을 더할 수 있다', () => {
			expect(Mass.ofGrams(100).plus(Mass.ofGrams(50)).grams).toBe(150);
		});

		it('작은 질량을 뺄 수 있다', () => {
			expect(Mass.ofGrams(100).minus(Mass.ofGrams(30)).grams).toBe(70);
		});

		it('뺀 결과가 음수가 되면 허용하지 않는다', () => {
			expect(() => Mass.ofGrams(10).minus(Mass.ofGrams(20))).toThrow(RangeError);
		});

		it('배율을 곱할 수 있다', () => {
			expect(Mass.ofGrams(100).times(0.1).grams).toBe(10);
		});

		it('0을 곱하면 0이 된다', () => {
			expect(Mass.ofGrams(100).times(0).grams).toBe(0);
		});

		it('값이 같으면 동일한 질량이다', () => {
			expect(Mass.ofGrams(100).equals(Mass.ofGrams(100))).toBe(true);
			expect(Mass.ofGrams(100).equals(Mass.ofGrams(99))).toBe(false);
		});
	});

	describe('정밀도', () => {
		it('소수점 5자리를 초과하는 값은 반올림된다', () => {
			expect(Mass.ofGrams(1.123456).grams).toBe(1.12346);
			expect(Mass.ofGrams(1.123454).grams).toBe(1.12345);
		});

		it('연산이 누적되어도 부동소수점 오차가 발생하지 않는다', () => {
			const unit = Mass.ofGrams(800 / 6);
			const total = unit.plus(unit).plus(Mass.ofGrams(800 - unit.grams - unit.grams));
			expect(total.grams).toBe(800);
		});
	});
});
