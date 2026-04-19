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
		expect(stage.water).toBe(6);     // 총 쌀 6 * 1 = 6
		expect(stage.nuruk).toBeCloseTo(0.6); // 총 쌀 6의 10%
	});

	it('죽 형태로 쌀 3kg 단양주 계산', () => {
		const result = calculateDanyang(3, 'juk');

		const stage = result.stages[0];
		expect(stage.rice).toBe(3);
		expect(stage.water).toBe(15);    // 총 쌀 3 * 5 = 15
		expect(stage.nuruk).toBeCloseTo(0.3);
	});
});

describe('calculateIyang', () => {
	it('떡 형태로 쌀 6kg 이양주 계산', () => {
		const result = calculateIyang(6, 'tteok');

		expect(result.type).toBe('iyang');
		expect(result.stages).toHaveLength(2);

		const [milsul, deotsul] = result.stages;

		// 밑술: 쌀 1/3 = 2, 물 = 총쌀6*1 = 6 (전량 밑술에), 누룩 = 총쌀의 10%
		expect(milsul.name).toBe('밑술');
		expect(milsul.rice).toBe(2);
		expect(milsul.water).toBe(6);
		expect(milsul.nuruk).toBeCloseTo(0.6);

		// 덧술: 쌀 2/3 = 4, 물 없음, 누룩 없음, 고두밥
		expect(deotsul.name).toBe('덧술');
		expect(deotsul.riceFormLabel).toBe('고두밥');
		expect(deotsul.rice).toBe(4);
		expect(deotsul.water).toBe(0);
		expect(deotsul.nuruk).toBe(0);
	});

	it('범벅 형태로 쌀 3kg 이양주 계산', () => {
		const result = calculateIyang(3, 'beombuk');

		const [milsul, deotsul] = result.stages;

		// 밑술: 쌀 1, 물 = 총쌀3*3 = 9
		expect(milsul.rice).toBe(1);
		expect(milsul.water).toBe(9);
		expect(milsul.nuruk).toBeCloseTo(0.3);

		expect(deotsul.rice).toBe(2);
		expect(deotsul.water).toBe(0);
	});
});

describe('calculateSamyang', () => {
	it('떡 형태로 쌀 6kg 삼양주 계산', () => {
		const result = calculateSamyang(6, 'tteok');

		expect(result.type).toBe('samyang');
		expect(result.stages).toHaveLength(3);

		const [milsul, deotsul1, deotsul2] = result.stages;

		// 총 물 = 6*1 = 6, 밑술/덧술 반씩 = 3
		expect(milsul.name).toBe('밑술');
		expect(milsul.rice).toBe(1);
		expect(milsul.water).toBe(3);
		expect(milsul.nuruk).toBeCloseTo(0.6);

		expect(deotsul1.name).toBe('덧술');
		expect(deotsul1.rice).toBe(1);
		expect(deotsul1.water).toBe(3);
		expect(deotsul1.nuruk).toBe(0);

		expect(deotsul2.name).toBe('덧술2');
		expect(deotsul2.riceFormLabel).toBe('고두밥');
		expect(deotsul2.rice).toBe(4);
		expect(deotsul2.water).toBe(0);
		expect(deotsul2.nuruk).toBe(0);
	});

	it('죽 형태로 쌀 6kg 삼양주 계산', () => {
		const result = calculateSamyang(6, 'juk');

		const [milsul, deotsul1, deotsul2] = result.stages;

		// 총 물 = 6*5 = 30, 반씩 = 15
		expect(milsul.water).toBe(15);
		expect(deotsul1.water).toBe(15);
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
		// 총 쌀 6의 15% = 0.9
		expect(milsul.nuruk).toBeCloseTo(0.9);
		expect(result.totalNuruk).toBeCloseTo(0.9);
	});

	it('기본값은 10%', () => {
		const withDefault = calculateDanyang(6, 'tteok');
		const withExplicit = calculateDanyang(6, 'tteok', 10);

		expect(withDefault.totalNuruk).toBe(withExplicit.totalNuruk);
	});
});
