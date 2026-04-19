import { describe, it, expect } from 'vitest';
import { calculateDanyang, calculateIyang, calculateSamyang } from '$lib/calculator/makgeolli';

describe('calculateIyang', () => {
	it('떡 10kg: 밑술 쌀:물=1:1, 덧술에 부족분 물 보충', () => {
		const result = calculateIyang(10, 'tteok');
		const [milsul, deotsul] = result.stages;

		// 밑술: 쌀 2, 물 2 (2*1)
		expect(milsul.rice).toBe(2);
		expect(milsul.water).toBe(2);

		// 덧술: 쌀 8, 물 = 10 - 2 = 8
		expect(deotsul.rice).toBe(8);
		expect(deotsul.water).toBe(8);

		// 총 비율 유지: 10:10 = 1:1
		expect(result.totalWater).toBe(10);
	});

	it('범벅 10kg: 밑술 쌀:물=1:3, 덧술에 부족분 물 보충', () => {
		const result = calculateIyang(10, 'beombuk');
		const [milsul, deotsul] = result.stages;

		// 밑술: 쌀 2, 물 6 (2*3)
		expect(milsul.rice).toBe(2);
		expect(milsul.water).toBe(6);

		// 덧술: 쌀 8, 물 = 30 - 6 = 24
		expect(deotsul.rice).toBe(8);
		expect(deotsul.water).toBe(24);

		// 총 비율 유지: 10:30 = 1:3
		expect(result.totalWater).toBe(30);
	});
});

describe('calculateSamyang', () => {
	it('떡 10kg: 각 단계 쌀:물=1:1, 덧술2에 부족분 물 보충', () => {
		const result = calculateSamyang(10, 'tteok');
		const [milsul, deotsul1, deotsul2] = result.stages;

		// 밑술: 쌀 1.5, 물 1.5
		expect(milsul.rice).toBe(1.5);
		expect(milsul.water).toBe(1.5);

		// 덧술: 쌀 1.5, 물 1.5
		expect(deotsul1.rice).toBe(1.5);
		expect(deotsul1.water).toBe(1.5);

		// 덧술2: 쌀 7, 물 = 10 - 1.5 - 1.5 = 7
		expect(deotsul2.rice).toBe(7);
		expect(deotsul2.water).toBe(7);

		// 총 비율 유지: 10:10 = 1:1
		expect(result.totalWater).toBe(10);
	});

	it('죽 10kg: 각 단계 쌀:물=1:5, 덧술2에 부족분 물 보충', () => {
		const result = calculateSamyang(10, 'juk');
		const [milsul, deotsul1, deotsul2] = result.stages;

		// 밑술: 물 7.5 (1.5*5)
		expect(milsul.water).toBe(7.5);
		// 덧술: 물 7.5 (1.5*5)
		expect(deotsul1.water).toBe(7.5);
		// 덧술2: 물 = 50 - 7.5 - 7.5 = 35
		expect(deotsul2.water).toBe(35);

		// 총 비율 유지: 10:50 = 1:5
		expect(result.totalWater).toBe(50);
	});
});

describe('총 쌀:물 비율 검증', () => {
	it('이양주 떡: 총 1:1', () => {
		const r = calculateIyang(10, 'tteok');
		expect(r.totalWater / r.totalRice).toBe(1);
	});

	it('이양주 범벅: 총 1:3', () => {
		const r = calculateIyang(10, 'beombuk');
		expect(r.totalWater / r.totalRice).toBe(3);
	});

	it('삼양주 죽: 총 1:5', () => {
		const r = calculateSamyang(10, 'juk');
		expect(r.totalWater / r.totalRice).toBe(5);
	});
});

describe('단계별 쌀:물 비율 검증 (최종 덧술 제외)', () => {
	it('이양주 범벅: 밑술 1:3', () => {
		const [milsul] = calculateIyang(10, 'beombuk').stages;
		expect(milsul.water / milsul.rice).toBe(3);
	});

	it('삼양주 범벅: 밑술/덧술 각각 1:3', () => {
		const [milsul, deotsul1] = calculateSamyang(10, 'beombuk').stages;
		expect(milsul.water / milsul.rice).toBe(3);
		expect(deotsul1.water / deotsul1.rice).toBe(3);
	});
});

describe('누룩', () => {
	it('총 쌀량 기준 비율', () => {
		const r = calculateIyang(10, 'tteok', 15);
		expect(r.totalNuruk).toBeCloseTo(1.5); // 10 * 15%
	});

	it('기본값 10%', () => {
		const a = calculateDanyang(6, 'tteok');
		const b = calculateDanyang(6, 'tteok', 10);
		expect(a.totalNuruk).toBe(b.totalNuruk);
	});
});
