import { describe, it, expect } from 'vitest';
import { calculateDanyang, calculateIyang, calculateSamyang } from '$lib/calculator/makgeolli';
import type { RiceForm } from '$lib/types';

describe('calculateDanyang', () => {
	it('떡 형태로 쌀 6ℓ 단양주 계산', () => {
		const result = calculateDanyang(6, 'tteok');

		expect(result.type).toBe('danyang');
		expect(result.stages).toHaveLength(1);

		const stage = result.stages[0];
		expect(stage.name).toBe('전량 투입');
		expect(stage.riceFormLabel).toBe('떡 (설기)');
		expect(stage.rice).toBe(6);
		expect(stage.water).toBe(6);     // 떡 1:1, 쌀 6 * 1 = 6
		expect(stage.nuruk).toBeCloseTo(0.6); // 쌀 6의 10% = 0.6
	});

	it('죽 형태로 쌀 3ℓ 단양주 계산', () => {
		const result = calculateDanyang(3, 'juk');

		const stage = result.stages[0];
		expect(stage.rice).toBe(3);
		expect(stage.water).toBe(15);    // 죽 1:5, 쌀 3 * 5 = 15
		expect(stage.nuruk).toBeCloseTo(0.3);
	});
});

describe('calculateIyang', () => {
	it('떡 형태로 쌀 6ℓ 이양주 계산', () => {
		const result = calculateIyang(6, 'tteok');

		expect(result.type).toBe('iyang');
		expect(result.stages).toHaveLength(2);

		const [milsul, deotsul] = result.stages;

		// 밑술: 쌀 1/3 = 2, 물 = 2*1 = 2, 누룩 전량
		expect(milsul.name).toBe('밑술');
		expect(milsul.rice).toBe(2);
		expect(milsul.water).toBe(2);
		expect(milsul.nuruk).toBeCloseTo(0.2); // 밑술 쌀 2의 10%

		// 덧술: 쌀 2/3 = 4, 물 없음, 누룩 없음, 고두밥
		expect(deotsul.name).toBe('덧술');
		expect(deotsul.riceFormLabel).toBe('고두밥');
		expect(deotsul.rice).toBe(4);
		expect(deotsul.water).toBe(0);
		expect(deotsul.nuruk).toBe(0);
	});

	it('범벅 형태로 쌀 3ℓ 이양주 계산', () => {
		const result = calculateIyang(3, 'beombuk');

		const [milsul, deotsul] = result.stages;

		// 밑술: 쌀 1/3 = 1, 물 = 1*3 = 3
		expect(milsul.rice).toBe(1);
		expect(milsul.water).toBe(3);
		expect(milsul.nuruk).toBeCloseTo(0.1);

		// 덧술: 쌀 2/3 = 2, 물 없음
		expect(deotsul.rice).toBe(2);
		expect(deotsul.water).toBe(0);
	});
});

describe('calculateSamyang', () => {
	it('떡 형태로 쌀 6ℓ 삼양주 계산', () => {
		const result = calculateSamyang(6, 'tteok');

		expect(result.type).toBe('samyang');
		expect(result.stages).toHaveLength(3);

		const [milsul, deotsul1, deotsul2] = result.stages;

		// 밑술: 쌀 1/6 = 1, 물 = 1*1 = 1, 누룩 전량
		expect(milsul.name).toBe('밑술');
		expect(milsul.rice).toBe(1);
		expect(milsul.water).toBe(1);
		expect(milsul.nuruk).toBeCloseTo(0.1); // 밑술 쌀 1의 10%

		// 덧술: 쌀 1/6 = 1, 물 = 1*1 = 1 (밑술과 동일 형태), 누룩 없음
		expect(deotsul1.name).toBe('덧술');
		expect(deotsul1.rice).toBe(1);
		expect(deotsul1.water).toBe(1);
		expect(deotsul1.nuruk).toBe(0);

		// 덧술2: 쌀 4/6 = 4, 물 없음, 누룩 없음, 고두밥 (최종 덧술)
		expect(deotsul2.name).toBe('덧술2');
		expect(deotsul2.riceFormLabel).toBe('고두밥');
		expect(deotsul2.rice).toBe(4);
		expect(deotsul2.water).toBe(0);
		expect(deotsul2.nuruk).toBe(0);
	});

	it('죽 형태로 쌀 6ℓ 삼양주 계산', () => {
		const result = calculateSamyang(6, 'juk');

		const [milsul, deotsul1, deotsul2] = result.stages;

		// 밑술: 쌀 1, 물 = 1*5 = 5
		expect(milsul.water).toBe(5);
		// 덧술: 쌀 1, 물 = 1*5 = 5 (동일 형태)
		expect(deotsul1.water).toBe(5);
		// 덧술2: 물 없음
		expect(deotsul2.water).toBe(0);
	});
});

describe('totals', () => {
	it('이양주 총합이 정확함', () => {
		const result = calculateIyang(6, 'tteok');

		expect(result.totalRice).toBe(6);
		expect(result.totalWater).toBe(2); // 밑술 물만
		expect(result.totalNuruk).toBeCloseTo(0.2);
	});

	it('삼양주 총합이 정확함', () => {
		const result = calculateSamyang(6, 'tteok');

		expect(result.totalRice).toBe(6);
		expect(result.totalWater).toBe(2); // 밑술 1 + 덧술 1
		expect(result.totalNuruk).toBeCloseTo(0.1);
	});
});

describe('custom nuruk ratio', () => {
	it('누룩 비율 15%로 이양주 계산', () => {
		const result = calculateIyang(6, 'tteok', 15);

		const [milsul] = result.stages;
		// 밑술 쌀 2의 15% = 0.3
		expect(milsul.nuruk).toBeCloseTo(0.3);
		expect(result.totalNuruk).toBeCloseTo(0.3);
	});

	it('기본값은 10%', () => {
		const withDefault = calculateDanyang(6, 'tteok');
		const withExplicit = calculateDanyang(6, 'tteok', 10);

		expect(withDefault.totalNuruk).toBe(withExplicit.totalNuruk);
	});
});
