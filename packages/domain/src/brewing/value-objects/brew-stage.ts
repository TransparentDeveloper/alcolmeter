import { ValueObject } from '../../building-blocks';
import { Mass } from './mass';
import { RiceForm } from './rice-form';

export class BrewStage extends ValueObject<BrewStage> {
	constructor(
		public readonly name: string,
		public readonly riceForm: RiceForm,
		public readonly rice: Mass,
		public readonly water: Mass,
		public readonly nuruk: Mass
	) {
		super();
	}

	equals(other: BrewStage): boolean {
		return (
			this.name === other.name &&
			this.riceForm.equals(other.riceForm) &&
			this.rice.equals(other.rice) &&
			this.water.equals(other.water) &&
			this.nuruk.equals(other.nuruk)
		);
	}
}
