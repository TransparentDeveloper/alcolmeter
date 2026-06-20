import type { FermentationRequest } from '../types';

import { describe, expect, it } from 'vitest';
import { FermentationService } from '.';

const service = new FermentationService();

function request(riceGrams: number, waterGrams: number, stageCount: number): FermentationRequest {
	return {
		ingredients: [
			{ kind: 'RICE', amount: riceGrams, unit: 'g' },
			{ kind: 'WATER', amount: waterGrams, unit: 'g' },
			{ kind: 'NURUK', amount: 100, unit: 'g' }
		],
		stageCount
	};
}

describe('FermentationService', () => {
	it('재료 총량과 발효횟수로 도수·생산량·단계별 분배를 낸다', () => {
		const result = service.simulate(request(1000, 2000, 3));
		expect(result.abvPercent).toBeGreaterThan(0);
		expect(result.volumeLiters).toBeGreaterThan(0);
		expect(result.stages).toHaveLength(3);
	});

	it('같은 양이면 단위(kg/g)가 달라도 결과가 같다', () => {
		const inGrams = service.simulate(request(1000, 2000, 2));
		const inKg = service.simulate({
			ingredients: [
				{ kind: 'RICE', amount: 1, unit: 'kg' },
				{ kind: 'WATER', amount: 2, unit: 'L' },
				{ kind: 'NURUK', amount: 100, unit: 'g' }
			],
			stageCount: 2
		});
		expect(inKg.abvPercent).toBeCloseTo(inGrams.abvPercent, 5);
		expect(inKg.volumeLiters).toBeCloseTo(inGrams.volumeLiters, 5);
	});
});
