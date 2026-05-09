import { AggregateRoot, type Identity } from '../../building-blocks';
import { MakgeolliStage } from '../value-objects/makgeolli-stage';
import { MakgeolliStyle } from '../value-objects/makgeolli-style';
import { Mass } from '../value-objects/mass';

export type MakgeolliRecipeId = Identity<'MakgeolliRecipeId'>;

interface MakgeolliRecipeProps {
	id: MakgeolliRecipeId;
	style: MakgeolliStyle;
	totalRice: Mass;
	stages: ReadonlyArray<MakgeolliStage>;
}

interface MakgeolliTotals {
	rice: Mass;
	water: Mass;
	nuruk: Mass;
}

const RICE_TOLERANCE_GRAMS = 1e-6;

export class MakgeolliRecipe extends AggregateRoot<MakgeolliRecipe, MakgeolliRecipeId> {
	readonly id: MakgeolliRecipeId;
	readonly style: MakgeolliStyle;
	readonly totalRice: Mass;
	readonly stages: ReadonlyArray<MakgeolliStage>;
	readonly totals: MakgeolliTotals;

	private constructor(props: MakgeolliRecipeProps, totals: MakgeolliTotals) {
		super();
		this.id = props.id;
		this.style = props.style;
		this.totalRice = props.totalRice;
		this.stages = props.stages;
		this.totals = totals;
	}

	equals(other: MakgeolliRecipe): boolean {
		return other instanceof MakgeolliRecipe && this.id === other.id;
	}

	static create(props: MakgeolliRecipeProps): MakgeolliRecipe {
		if (props.stages.length !== props.style.brewCount) {
			throw new Error(
				`stage count mismatch: brewCount ${props.style.brewCount} expects ${props.style.brewCount} stages, got ${props.stages.length}`
			);
		}

		const totals = props.stages.reduce<MakgeolliTotals>(
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

		return new MakgeolliRecipe(props, totals);
	}
}
