import { describe, expect, it } from 'vitest';

import { Sugar } from '.';

describe('가당 설탕', () => {
	it('잠재 에탄올과 부피에 모두 기여한다', () => {
		const sugar = Sugar.ofGrams(500);
		expect(sugar.potentialEthanolLiters).toBeGreaterThan(0);
		expect(sugar.volumeLiters).toBeGreaterThan(0);
	});

	it('양에 비례해 잠재 에탄올이 늘어난다', () => {
		expect(Sugar.ofGrams(1000).potentialEthanolLiters).toBeCloseTo(
			Sugar.ofGrams(500).potentialEthanolLiters * 2,
			9
		);
	});

	it('설탕이 없으면 잠재 에탄올도 0이다', () => {
		expect(Sugar.ofGrams(0).potentialEthanolLiters).toBe(0);
	});
});
