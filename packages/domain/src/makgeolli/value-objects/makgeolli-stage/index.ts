import { ValueObject } from '../../../building-blocks';
import { Mass } from '../mass';
import { RiceForm } from '../rice-form';

export class MakgeolliStage extends ValueObject<MakgeolliStage> {
	private constructor(
		public readonly riceForm: RiceForm,
		public readonly rice: Mass,
		public readonly water: Mass,
		public readonly nuruk: Mass
	) {
		super();
	}

	static of(riceForm: RiceForm, rice: Mass, water: Mass, nuruk: Mass): MakgeolliStage {
		return new MakgeolliStage(riceForm, rice, water, nuruk);
	}

	equals(other: MakgeolliStage): boolean {
		return (
			other instanceof MakgeolliStage &&
			this.riceForm.equals(other.riceForm) &&
			this.rice.equals(other.rice) &&
			this.water.equals(other.water) &&
			this.nuruk.equals(other.nuruk)
		);
	}
}
