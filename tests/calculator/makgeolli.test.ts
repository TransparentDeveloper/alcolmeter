import { describe, it, expect } from 'vitest';
import { calculateDanyang, calculateIyang, calculateSamyang } from '$lib/calculator/makgeolli';

describe('가용쌀 전량 사용, 비율 조정', () => {
	it('삼양주 죽 100kg, 100%: 전량 사용, 밑술/덧술 축소, 나머지 덧술2', () => {
		const r = calculateSamyang(100, 'juk', 1);
		const [milsul, deotsul1, deotsul2] = r.stages;

		// 전량 사용
		expect(r.totalRice).toBeCloseTo(100);
		// 총 물 = 100 (1:1 유지)
		expect(r.totalWater).toBeCloseTo(100);

		// 밑술/덧술: 각 10kg, 물 50L (1:5 유지)
		expect(milsul.rice).toBeCloseTo(10);
		expect(milsul.water).toBeCloseTo(50);
		expect(deotsul1.rice).toBeCloseTo(10);
		expect(deotsul1.water).toBeCloseTo(50);

		// 덧술2: 나머지 80kg, 물 0
		expect(deotsul2.rice).toBeCloseTo(80);
		expect(deotsul2.water).toBeCloseTo(0);
	});

	it('이양주 죽 100kg, 100%: 밑술 20kg/100L, 덧술 80kg/0L', () => {
		const r = calculateIyang(100, 'juk', 1);
		const [milsul, deotsul] = r.stages;

		expect(r.totalRice).toBeCloseTo(100);
		expect(r.totalWater).toBeCloseTo(100);
		expect(milsul.rice).toBeCloseTo(20);
		expect(milsul.water).toBeCloseTo(100);
		expect(deotsul.rice).toBeCloseTo(80);
		expect(deotsul.water).toBeCloseTo(0);
	});
});

describe('예산 내: 기본 비율 유지 + 덧술에 남은 물', () => {
	it('이양주 범벅 100kg, 100%: 밑술 20kg/60L, 덧술 80kg/40L', () => {
		const r = calculateIyang(100, 'beombuk', 1);
		const [milsul, deotsul] = r.stages;

		expect(milsul.rice).toBeCloseTo(20);
		expect(milsul.water).toBeCloseTo(60);
		expect(deotsul.rice).toBeCloseTo(80);
		expect(deotsul.water).toBeCloseTo(40);
		expect(r.totalWater).toBeCloseTo(100);
	});
});

describe('떡: 최종 덧술 가수 없음', () => {
	it('이양주 떡 100kg: 밑술 20kg/20L, 덧술 80kg/0', () => {
		const r = calculateIyang(100, 'tteok', 1);
		expect(r.totalRice).toBeCloseTo(100);
		expect(r.totalWater).toBeCloseTo(20);
	});
});

describe('형태 비율 정확히 유지', () => {
	it('삼양주 범벅: 밑술/덧술 1:3', () => {
		const [milsul, deotsul1] = calculateSamyang(100, 'beombuk', 1).stages;
		expect(milsul.water / milsul.rice).toBeCloseTo(3);
		expect(deotsul1.water / deotsul1.rice).toBeCloseTo(3);
	});

	it('삼양주 죽 축소 후에도 1:5 유지', () => {
		const [milsul, deotsul1] = calculateSamyang(100, 'juk', 1).stages;
		expect(milsul.water / milsul.rice).toBeCloseTo(5);
		expect(deotsul1.water / deotsul1.rice).toBeCloseTo(5);
	});
});

describe('누룩: 가용쌀 전량 기준', () => {
	it('100kg, 10%: 누룩 10kg', () => {
		expect(calculateSamyang(100, 'juk', 1, 10).totalNuruk).toBeCloseTo(10);
	});
});
