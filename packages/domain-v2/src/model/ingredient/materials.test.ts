import { describe, expect, it } from 'vitest';
import { Nuruk, Rice, Water } from '.';

describe('Rice', () => {
	it('잠재 에탄올과 액체 부피에 모두 기여한다', () => {
		const rice = Rice.ofGrams(1000);
		expect(rice.potentialEthanolLiters).toBeGreaterThan(0);
		expect(rice.volumeLiters).toBeGreaterThan(0);
	});

	it('양에 비례해 기여가 늘어난다', () => {
		expect(Rice.ofGrams(2000).potentialEthanolLiters).toBeCloseTo(
			Rice.ofGrams(1000).potentialEthanolLiters * 2,
			5
		);
	});
});

describe('Water', () => {
	it('양만큼 액체 부피에 기여한다', () => {
		expect(Water.ofGrams(1000).volumeLiters).toBeCloseTo(1, 5);
	});

	it('발효 가능한 당이 없다', () => {
		// 물은 potentialEthanolLiters 자체가 없다(타입상 노출 안 함)
		expect('potentialEthanolLiters' in Water.ofGrams(1000)).toBe(false);
	});
});

describe('Nuruk', () => {
	it('투입량을 보유한다', () => {
		expect(Nuruk.ofGrams(100).amount).toBe(100);
	});
});
