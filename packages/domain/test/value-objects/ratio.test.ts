import { describe, expect, it } from 'vitest';
import { Ratio } from '../../src/brewing/value-objects/ratio';

describe('Ratio', () => {
	it('ofFraction()으로 생성하고 value를 반환', () => {
		expect(Ratio.ofFraction(0.1).value).toBe(0.1);
	});

	it('ofFraction(0)은 zero()와 동일', () => {
		expect(Ratio.ofFraction(0).value).toBe(0);
	});

	it('음수 fraction은 RangeError', () => {
		expect(() => Ratio.ofFraction(-0.1)).toThrow(RangeError);
	});

	it('NaN fraction은 RangeError', () => {
		expect(() => Ratio.ofFraction(Number.NaN)).toThrow(RangeError);
	});

	it('Infinity fraction은 RangeError', () => {
		expect(() => Ratio.ofFraction(Number.POSITIVE_INFINITY)).toThrow(RangeError);
	});

	it('equals는 value 비교', () => {
		expect(Ratio.ofFraction(0.1).equals(Ratio.ofFraction(0.1))).toBe(true);
		expect(Ratio.ofFraction(0.1).equals(Ratio.ofFraction(0.2))).toBe(false);
	});
});
