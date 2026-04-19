import { describe, it, expect } from 'vitest';
import { calculateDanyang, calculateIyang, calculateSamyang } from '$lib/calculator/makgeolli';

describe('이양주 (기본 물비율 1:1)', () => {
	it('떡 10kg: 밑술 가수만, 덧술 가수 없음', () => {
		const [milsul, deotsul] = calculateIyang(10, 'tteok').stages;

		expect(milsul.rice).toBe(2);
		expect(milsul.water).toBe(2);

		expect(deotsul.rice).toBe(8);
		expect(deotsul.water).toBe(0);
	});

	it('범벅 10kg: 밑술 1:3, 덧술에 부족분 보충', () => {
		const r = calculateIyang(10, 'beombuk');
		const [milsul, deotsul] = r.stages;

		expect(milsul.water).toBe(6);
		expect(deotsul.water).toBe(4);
		expect(r.totalWater).toBe(10);
	});
});

describe('삼양주 (기본 물비율 1:1)', () => {
	it('떡 10kg: 덧술2 가수 없음', () => {
		const [milsul, deotsul1, deotsul2] = calculateSamyang(10, 'tteok').stages;

		expect(milsul.water).toBe(1.5);
		expect(deotsul1.water).toBe(1.5);
		expect(deotsul2.water).toBe(0);
	});

	it('범벅 10kg: 덧술2에 부족분 보충', () => {
		const r = calculateSamyang(10, 'beombuk');
		const [,, deotsul2] = r.stages;

		expect(deotsul2.water).toBe(1);
		expect(r.totalWater).toBe(10);
	});
});

describe('커스텀 물 비율', () => {
	it('이양주 범벅 10kg, 물비율 1.5: 총 물 15L', () => {
		const r = calculateIyang(10, 'beombuk', 1.5);
		const [milsul, deotsul] = r.stages;

		expect(milsul.water).toBe(6);    // 2 * 3
		expect(deotsul.water).toBe(9);   // 15 - 6
		expect(r.totalWater).toBe(15);
	});

	it('단양주 고두밥 10kg, 물비율 0.8: 총 물 8L', () => {
		const r = calculateDanyang(10, 'godubap', 0.8);
		expect(r.totalWater).toBe(8);
	});
});

describe('누룩', () => {
	it('총 쌀량 기준 비율', () => {
		// waterRatio=1, nurukRatio=15
		expect(calculateIyang(10, 'tteok', 1, 15).totalNuruk).toBeCloseTo(1.5);
	});

	it('기본값 10%', () => {
		expect(calculateDanyang(10, 'tteok').totalNuruk).toBeCloseTo(1.0);
	});
});
