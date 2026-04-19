import { describe, it, expect } from 'vitest';
import { calculateDanyang, calculateIyang, calculateSamyang } from '$lib/calculator/makgeolli';
import type { RiceForm } from '$lib/types';

describe('calculateDanyang', () => {
	it('떡 형태로 쌀 6kg 단양주 계산', () => {
		const result = calculateDanyang(6, 'tteok');

		expect(result.type).toBe('danyang');
		expect(result.stages).toHaveLength(1);

		const stage = result.stages[0];
		expect(stage.name).toBe('전량 투입');
		expect(stage.riceFormLabel).toBe('떡 (설기)');
		expect(stage.rice).toBe(6);
		expect(stage.water).toBe(6);
		expect(stage.nuruk).toBeCloseTo(0.6);
	});

	it('죽 형태로 쌀 3kg 단양주 계산', () => {
		const result = calculateDanyang(3, 'juk');

		const stage = result.stages[0];
		expect(stage.rice).toBe(3);
		expect(stage.water).toBe(15);
		expect(stage.nuruk).toBeCloseTo(0.3);
	});
});

describe('calculateIyang', () => {
	it('떡 형태로 쌀 10kg 이양주 계산', () => {
		const result = calculateIyang(10, 'tteok');

		expect(result.type).toBe('iyang');
		expect(result.stages).toHaveLength(2);

		const [milsul, deotsul] = result.stages;

		// 밑술: 쌀 20% = 2, 물 = 총쌀10*1 = 10 전량, 누룩 = 총쌀의 10%
		expect(milsul.name).toBe('밑술');
		expect(milsul.rice).toBe(2);
		expect(milsul.water).toBe(10);
		expect(milsul.nuruk).toBeCloseTo(1.0);

		// 덧술: 쌀 80% = 8, 고두밥
		expect(deotsul.name).toBe('덧술');
		expect(deotsul.riceFormLabel).toBe('고두밥');
		expect(deotsul.rice).toBe(8);
		expect(deotsul.water).toBe(0);
		expect(deotsul.nuruk).toBe(0);
	});

	it('범벅 형태로 쌀 10kg 이양주 계산', () => {
		const result = calculateIyang(10, 'beombuk');

		const [milsul, deotsul] = result.stages;

		// 밑술: 쌀 2, 물 = 총쌀10*3 = 30
		expect(milsul.rice).toBe(2);
		expect(milsul.water).toBe(30);

		expect(deotsul.rice).toBe(8);
		expect(deotsul.water).toBe(0);
	});
});

describe('calculateSamyang', () => {
	it('떡 형태로 쌀 10kg 삼양주 계산', () => {
		const result = calculateSamyang(10, 'tteok');

		expect(result.type).toBe('samyang');
		expect(result.stages).toHaveLength(3);

		const [milsul, deotsul1, deotsul2] = result.stages;

		// 밑술: 쌀 15% = 1.5, 물 = 총10*1/2 = 5
		expect(milsul.name).toBe('밑술');
		expect(milsul.rice).toBe(1.5);
		expect(milsul.water).toBe(5);
		expect(milsul.nuruk).toBeCloseTo(1.0);

		// 덧술: 쌀 15% = 1.5, 물 = 5
		expect(deotsul1.name).toBe('덧술');
		expect(deotsul1.rice).toBe(1.5);
		expect(deotsul1.water).toBe(5);
		expect(deotsul1.nuruk).toBe(0);

		// 덧술2: 쌀 70% = 7, 고두밥
		expect(deotsul2.name).toBe('덧술2');
		expect(deotsul2.riceFormLabel).toBe('고두밥');
		expect(deotsul2.rice).toBe(7);
		expect(deotsul2.water).toBe(0);
		expect(deotsul2.nuruk).toBe(0);
	});

	it('죽 형태로 쌀 10kg 삼양주 계산', () => {
		const result = calculateSamyang(10, 'juk');

		const [milsul, deotsul1, deotsul2] = result.stages;

		// 총 물 = 10*5 = 50, 반씩 = 25
		expect(milsul.water).toBe(25);
		expect(deotsul1.water).toBe(25);
		expect(deotsul2.water).toBe(0);
	});
});

describe('총 쌀:물 비율 검증', () => {
	it('이양주 떡: 총 쌀:물 = 1:1', () => {
		const result = calculateIyang(10, 'tteok');
		expect(result.totalRice).toBe(10);
		expect(result.totalWater).toBe(10);
	});

	it('삼양주 떡: 총 쌀:물 = 1:1', () => {
		const result = calculateSamyang(10, 'tteok');
		expect(result.totalRice).toBe(10);
		expect(result.totalWater).toBe(10);
	});

	it('이양주 범벅: 총 쌀:물 = 1:3', () => {
		const result = calculateIyang(10, 'beombuk');
		expect(result.totalRice).toBe(10);
		expect(result.totalWater).toBe(30);
	});
});

describe('custom nuruk ratio', () => {
	it('누룩 비율 15%로 이양주 계산', () => {
		const result = calculateIyang(6, 'tteok', 15);

		const [milsul] = result.stages;
		expect(milsul.nuruk).toBeCloseTo(0.9);
		expect(result.totalNuruk).toBeCloseTo(0.9);
	});

	it('기본값은 10%', () => {
		const withDefault = calculateDanyang(6, 'tteok');
		const withExplicit = calculateDanyang(6, 'tteok', 10);

		expect(withDefault.totalNuruk).toBe(withExplicit.totalNuruk);
	});
});
