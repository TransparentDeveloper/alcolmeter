import { describe, it, expect } from 'vitest';
import { calculateDanyang, calculateIyang, calculateSamyang } from '$lib/calculator/makgeolli';

describe('총 물 = 가용쌀 × waterRatio (항상 일치)', () => {
	it('이양주 범벅 100kg, 100%: 총 물 100', () => {
		const r = calculateIyang(100, 'beombuk', 1);
		expect(r.totalWater).toBeCloseTo(100);
	});

	it('삼양주 죽 100kg, 100%: 총 물 100 (비례 축소)', () => {
		const r = calculateSamyang(100, 'juk', 1);
		// 이상적: 밑술 75 + 덧술 75 = 150 > 100 → 비례 축소
		expect(r.totalWater).toBeCloseTo(100);
	});

	it('이양주 떡 100kg, 100%: 떡은 최종 가수 없음', () => {
		const r = calculateIyang(100, 'tteok', 1);
		// 밑술 물만: 20 * 1 = 20, 덧술 가수 없음
		expect(r.totalWater).toBeCloseTo(20);
	});
});

describe('밑술 형태 비율 유지 (예산 내)', () => {
	it('이양주 범벅 10kg: 밑술 쌀:물 = 1:3', () => {
		const [milsul] = calculateIyang(10, 'beombuk', 1).stages;
		expect(milsul.rice).toBe(2);
		expect(milsul.water).toBe(6); // 2 * 3
	});
});

describe('예산 초과 시 비례 축소', () => {
	it('삼양주 죽 10kg, 100%: 밑술/덧술 물 비례 축소', () => {
		const r = calculateSamyang(10, 'juk', 1);
		const [milsul, deotsul1, deotsul2] = r.stages;

		// 이상적: 1.5*5=7.5 + 1.5*5=7.5 = 15 > 10
		// 축소 비율: 10/15 = 2/3
		expect(milsul.water).toBeCloseTo(5);
		expect(deotsul1.water).toBeCloseTo(5);
		expect(deotsul2.water).toBeCloseTo(0); // 남은 물 없음
		expect(r.totalWater).toBeCloseTo(10);
	});
});

describe('누룩: 가용쌀 기준', () => {
	it('이양주 15%', () => {
		expect(calculateIyang(10, 'tteok', 1, 15).totalNuruk).toBeCloseTo(1.5);
	});

	it('기본값 10%', () => {
		expect(calculateDanyang(10, 'tteok').totalNuruk).toBeCloseTo(1.0);
	});
});
