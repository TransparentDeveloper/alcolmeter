import { describe, expect, it } from 'vitest';
import { MakgeolliController } from './makgeolli-controller';

const controller = new MakgeolliController();

describe('MakgeolliController', () => {
	describe('단계 수', () => {
		it.each([
			{ brewCount: 1 as const },
			{ brewCount: 2 as const },
			{ brewCount: 3 as const }
		])('brewCount=$brewCount이면 $brewCount단계가 생성된다', ({ brewCount }) => {
			const result = controller.calculate({
				totalRiceGrams: 1000,
				riceForm: 'TTEOK',
				waterRatio: 1.0,
				nurukRatio: 0.1,
				brewCount
			});
			expect(result.stages).toHaveLength(brewCount);
		});
	});

	describe('쌀 총량 보존', () => {
		it('모든 단계의 쌀 합은 입력한 쌀 총량과 같다', () => {
			const result = controller.calculate({
				totalRiceGrams: 1000,
				riceForm: 'TTEOK',
				waterRatio: 1.0,
				nurukRatio: 0.1,
				brewCount: 3
			});
			const totalRice = result.stages.reduce((sum, s) => sum + s.riceGrams, 0);
			expect(totalRice).toBe(result.totalRiceGrams);
		});
	});

	describe('누룩 규칙', () => {
		it('누룩은 첫 번째 단계에만 투입된다', () => {
			const result = controller.calculate({
				totalRiceGrams: 1000,
				riceForm: 'TTEOK',
				waterRatio: 1.0,
				nurukRatio: 0.1,
				brewCount: 3
			});
			expect(result.stages[0].nurukGrams).toBeGreaterThan(0);
			result.stages.slice(1).forEach(s => expect(s.nurukGrams).toBe(0));
		});

		it('누룩 총량은 쌀 총량 × nurukRatio다', () => {
			const result = controller.calculate({
				totalRiceGrams: 1000,
				riceForm: 'TTEOK',
				waterRatio: 1.0,
				nurukRatio: 0.15,
				brewCount: 2
			});
			expect(result.totalNurukGrams).toBe(1000 * 0.15);
		});
	});

	describe('물 규칙', () => {
		it('총 물량은 쌀 총량 × waterRatio를 넘지 않는다', () => {
			// JUK(죽)은 쌀:물=1:5로 물 소모가 커서 예산 초과 가능성이 높은 케이스
			const totalRiceGrams = 1000;
			const waterRatio = 0.3;
			const result = controller.calculate({
				totalRiceGrams,
				riceForm: 'JUK',
				waterRatio,
				nurukRatio: 0.1,
				brewCount: 2
			});
			expect(result.totalWaterGrams).toBeLessThanOrEqual(totalRiceGrams * waterRatio);
		});

		it('고두밥·떡은 마지막 단계에 물을 넣지 않는다', () => {
			for (const riceForm of ['GODUBAP', 'TTEOK'] as const) {
				const result = controller.calculate({
					totalRiceGrams: 1000,
					riceForm,
					waterRatio: 1.0,
					nurukRatio: 0.1,
					brewCount: 2
				});
				expect(result.stages.at(-1)!.waterGrams).toBe(0);
			}
		});

		it('범벅·죽은 물 예산이 남으면 마지막 단계에 투입한다', () => {
			for (const riceForm of ['BEOMBUK', 'JUK'] as const) {
				const result = controller.calculate({
					totalRiceGrams: 1000,
					riceForm,
					waterRatio: 2.0,  // 예산 충분히 확보
					nurukRatio: 0.1,
					brewCount: 2
				});
				expect(result.stages.at(-1)!.waterGrams).toBeGreaterThan(0);
			}
		});
	});

	describe('결과 형식', () => {
		it('모든 필드는 원시값이다', () => {
			const result = controller.calculate({
				totalRiceGrams: 1000,
				riceForm: 'GODUBAP',
				waterRatio: 1.0,
				nurukRatio: 0.1,
				brewCount: 2
			});

			expect(typeof result.brewCount).toBe('number');
			expect(typeof result.totalRiceGrams).toBe('number');
			expect(typeof result.totalWaterGrams).toBe('number');
			expect(typeof result.totalNurukGrams).toBe('number');
			for (const stage of result.stages) {
				expect(typeof stage.riceForm).toBe('string');
				expect(typeof stage.riceGrams).toBe('number');
				expect(typeof stage.waterGrams).toBe('number');
				expect(typeof stage.nurukGrams).toBe('number');
			}
		});

		it('단양주(GODUBAP) 쌀 1kg · 물 1L 기준 생산량 1.3L, 도수 약 30.5%다', () => {
			const result = controller.calculate({
				totalRiceGrams: 1000,
				riceForm: 'GODUBAP',
				waterRatio: 1.0,
				nurukRatio: 0.1,
				brewCount: 1
			});
			expect(result.estimates.volumeLiters).toBeCloseTo(1.3, 1);
			expect(result.estimates.alcoholPercent).toBeCloseTo(30.54, 1);
		});

		it('이양주(JUK) 쌀 1kg · 물 2L 기준 생산량 2.3L, 도수 약 17.3%다', () => {
			const result = controller.calculate({
				totalRiceGrams: 1000,
				riceForm: 'JUK',
				waterRatio: 2.0,
				nurukRatio: 0.1,
				brewCount: 2
			});
			expect(result.estimates.volumeLiters).toBeCloseTo(2.3, 1);
			expect(result.estimates.alcoholPercent).toBeCloseTo(17.26, 1);
		});

		it('삼양주(JUK) 쌀 1kg · 물 3L 기준 생산량 3.3L, 도수 약 12.0%다', () => {
			const result = controller.calculate({
				totalRiceGrams: 1000,
				riceForm: 'JUK',
				waterRatio: 3.0,
				nurukRatio: 0.1,
				brewCount: 3
			});
			expect(result.estimates.volumeLiters).toBeCloseTo(3.3, 1);
			expect(result.estimates.alcoholPercent).toBeCloseTo(12.03, 1);
		});
	});
});
