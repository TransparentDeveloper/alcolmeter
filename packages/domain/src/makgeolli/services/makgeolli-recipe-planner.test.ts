import { describe, expect, it } from 'vitest';
import { MakgeolliRecipePlanner } from './makgeolli-recipe-planner';
import { type MakgeolliRecipe, type MakgeolliRecipeId } from '../aggregates/makgeolli-recipe';
import { MakgeolliStyle } from '../value-objects/makgeolli-style';
import { Mass } from '../value-objects/mass';
import { RiceForm } from '../value-objects/rice-form';

const planner = new MakgeolliRecipePlanner();

function plan(
	totalRiceGrams: number,
	riceFormCode: 'GODUBAP' | 'TTEOK' | 'BEOMBUK' | 'JUK',
	waterRatio: number,
	nurukRatio: number,
	brewCount: 1 | 2 | 3
): MakgeolliRecipe {
	const id = crypto.randomUUID() as MakgeolliRecipeId;
	return planner.plan(id, {
		totalRice: Mass.ofGrams(totalRiceGrams),
		riceForm: RiceForm.of(riceFormCode),
		waterRatio,
		nurukRatio,
		style: MakgeolliStyle.of(brewCount)
	});
}

describe('MakgeolliRecipePlanner', () => {
	describe('누룩 규칙', () => {
		it('누룩은 첫 번째 단계에만 투입된다', () => {
			const recipe = plan(1000, 'TTEOK', 1.0, 0.1, 3);
			expect(recipe.stages[0]!.nuruk.grams).toBeGreaterThan(0);
			recipe.stages.slice(1).forEach(s => expect(s.nuruk.grams).toBe(0));
		});

		it('누룩 총량은 쌀 총량에 비례한다', () => {
			const recipe = plan(1000, 'TTEOK', 1.0, 0.15, 2);
			expect(recipe.totals.nuruk.grams).toBeCloseTo(1000 * 0.15, 5);
		});
	});

	describe('물 규칙', () => {
		it('총 물량은 입력한 물 예산을 넘지 않는다', () => {
			const totalRiceGrams = 1000;
			const waterRatio = 0.3;
			const recipe = plan(totalRiceGrams, 'JUK', waterRatio, 0.1, 2);
			expect(recipe.totals.water.grams).toBeLessThanOrEqual(totalRiceGrams * waterRatio);
		});

		it('고두밥·떡은 마지막 단계에 물을 넣지 않는다', () => {
			for (const riceForm of ['GODUBAP', 'TTEOK'] as const) {
				const recipe = plan(1000, riceForm, 1.0, 0.1, 2);
				expect(recipe.stages.at(-1)!.water.grams).toBe(0);
			}
		});

		it('범벅·죽은 물 예산이 남으면 마지막 단계에 투입한다', () => {
			for (const riceForm of ['BEOMBUK', 'JUK'] as const) {
				const recipe = plan(1000, riceForm, 2.0, 0.1, 2);
				expect(recipe.stages.at(-1)!.water.grams).toBeGreaterThan(0);
			}
		});
	});
});
