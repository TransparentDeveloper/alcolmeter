import { describe, expect, it } from 'vitest';

import { AppleVariety } from '../apple-variety';
import { Apple } from '.';

describe('사과', () => {
	it('착즙 부피와 잠재 에탄올에 모두 기여한다', () => {
		const apple = Apple.of(1000, AppleVariety.of('FUJI'));
		expect(apple.juiceVolumeLiters).toBeGreaterThan(0);
		expect(apple.potentialEthanolLiters).toBeGreaterThan(0);
	});

	it('양에 비례해 기여가 늘어난다', () => {
		const one = Apple.of(1000, AppleVariety.of('FUJI'));
		const two = Apple.of(2000, AppleVariety.of('FUJI'));
		expect(two.juiceVolumeLiters).toBeCloseTo(one.juiceVolumeLiters * 2, 9);
		expect(two.potentialEthanolLiters).toBeCloseTo(one.potentialEthanolLiters * 2, 9);
	});

	it('당도 높은 품종이 같은 양에서 잠재 에탄올이 더 많다', () => {
		const sweeter = Apple.of(1000, AppleVariety.of('FUJI')); // brix 14
		const drier = Apple.of(1000, AppleVariety.of('AORI')); // brix 11
		expect(sweeter.potentialEthanolLiters).toBeGreaterThan(drier.potentialEthanolLiters);
	});
});
