import { describe, expect, it } from 'vitest';
import { BrewRecipe } from '../../src/brewing/aggregates/brew-recipe';
import { BrewStage } from '../../src/brewing/value-objects/brew-stage';
import { BrewingStyle } from '../../src/brewing/value-objects/brewing-style';
import { Mass } from '../../src/brewing/value-objects/mass';
import { Ratio } from '../../src/brewing/value-objects/ratio';
import { RiceForm } from '../../src/brewing/value-objects/rice-form';

const makeStage = (name: string, riceForm: RiceForm, rice: number, water: number, nuruk: number) =>
	new BrewStage(name, riceForm, Mass.of(rice), Mass.of(water), Mass.of(nuruk));

describe('BrewRecipe', () => {
	it('정상 생성 시 totals를 계산', () => {
		const recipe = BrewRecipe.create({
			id: 'r-1',
			style: BrewingStyle.iyang(),
			totalRice: Mass.of(1000),
			riceForm: RiceForm.tteok(),
			waterRatio: Ratio.ofFraction(1),
			nurukRatio: Ratio.ofFraction(0.1),
			stages: [
				makeStage('밑술', RiceForm.tteok(), 200, 200, 100),
				makeStage('덧술', RiceForm.godubap(), 800, 0, 0)
			]
		});

		expect(recipe.totals.rice.equals(Mass.of(1000))).toBe(true);
		expect(recipe.totals.water.equals(Mass.of(200))).toBe(true);
		expect(recipe.totals.nuruk.equals(Mass.of(100))).toBe(true);
	});

	it('단계 수가 style.stageCount와 다르면 에러', () => {
		expect(() =>
			BrewRecipe.create({
				id: 'r-1',
				style: BrewingStyle.iyang(),
				totalRice: Mass.of(1000),
				riceForm: RiceForm.tteok(),
				waterRatio: Ratio.ofFraction(1),
				nurukRatio: Ratio.ofFraction(0.1),
				stages: [makeStage('밑술', RiceForm.tteok(), 1000, 1000, 100)]
			})
		).toThrow(/stage count/i);
	});

	it('단계 쌀 합 ≠ totalRice이면 에러', () => {
		expect(() =>
			BrewRecipe.create({
				id: 'r-1',
				style: BrewingStyle.iyang(),
				totalRice: Mass.of(1000),
				riceForm: RiceForm.tteok(),
				waterRatio: Ratio.ofFraction(1),
				nurukRatio: Ratio.ofFraction(0.1),
				stages: [
					makeStage('밑술', RiceForm.tteok(), 200, 200, 100),
					makeStage('덧술', RiceForm.godubap(), 700, 0, 0)
				]
			})
		).toThrow(/total rice/i);
	});

	it('id가 같으면 equals true', () => {
		const a = BrewRecipe.create({
			id: 'r-1',
			style: BrewingStyle.danyang(),
			totalRice: Mass.of(1000),
			riceForm: RiceForm.tteok(),
			waterRatio: Ratio.ofFraction(1),
			nurukRatio: Ratio.ofFraction(0.1),
			stages: [makeStage('전량 투입', RiceForm.tteok(), 1000, 1000, 100)]
		});
		const b = BrewRecipe.create({
			id: 'r-1',
			style: BrewingStyle.iyang(),
			totalRice: Mass.of(2000),
			riceForm: RiceForm.juk(),
			waterRatio: Ratio.ofFraction(0.5),
			nurukRatio: Ratio.ofFraction(0.05),
			stages: [
				makeStage('밑술', RiceForm.juk(), 1000, 5000, 100),
				makeStage('덧술', RiceForm.godubap(), 1000, 0, 0)
			]
		});
		expect(a.equals(b)).toBe(true);
	});
});
