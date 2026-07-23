import { describe, expect, it } from 'vitest';

import { Apple, Sugar } from '../../model/ingredient';
import { AppleVariety, type AppleVarietyCodeType } from '../../model/apple-variety';
import { CiderCalculator } from '.';

const calculator = new CiderCalculator();

function brew(appleGrams: number, variety: AppleVarietyCodeType, sugarGrams = 0) {
	return calculator.calculate({
		apple: Apple.of(appleGrams, AppleVariety.of(variety)),
		sugar: Sugar.ofGrams(sugarGrams)
	});
}

describe('사이다 계산', () => {
	it('사과만으로도 도수·생산량이 나온다', () => {
		const result = brew(10_000, 'FUJI');
		expect(result.abvPercent).toBeGreaterThan(0);
		expect(result.volumeLiters).toBeGreaterThan(0);
	});

	it('가당하면 도수가 오른다', () => {
		const plain = brew(10_000, 'FUJI');
		const chaptalized = brew(10_000, 'FUJI', 1000);
		expect(chaptalized.abvPercent).toBeGreaterThan(plain.abvPercent);
	});

	it('당도 높은 품종이 같은 양에서 도수가 높다', () => {
		expect(brew(10_000, 'FUJI').abvPercent).toBeGreaterThan(brew(10_000, 'AORI').abvPercent);
	});

	it('정상 사과즙은 잔당 없이 드라이하게 발효된다', () => {
		expect(brew(10_000, 'FUJI').residualSugarLiters).toBeCloseTo(0, 6);
	});

	it('내성을 크게 넘기게 가당하면 잔당이 남는다', () => {
		const result = brew(10_000, 'FUJI', 5000);
		expect(result.residualSugarLiters).toBeGreaterThan(0);
	});
});
