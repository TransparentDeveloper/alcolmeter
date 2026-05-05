import { describe, expect, it } from 'vitest';
import { Mass } from '../../src/brewing/value-objects/mass';

describe('Mass', () => {
	it('of()로 생성하고 grams를 반환', () => {
		expect(Mass.of(100).grams).toBe(100);
	});

	it('zero()는 0g', () => {
		expect(Mass.zero().grams).toBe(0);
	});

	it('음수는 RangeError', () => {
		expect(() => Mass.of(-1)).toThrow(RangeError);
	});

	it('NaN은 RangeError', () => {
		expect(() => Mass.of(Number.NaN)).toThrow(RangeError);
	});

	it('Infinity는 RangeError', () => {
		expect(() => Mass.of(Number.POSITIVE_INFINITY)).toThrow(RangeError);
	});

	it('plus는 두 Mass의 합', () => {
		expect(Mass.of(100).plus(Mass.of(50)).grams).toBe(150);
	});

	it('minus는 두 Mass의 차', () => {
		expect(Mass.of(100).minus(Mass.of(30)).grams).toBe(70);
	});

	it('minus 결과가 음수면 RangeError', () => {
		expect(() => Mass.of(10).minus(Mass.of(20))).toThrow(RangeError);
	});

	it('equals는 grams 비교', () => {
		expect(Mass.of(100).equals(Mass.of(100))).toBe(true);
		expect(Mass.of(100).equals(Mass.of(99))).toBe(false);
	});
});
