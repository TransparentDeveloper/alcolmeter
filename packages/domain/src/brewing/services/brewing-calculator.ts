import { BrewRecipe, type BrewRecipeId } from '../aggregates/brew-recipe';
import { BrewStage } from '../value-objects/brew-stage';
import { BrewingStyle } from '../value-objects/brewing-style';
import { Mass } from '../value-objects/mass';
import { Ratio } from '../value-objects/ratio';
import { RiceForm } from '../value-objects/rice-form';

export interface BrewingInput {
	totalRice: Mass;
	riceForm: RiceForm;
	waterRatio: Ratio;
	nurukRatio: Ratio;
	style: BrewingStyle;
}

export class BrewingCalculator {
	calculate(input: BrewingInput): BrewRecipe {
		const id = this.newId();
		switch (input.style.code) {
			case 'danyang':
				return this.calculateDanyang(id, input);
			case 'iyang':
				return this.calculateIyang(id, input);
			case 'samyang':
				return this.calculateSamyang(id, input);
		}
	}

	private newId(): BrewRecipeId {
		return crypto.randomUUID();
	}

	private nurukForRice(rice: Mass, nurukRatio: Ratio): Mass {
		return rice.times(nurukRatio);
	}

	private waterBudget(totalRice: Mass, waterRatio: Ratio): Mass {
		return totalRice.times(waterRatio);
	}

	private hasNoFinalWater(riceForm: RiceForm): boolean {
		return riceForm.code === 'tteok' || riceForm.code === 'godubap';
	}

	/**
	 * 물 예산에 맞춰 prefinal 단계당 쌀량을 결정한다.
	 * formRatio가 0이면 쌀:물 비율 제약이 없으므로 default fraction 그대로 사용.
	 * formRatio가 양수면, default 단계 합 물량이 예산을 넘지 않을 때만 default 사용.
	 * 넘으면 물 예산을 (preFinalCount × formRatio)로 나눠 단계당 쌀로 환산.
	 */
	private preFinalRicePerStage(
		availableRice: Mass,
		defaultFraction: Ratio,
		formRatio: Ratio,
		waterBudget: Mass,
		preFinalCount: number
	): Mass {
		if (formRatio.value === 0) {
			return availableRice.times(defaultFraction);
		}
		const defaultRice = availableRice.times(defaultFraction);
		const defaultTotalWater = defaultRice.grams * preFinalCount * formRatio.value;
		if (defaultTotalWater <= waterBudget.grams) {
			return defaultRice;
		}
		return Mass.of(waterBudget.grams / (preFinalCount * formRatio.value));
	}

	private calculateDanyang(id: BrewRecipeId, input: BrewingInput): BrewRecipe {
		const water = this.waterBudget(input.totalRice, input.waterRatio);
		const nuruk = this.nurukForRice(input.totalRice, input.nurukRatio);
		const stages = [
			new BrewStage('전량 투입', input.riceForm, input.totalRice, water, nuruk)
		];
		return BrewRecipe.create({
			id,
			style: input.style,
			totalRice: input.totalRice,
			riceForm: input.riceForm,
			waterRatio: input.waterRatio,
			nurukRatio: input.nurukRatio,
			stages
		});
	}

	private calculateIyang(id: BrewRecipeId, input: BrewingInput): BrewRecipe {
		const formRatio = input.riceForm.riceWaterRatio;
		const waterBudget = this.waterBudget(input.totalRice, input.waterRatio);
		const noFinalWater = this.hasNoFinalWater(input.riceForm);

		const milsulRice = this.preFinalRicePerStage(
			input.totalRice,
			Ratio.ofFraction(0.2),
			formRatio,
			waterBudget,
			1
		);
		const milsulWater = milsulRice.times(formRatio);
		const deotsulRice = input.totalRice.minus(milsulRice);
		const deotsulWater = noFinalWater
			? Mass.zero()
			: Mass.of(Math.max(0, waterBudget.grams - milsulWater.grams));

		const stages = [
			new BrewStage(
				'밑술',
				input.riceForm,
				milsulRice,
				milsulWater,
				this.nurukForRice(input.totalRice, input.nurukRatio)
			),
			new BrewStage('덧술', RiceForm.godubap(), deotsulRice, deotsulWater, Mass.zero())
		];

		return BrewRecipe.create({
			id,
			style: input.style,
			totalRice: input.totalRice,
			riceForm: input.riceForm,
			waterRatio: input.waterRatio,
			nurukRatio: input.nurukRatio,
			stages
		});
	}

	private calculateSamyang(id: BrewRecipeId, input: BrewingInput): BrewRecipe {
		const formRatio = input.riceForm.riceWaterRatio;
		const waterBudget = this.waterBudget(input.totalRice, input.waterRatio);
		const noFinalWater = this.hasNoFinalWater(input.riceForm);

		const milsulRice = this.preFinalRicePerStage(
			input.totalRice,
			Ratio.ofFraction(0.15),
			formRatio,
			waterBudget,
			2
		);
		const deotsul1Rice = milsulRice;
		const milsulWater = milsulRice.times(formRatio);
		const deotsul1Water = deotsul1Rice.times(formRatio);
		const deotsul2Rice = input.totalRice.minus(milsulRice).minus(deotsul1Rice);
		const deotsul2Water = noFinalWater
			? Mass.zero()
			: Mass.of(Math.max(0, waterBudget.grams - milsulWater.grams - deotsul1Water.grams));

		const stages = [
			new BrewStage(
				'밑술',
				input.riceForm,
				milsulRice,
				milsulWater,
				this.nurukForRice(input.totalRice, input.nurukRatio)
			),
			new BrewStage('덧술', input.riceForm, deotsul1Rice, deotsul1Water, Mass.zero())
		];

		stages.push(new BrewStage('덧술2', RiceForm.godubap(), deotsul2Rice, deotsul2Water, Mass.zero()));

		return BrewRecipe.create({
			id,
			style: input.style,
			totalRice: input.totalRice,
			riceForm: input.riceForm,
			waterRatio: input.waterRatio,
			nurukRatio: input.nurukRatio,
			stages
		});
	}
}
