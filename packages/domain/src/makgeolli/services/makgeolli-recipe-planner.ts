import { MakgeolliRecipe, type MakgeolliRecipeId } from '../aggregates/makgeolli-recipe';
import { MakgeolliStage } from '../value-objects/makgeolli-stage';
import { type MakgeolliStyle } from '../value-objects/makgeolli-style';
import { Mass } from '../value-objects/mass';
import { RiceForm } from '../value-objects/rice-form';

const DOUBLE_BREW_MILSUL_FRACTION = 0.2;
const TRIPLE_BREW_MILSUL_FRACTION = 0.15;

export interface MakgeolliInput {
	totalRice: Mass;
	riceForm: RiceForm;
	waterRatio: number;
	nurukRatio: number;
	style: MakgeolliStyle;
}

export class MakgeolliRecipePlanner {
	plan(id: MakgeolliRecipeId, input: MakgeolliInput): MakgeolliRecipe {
		switch (input.style.brewCount) {
			case 1: return this.singleBrew(id, input);
			case 2: return this.doubleBrew(id, input);
			case 3: return this.tripleBrew(id, input);
		}
	}

	private singleBrew(id: MakgeolliRecipeId, input: MakgeolliInput): MakgeolliRecipe {
		return MakgeolliRecipe.create({
			id, style: input.style, totalRice: input.totalRice,
			stages: [
				MakgeolliStage.of(
					input.riceForm,
					input.totalRice,
					this.waterBudget(input.totalRice, input.waterRatio),
					this.nuruk(input.totalRice, input.nurukRatio)
				)
			]
		});
	}

	private doubleBrew(id: MakgeolliRecipeId, input: MakgeolliInput): MakgeolliRecipe {
		const formRatio = input.riceForm.riceWaterRatio;
		const budget = this.waterBudget(input.totalRice, input.waterRatio);

		const milsulRice = this.preFinalRicePerStage(input.totalRice, DOUBLE_BREW_MILSUL_FRACTION, formRatio, budget, 1);
		const milsulWater = milsulRice.times(formRatio);
		const deotsulRice = input.totalRice.minus(milsulRice);
		const deotsulWater = input.riceForm.addsFinalWater
			? Mass.ofGrams(Math.max(0, budget.grams - milsulWater.grams))
			: Mass.zero();

		return MakgeolliRecipe.create({
			id, style: input.style, totalRice: input.totalRice,
			stages: [
				MakgeolliStage.of(input.riceForm, milsulRice, milsulWater, this.nuruk(input.totalRice, input.nurukRatio)),
				MakgeolliStage.of(RiceForm.of('GODUBAP'), deotsulRice, deotsulWater, Mass.zero())
			]
		});
	}

	private tripleBrew(id: MakgeolliRecipeId, input: MakgeolliInput): MakgeolliRecipe {
		const formRatio = input.riceForm.riceWaterRatio;
		const budget = this.waterBudget(input.totalRice, input.waterRatio);

		const milsulRice = this.preFinalRicePerStage(input.totalRice, TRIPLE_BREW_MILSUL_FRACTION, formRatio, budget, 2);
		const deotsul1Rice = milsulRice;
		const milsulWater = milsulRice.times(formRatio);
		const deotsul1Water = deotsul1Rice.times(formRatio);
		const deotsul2Rice = input.totalRice.minus(milsulRice).minus(deotsul1Rice);
		const deotsul2Water = input.riceForm.addsFinalWater
			? Mass.ofGrams(Math.max(0, budget.grams - milsulWater.grams - deotsul1Water.grams))
			: Mass.zero();

		return MakgeolliRecipe.create({
			id, style: input.style, totalRice: input.totalRice,
			stages: [
				MakgeolliStage.of(input.riceForm, milsulRice, milsulWater, this.nuruk(input.totalRice, input.nurukRatio)),
				MakgeolliStage.of(input.riceForm, deotsul1Rice, deotsul1Water, Mass.zero()),
				MakgeolliStage.of(RiceForm.of('GODUBAP'), deotsul2Rice, deotsul2Water, Mass.zero())
			]
		});
	}

	private nuruk(rice: Mass, nurukRatio: number): Mass {
		return rice.times(nurukRatio);
	}

	private waterBudget(totalRice: Mass, waterRatio: number): Mass {
		return totalRice.times(waterRatio);
	}

	/**
	 * 물 예산에 맞춰 prefinal 단계당 쌀량을 결정한다.
	 * formRatio가 0이면 쌀:물 비율 제약이 없으므로 default fraction 그대로 사용.
	 * formRatio가 양수면, default 단계 합 물량이 예산을 넘지 않을 때만 default 사용.
	 * 넘으면 물 예산을 (preFinalCount × formRatio)로 나눠 단계당 쌀로 환산.
	 */
	private preFinalRicePerStage(
		availableRice: Mass,
		defaultFraction: number,
		formRatio: number,
		waterBudget: Mass,
		preFinalCount: number
	): Mass {
		if (formRatio === 0) return availableRice.times(defaultFraction);
		const defaultRice = availableRice.times(defaultFraction);
		const defaultTotalWater = defaultRice.grams * preFinalCount * formRatio;
		if (defaultTotalWater <= waterBudget.grams) return defaultRice;
		return Mass.ofGrams(waterBudget.grams / (preFinalCount * formRatio));
	}
}
