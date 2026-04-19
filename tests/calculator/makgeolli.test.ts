import { describe, it, expect } from 'vitest';
import { calculateDanyang, calculateIyang, calculateSamyang } from '$lib/calculator/makgeolli';

describe('예산 내: 가용쌀 전량 사용', () => {
	it('이양주 범벅 100kg, 100%: 전량 사용', () => {
		const r = calculateIyang(100, 'beombuk', 1);
		expect(r.totalRice).toBeCloseTo(100);
		expect(r.totalWater).toBeCloseTo(100);
	});

	it('이양주 떡 100kg: 전량 사용, 덧술 가수 없음', () => {
		const r = calculateIyang(100, 'tteok', 1);
		expect(r.totalRice).toBeCloseTo(100);
		expect(r.totalWater).toBeCloseTo(20); // 밑술 물만
	});
});

describe('예산 초과: 쌀 축소하여 최대 생산량', () => {
	it('삼양주 죽 100kg, 100%: 쌀 66.67kg 사용', () => {
		const r = calculateSamyang(100, 'juk', 1);
		// preFinalFraction = 0.3 * 5 = 1.5 > waterRatio 1
		// actualRice = 100 / 1.5 = 66.67
		expect(r.totalRice).toBeCloseTo(66.67, 1);

		const [milsul, deotsul1] = r.stages;
		// 형태 비율 정확히 유지
		expect(milsul.water / milsul.rice).toBeCloseTo(5);
		expect(deotsul1.water / deotsul1.rice).toBeCloseTo(5);
	});

	it('삼양주 죽 100kg, 200%: 쌀 전량 사용 가능', () => {
		const r = calculateSamyang(100, 'juk', 2);
		// preFinalFraction = 1.5 ≤ waterRatio 2
		expect(r.totalRice).toBeCloseTo(100);
	});
});

describe('형태 비율 정확히 유지', () => {
	it('이양주 범벅: 밑술 1:3', () => {
		const [milsul] = calculateIyang(10, 'beombuk', 1).stages;
		expect(milsul.water / milsul.rice).toBeCloseTo(3);
	});

	it('삼양주 범벅: 밑술/덧술 각 1:3', () => {
		const [milsul, deotsul1] = calculateSamyang(10, 'beombuk', 1).stages;
		expect(milsul.water / milsul.rice).toBeCloseTo(3);
		expect(deotsul1.water / deotsul1.rice).toBeCloseTo(3);
	});
});

describe('누룩: 실제 사용 쌀 기준', () => {
	it('축소된 경우 실제쌀 기준 계산', () => {
		const r = calculateSamyang(100, 'juk', 1, 10);
		// actualRice ≈ 66.67, nuruk = 66.67 * 10% ≈ 6.67
		expect(r.totalNuruk).toBeCloseTo(6.67, 1);
	});
});
