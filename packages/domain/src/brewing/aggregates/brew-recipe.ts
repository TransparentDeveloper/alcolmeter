import { AggregateRoot, type Brand } from '../../building-blocks';
import { BrewStage } from '../value-objects/brew-stage';
import { BrewingStyle } from '../value-objects/brewing-style';
import { Mass } from '../value-objects/mass';
import { Ratio } from '../value-objects/ratio';
import { RiceForm } from '../value-objects/rice-form';

export type BrewRecipeId = Brand<'BrewRecipeId'>;

export interface BrewRecipeProps {
	id: BrewRecipeId;
	style: BrewingStyle;
	totalRice: Mass;
	riceForm: RiceForm;
	waterRatio: Ratio;
	nurukRatio: Ratio;
	stages: ReadonlyArray<BrewStage>;
}

export interface BrewTotals {
	rice: Mass;
	water: Mass;
	nuruk: Mass;
}

const RICE_TOLERANCE_GRAMS = 1e-6;

export class BrewRecipe extends AggregateRoot<BrewRecipe, BrewRecipeId> {
	readonly id: BrewRecipeId;
	readonly style: BrewingStyle;
	readonly totalRice: Mass;
	readonly riceForm: RiceForm;
	readonly waterRatio: Ratio;
	readonly nurukRatio: Ratio;
	readonly stages: ReadonlyArray<BrewStage>;
	readonly totals: BrewTotals;

	private constructor(props: BrewRecipeProps, totals: BrewTotals) {
		super();
		this.id = props.id;
		this.style = props.style;
		this.totalRice = props.totalRice;
		this.riceForm = props.riceForm;
		this.waterRatio = props.waterRatio;
		this.nurukRatio = props.nurukRatio;
		this.stages = props.stages;
		this.totals = totals;
	}

	static create(props: BrewRecipeProps): BrewRecipe {
		if (props.stages.length !== props.style.stageCount) {
			throw new Error(
				`stage count mismatch: style ${props.style.code} expects ${props.style.stageCount}, got ${props.stages.length}`
			);
		}

		const totals = props.stages.reduce<BrewTotals>(
			(acc, s) => ({
				rice: acc.rice.plus(s.rice),
				water: acc.water.plus(s.water),
				nuruk: acc.nuruk.plus(s.nuruk)
			}),
			{ rice: Mass.zero(), water: Mass.zero(), nuruk: Mass.zero() }
		);

		const riceDiff = Math.abs(totals.rice.grams - props.totalRice.grams);
		if (riceDiff > RICE_TOLERANCE_GRAMS) {
			throw new Error(
				`stages total rice (${totals.rice.grams}) does not match totalRice (${props.totalRice.grams})`
			);
		}

		return new BrewRecipe(props, totals);
	}
}
