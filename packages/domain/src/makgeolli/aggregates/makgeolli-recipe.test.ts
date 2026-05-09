import { describe, expect, it } from 'vitest';
import { MakgeolliRecipe, type MakgeolliRecipeId } from './makgeolli-recipe';
import { MakgeolliStage } from '../value-objects/makgeolli-stage';
import { MakgeolliStyle } from '../value-objects/makgeolli-style';
import { Mass } from '../value-objects/mass';
import { RiceForm } from '../value-objects/rice-form';

const makeStage = (code: Parameters<typeof RiceForm.of>[0], rice: number, water: number, nuruk: number) =>
	MakgeolliStage.of(RiceForm.of(code), Mass.ofGrams(rice), Mass.ofGrams(water), Mass.ofGrams(nuruk));

describe('MakgeolliRecipe', () => {
	it('레시피 완성 시 단계별 쌀·물·누룩 총합을 집계한다', () => {
		const recipe = MakgeolliRecipe.create({
			id: 'r-1' as MakgeolliRecipeId,
			style: MakgeolliStyle.of(2),
			totalRice: Mass.ofGrams(1000),
			stages: [
				makeStage('TTEOK', 200, 200, 100),
				makeStage('GODUBAP', 800, 0, 0)
			]
		});

		expect(recipe.totals.rice.equals(Mass.ofGrams(1000))).toBe(true);
		expect(recipe.totals.water.equals(Mass.ofGrams(200))).toBe(true);
		expect(recipe.totals.nuruk.equals(Mass.ofGrams(100))).toBe(true);
	});

	it('양조 방식과 단계 수가 맞지 않으면 레시피를 만들 수 없다', () => {
		expect(() =>
			MakgeolliRecipe.create({
				id: 'r-1' as MakgeolliRecipeId,
				style: MakgeolliStyle.of(2),
				totalRice: Mass.ofGrams(1000),
				stages: [makeStage('TTEOK', 1000, 1000, 100)]
			})
		).toThrow(/stage count/i);
	});

	it('단계별 쌀량 합이 총 쌀량과 다르면 레시피를 만들 수 없다', () => {
		expect(() =>
			MakgeolliRecipe.create({
				id: 'r-1' as MakgeolliRecipeId,
				style: MakgeolliStyle.of(2),
				totalRice: Mass.ofGrams(1000),
				stages: [
					makeStage('TTEOK', 200, 200, 100),
					makeStage('GODUBAP', 700, 0, 0)
				]
			})
		).toThrow(/total rice/i);
	});

	it('동일한 레시피는 내용이 달라도 id로 식별한다', () => {
		const a = MakgeolliRecipe.create({
			id: 'r-1' as MakgeolliRecipeId,
			style: MakgeolliStyle.of(1),
			totalRice: Mass.ofGrams(1000),
			stages: [makeStage('TTEOK', 1000, 1000, 100)]
		});
		const b = MakgeolliRecipe.create({
			id: 'r-1' as MakgeolliRecipeId,
			style: MakgeolliStyle.of(2),
			totalRice: Mass.ofGrams(2000),
			stages: [
				makeStage('JUK', 1000, 5000, 100),
				makeStage('GODUBAP', 1000, 0, 0)
			]
		});
		expect(a.equals(b)).toBe(true);
	});
});
