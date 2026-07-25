import { describe, expect, it } from 'vitest';

import { sugarGramsToEthanolLiters, ethanolLitersToSugarGrams } from './sugar-helper';

describe('당→에탄올 변환', () => {
	it('당이 없으면 잠재 에탄올도 0이다', () => {
		expect(sugarGramsToEthanolLiters(0)).toBe(0);
	});

	it('당 질량에 비례해 잠재 에탄올이 늘어난다', () => {
		expect(sugarGramsToEthanolLiters(200)).toBeCloseTo(sugarGramsToEthanolLiters(100) * 2, 9);
	});

	it('당이 있으면 양의 잠재 에탄올이 나온다', () => {
		expect(sugarGramsToEthanolLiters(100)).toBeGreaterThan(0);
	});
});

describe('에탄올→당 역변환', () => {
	it('당→에탄올→당 왕복이 원래 값을 복원한다', () => {
		expect(ethanolLitersToSugarGrams(sugarGramsToEthanolLiters(300))).toBeCloseTo(300, 6);
	});

	it('에탄올이 없으면 당도 0이다', () => {
		expect(ethanolLitersToSugarGrams(0)).toBe(0);
	});
});
