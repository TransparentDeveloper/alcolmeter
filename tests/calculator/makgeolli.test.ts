import { describe, it, expect } from 'vitest';
import { calculateDanyang, calculateIyang, calculateSamyang } from '$lib/calculator/makgeolli';
import type { RiceForm } from '$lib/types';

describe('calculateDanyang', () => {
	it('떡 형태로 쌀 10kg 단양주 계산', () => {
		const result = calculateDanyang(10, 'tteok');

		const stage = result.stages[0];
		expect(stage.rice).toBe(10);
		expect(stage.water).toBe(10);    // 10 * 1
		expect(stage.nuruk).toBeCloseTo(1.0);
	});

	it('죽 형태로 쌀 10kg 단양주 계산', () => {
		const result = calculateDanyang(10, 'juk');

		const stage = result.stages[0];
		expect(stage.water).toBe(50);    // 10 * 5
	});
});

describe('calculateIyang', () => {
	it('떡 형태로 쌀 10kg 이양주 계산', () => {
		const result = calculateIyang(10, 'tteok');

		const [milsul, deotsul] = result.stages;

		// 밑술: 쌀 20% = 2, 물 = 2*1 = 2 (밑술 쌀 기준)
		expect(milsul.rice).toBe(2);
		expect(milsul.water).toBe(2);
		expect(milsul.nuruk).toBeCloseTo(1.0); // 총쌀 10의 10%

		// 덧술: 쌀 80% = 8
		expect(deotsul.rice).toBe(8);
		expect(deotsul.water).toBe(0);
	});

	it('범벅 형태로 쌀 10kg 이양주 - 밑술 쌀:물 = 1:3', () => {
		const result = calculateIyang(10, 'beombuk');

		const [milsul] = result.stages;

		// 밑술: 쌀 2, 물 = 2*3 = 6
		expect(milsul.rice).toBe(2);
		expect(milsul.water).toBe(6);
	});
});

describe('calculateSamyang', () => {
	it('떡 형태로 쌀 10kg 삼양주 계산', () => {
		const result = calculateSamyang(10, 'tteok');

		const [milsul, deotsul1, deotsul2] = result.stages;

		// 밑술: 쌀 15% = 1.5, 물 = 1.5*1 = 1.5
		expect(milsul.rice).toBe(1.5);
		expect(milsul.water).toBe(1.5);
		expect(milsul.nuruk).toBeCloseTo(1.0);

		// 덧술: 쌀 15% = 1.5, 물 = 1.5*1 = 1.5
		expect(deotsul1.rice).toBe(1.5);
		expect(deotsul1.water).toBe(1.5);

		// 덧술2: 쌀 70% = 7
		expect(deotsul2.rice).toBe(7);
		expect(deotsul2.water).toBe(0);
	});

	it('범벅 형태로 쌀 10kg 삼양주 - 각 단계 쌀:물 = 1:3', () => {
		const result = calculateSamyang(10, 'beombuk');

		const [milsul, deotsul1] = result.stages;

		// 밑술: 쌀 1.5, 물 = 1.5*3 = 4.5
		expect(milsul.rice).toBe(1.5);
		expect(milsul.water).toBe(4.5);

		// 덧술: 쌀 1.5, 물 = 1.5*3 = 4.5
		expect(deotsul1.rice).toBe(1.5);
		expect(deotsul1.water).toBe(4.5);
	});
});

describe('단계별 쌀:물 비율 검증', () => {
	it('이양주 범벅: 밑술 쌀:물 = 1:3', () => {
		const result = calculateIyang(10, 'beombuk');
		const milsul = result.stages[0];
		expect(milsul.water / milsul.rice).toBe(3);
	});

	it('삼양주 죽: 각 단계 쌀:물 = 1:5', () => {
		const result = calculateSamyang(10, 'juk');
		const [milsul, deotsul1] = result.stages;
		expect(milsul.water / milsul.rice).toBe(5);
		expect(deotsul1.water / deotsul1.rice).toBe(5);
	});
});

describe('custom nuruk ratio', () => {
	it('누룩 비율 15%로 이양주 계산', () => {
		const result = calculateIyang(10, 'tteok', 15);

		const [milsul] = result.stages;
		expect(milsul.nuruk).toBeCloseTo(1.5); // 총쌀 10의 15%
		expect(result.totalNuruk).toBeCloseTo(1.5);
	});

	it('기본값은 10%', () => {
		const withDefault = calculateDanyang(6, 'tteok');
		const withExplicit = calculateDanyang(6, 'tteok', 10);
		expect(withDefault.totalNuruk).toBe(withExplicit.totalNuruk);
	});
});
