import type { MakgeolliRequest } from '../types';

import { describe, expect, it } from 'vitest';
import { MakgeolliService } from '.';

const service = new MakgeolliService();

function request(riceKg: number, waterRatio: number, stageCount: number): MakgeolliRequest {
	return {
		totalRice: { kind: 'RICE', amount: riceKg, unit: 'kg' },
		riceForm: 'JUK',
		waterRatio,
		nurukRatio: 0.1,
		stageCount
	};
}

describe('MakgeolliService', () => {
	it('막걸리 배합으로 도수·생산량·최적급수율·단계별 분배를 낸다', () => {
		const result = service.brew(request(1, 1.0, 3));
		expect(result.abvPercent).toBeGreaterThan(0);
		expect(result.volumeLiters).toBeGreaterThan(0);
		expect(result.optimalWaterRatio).toBeGreaterThan(0);
		expect(result.stages).toHaveLength(3);
	});

	it('단계마다 쌀 형태가 실린다 (마지막 덧술은 고두밥)', () => {
		const stages = service.brew(request(1, 1.0, 3)).stages;
		expect(stages[0]!.riceForm).toBe('JUK');
		expect(stages[2]!.riceForm).toBe('GODUBAP');
		expect(stages[0]!.ingredients.some((i) => i.kind === 'RICE')).toBe(true);
	});

	it('같은 양이면 단위(kg/g)가 달라도 결과가 같다', () => {
		const inKg = service.brew(request(1, 1.0, 2));
		const inGrams = service.brew({
			...request(1, 1.0, 2),
			totalRice: { kind: 'RICE', amount: 1000, unit: 'g' }
		});
		expect(inGrams.abvPercent).toBeCloseTo(inKg.abvPercent, 5);
		expect(inGrams.volumeLiters).toBeCloseTo(inKg.volumeLiters, 5);
	});
});
