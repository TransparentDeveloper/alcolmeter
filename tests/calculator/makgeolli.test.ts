import { describe, it, expect } from 'vitest';
import { calculateDanyang, calculateIyang, calculateSamyang } from '$lib/calculator/makgeolli';

describe('이양주', () => {
	it('떡 10kg: 밑술 가수만, 덧술 가수 없음 (극단적 단맛)', () => {
		const [milsul, deotsul] = calculateIyang(10, 'tteok').stages;

		expect(milsul.rice).toBe(2);
		expect(milsul.water).toBe(2);  // 2 * 1

		expect(deotsul.rice).toBe(8);
		expect(deotsul.water).toBe(0);  // 떡: 가수 없음
	});

	it('범벅 10kg: 밑술 1:3, 덧술에 부족분 보충하여 총 1:1', () => {
		const r = calculateIyang(10, 'beombuk');
		const [milsul, deotsul] = r.stages;

		expect(milsul.rice).toBe(2);
		expect(milsul.water).toBe(6);  // 2 * 3

		expect(deotsul.rice).toBe(8);
		expect(deotsul.water).toBe(4);  // 10 - 6

		expect(r.totalWater).toBe(10); // 총 1:1
	});

	it('죽 10kg: 밑술 1:5, 밑술에서 총 물 소진', () => {
		const [milsul, deotsul] = calculateIyang(10, 'juk').stages;

		expect(milsul.water).toBe(10);  // 2 * 5
		expect(deotsul.water).toBe(0);   // 10 - 10
	});
});

describe('삼양주', () => {
	it('떡 10kg: 밑술/덧술 가수, 덧술2 가수 없음', () => {
		const [milsul, deotsul1, deotsul2] = calculateSamyang(10, 'tteok').stages;

		expect(milsul.rice).toBe(1.5);
		expect(milsul.water).toBe(1.5);

		expect(deotsul1.rice).toBe(1.5);
		expect(deotsul1.water).toBe(1.5);

		expect(deotsul2.rice).toBe(7);
		expect(deotsul2.water).toBe(0);  // 떡: 가수 없음
	});

	it('범벅 10kg: 밑술/덧술 1:3, 덧술2에 부족분 보충하여 총 1:1', () => {
		const r = calculateSamyang(10, 'beombuk');
		const [milsul, deotsul1, deotsul2] = r.stages;

		expect(milsul.water).toBe(4.5);   // 1.5 * 3
		expect(deotsul1.water).toBe(4.5);
		expect(deotsul2.water).toBe(1);    // 10 - 4.5 - 4.5

		expect(r.totalWater).toBe(10); // 총 1:1
	});
});

describe('총 비율 검증', () => {
	it('범벅/죽: 총 쌀:물 = 1:1', () => {
		expect(calculateIyang(10, 'beombuk').totalWater).toBe(10);
		expect(calculateSamyang(10, 'beombuk').totalWater).toBe(10);
		expect(calculateSamyang(10, 'juk').totalWater).toBe(10);
	});

	it('떡: 총 비율 깨짐 (의도적)', () => {
		// 떡은 고두밥 가수 없으므로 총 물 < 총 쌀
		const r = calculateIyang(10, 'tteok');
		expect(r.totalWater).toBe(2); // 밑술 물만
	});
});

describe('누룩', () => {
	it('총 쌀량 기준 비율', () => {
		expect(calculateIyang(10, 'tteok', 15).totalNuruk).toBeCloseTo(1.5);
	});

	it('기본값 10%', () => {
		expect(calculateDanyang(10, 'tteok').totalNuruk).toBeCloseTo(1.0);
	});
});
