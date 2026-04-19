import { describe, it, expect } from 'vitest';
import { calculateDanyang, calculateIyang, calculateSamyang } from '$lib/calculator/makgeolli';

describe('삼양주 죽 100kg, 100%: 밑술/덧술 축소, 남은 쌀 덧술2에 투입', () => {
	it('가용쌀 전량 사용, 총 1:1', () => {
		const r = calculateSamyang(100, 'juk', 1);
		const [milsul, deotsul1, deotsul2] = r.stages;

		// 물 예산 = 100. 밑술/덧술 각 10kg (100/(2*5))
		expect(milsul.rice).toBeCloseTo(10);
		expect(milsul.water).toBeCloseTo(50); // 10*5
		expect(deotsul1.rice).toBeCloseTo(10);
		expect(deotsul1.water).toBeCloseTo(50); // 10*5

		// 남은 쌀 80kg → 덧술2, 물 0 (예산 소진)
		expect(deotsul2.rice).toBeCloseTo(80);
		expect(deotsul2.water).toBeCloseTo(0);

		// 전량 사용, 1:1
		expect(r.totalRice).toBeCloseTo(100);
		expect(r.totalWater).toBeCloseTo(100);
	});
});

describe('충돌 없을 때: 기본 비율 유지, 남은 물 덧술에', () => {
	it('이양주 범벅 100kg, 100%', () => {
		const r = calculateIyang(100, 'beombuk', 1);
		const [milsul, deotsul] = r.stages;

		// 기본 20%: 20kg, 물 60L (20*3) ≤ 100 → OK
		expect(milsul.rice).toBeCloseTo(20);
		expect(milsul.water).toBeCloseTo(60);

		// 남은 쌀 80kg, 남은 물 40L
		expect(deotsul.rice).toBeCloseTo(80);
		expect(deotsul.water).toBeCloseTo(40);

		expect(r.totalRice).toBeCloseTo(100);
		expect(r.totalWater).toBeCloseTo(100);
	});
});

describe('떡: 전량 사용, 최종 덧술 가수 없음', () => {
	it('이양주 떡 100kg', () => {
		const r = calculateIyang(100, 'tteok', 1);
		expect(r.totalRice).toBeCloseTo(100);
		expect(r.totalWater).toBeCloseTo(20); // 밑술 물만
	});
});

describe('형태 비율 정확히 유지', () => {
	it('삼양주 죽: 1:5', () => {
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
