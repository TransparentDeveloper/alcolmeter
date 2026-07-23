import { describe, expect, it } from 'vitest';

import { Fermentation } from '.';

const fermentation = new Fermentation({ maxConcentration: 0.05, maxAbv: 0.185, lossRatio: 0.6 });

describe('발효 시뮬', () => {
	it('투입이 없으면 도수는 0이다', () => {
		expect(fermentation.calculate([]).abvPercent).toBe(0);
	});

	it('같은 당을 한 번에 넣는 것보다 나눠 넣으면 도수가 높고 잔당이 적다', () => {
		const atOnce = fermentation.calculate([{ addedVolume: 1, addedSugar: 0.24 }]);
		const staged = fermentation.calculate([
			{ addedVolume: 1, addedSugar: 0.06 },
			{ addedVolume: 0, addedSugar: 0.06 },
			{ addedVolume: 0, addedSugar: 0.06 },
			{ addedVolume: 0, addedSugar: 0.06 }
		]);
		expect(staged.abvPercent).toBeGreaterThan(atOnce.abvPercent);
		expect(staged.residualSugarLiters).toBeLessThan(atOnce.residualSugarLiters);
	});

	it('당이 아무리 많아도 도수는 내성을 넘지 않는다', () => {
		const wash = fermentation.calculate([{ addedVolume: 1, addedSugar: 1 }]);
		expect(wash.abvPercent).toBeLessThanOrEqual(18.5 + 1e-9);
	});

	it('최적 부피는 총당을 내성으로 나눈 값이다', () => {
		// 총당 0.185 → 내성 18.5%에 정확히 닿는 부피 1.0L
		expect(fermentation.ceilingVolume(0.185)).toBeCloseTo(1, 9);
	});
});
