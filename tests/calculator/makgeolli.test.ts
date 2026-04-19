import { describe, it, expect } from 'vitest';
import { calculateDanyang, calculateIyang, calculateSamyang } from '$lib/calculator/makgeolli';

describe('총 쌀:물 = 항상 1:1', () => {
	it('단양주 떡 10kg', () => {
		const r = calculateDanyang(10, 'tteok');
		expect(r.totalRice).toBe(10);
		expect(r.totalWater).toBe(10);
	});

	it('이양주 범벅 10kg: 총 1:1', () => {
		const r = calculateIyang(10, 'beombuk');
		expect(r.totalRice).toBe(10);
		expect(r.totalWater).toBe(10);
	});

	it('삼양주 죽 10kg: 총 1:1', () => {
		const r = calculateSamyang(10, 'juk');
		expect(r.totalRice).toBe(10);
		expect(r.totalWater).toBe(10);
	});
});

describe('이양주: 밑술 쌀:물은 형태 비율, 덧술에 부족분 보충', () => {
	it('떡 10kg: 밑술 2/2, 덧술 8/8', () => {
		const [milsul, deotsul] = calculateIyang(10, 'tteok').stages;

		expect(milsul.rice).toBe(2);
		expect(milsul.water).toBe(2);  // 2 * 1

		expect(deotsul.rice).toBe(8);
		expect(deotsul.water).toBe(8);  // 10 - 2
	});

	it('범벅 10kg: 밑술 2/6, 덧술 8/4', () => {
		const [milsul, deotsul] = calculateIyang(10, 'beombuk').stages;

		expect(milsul.rice).toBe(2);
		expect(milsul.water).toBe(6);  // 2 * 3

		expect(deotsul.rice).toBe(8);
		expect(deotsul.water).toBe(4);  // 10 - 6
	});

	it('죽 10kg: 밑술 2/10, 덧술 8/0', () => {
		const [milsul, deotsul] = calculateIyang(10, 'juk').stages;

		expect(milsul.rice).toBe(2);
		expect(milsul.water).toBe(10);  // 2 * 5

		expect(deotsul.rice).toBe(8);
		expect(deotsul.water).toBe(0);  // 10 - 10
	});
});

describe('삼양주: 밑술/덧술 쌀:물은 형태 비율, 덧술2에 부족분 보충', () => {
	it('떡 10kg: 밑술 1.5/1.5, 덧술 1.5/1.5, 덧술2 7/7', () => {
		const [milsul, deotsul1, deotsul2] = calculateSamyang(10, 'tteok').stages;

		expect(milsul.rice).toBe(1.5);
		expect(milsul.water).toBe(1.5);

		expect(deotsul1.rice).toBe(1.5);
		expect(deotsul1.water).toBe(1.5);

		expect(deotsul2.rice).toBe(7);
		expect(deotsul2.water).toBe(7);  // 10 - 1.5 - 1.5
	});

	it('범벅 10kg: 밑술 1.5/4.5, 덧술 1.5/4.5, 덧술2 7/1', () => {
		const [milsul, deotsul1, deotsul2] = calculateSamyang(10, 'beombuk').stages;

		expect(milsul.water).toBe(4.5);  // 1.5 * 3
		expect(deotsul1.water).toBe(4.5);
		expect(deotsul2.water).toBe(1);   // 10 - 4.5 - 4.5
	});
});

describe('누룩: 총 쌀량 기준', () => {
	it('이양주 15%', () => {
		const r = calculateIyang(10, 'tteok', 15);
		expect(r.totalNuruk).toBeCloseTo(1.5);
	});

	it('기본값 10%', () => {
		const a = calculateDanyang(10, 'tteok');
		const b = calculateDanyang(10, 'tteok', 10);
		expect(a.totalNuruk).toBe(b.totalNuruk);
		expect(a.totalNuruk).toBeCloseTo(1.0);
	});
});
