import { ValueObject } from '../../../building-blocks';

type RiceFormCode = 'GODUBAP' | 'TTEOK' | 'BEOMBUK' | 'JUK';

export class RiceForm extends ValueObject<RiceForm> {
	private constructor(
		public readonly code: RiceFormCode,
		public readonly riceWaterRatio: number,
		public readonly addsFinalWater: boolean
	) {
		super();
	}

	private static readonly INSTANCES: Record<RiceFormCode, RiceForm> = {
		GODUBAP: new RiceForm('GODUBAP', 0, false),
		TTEOK:   new RiceForm('TTEOK',   1, false),
		BEOMBUK: new RiceForm('BEOMBUK', 3, true),
		JUK:     new RiceForm('JUK',     5, true)
	};

	static of(code: RiceFormCode): RiceForm {
		return RiceForm.INSTANCES[code];
	}

	equals(other: RiceForm): boolean {
		return other instanceof RiceForm && this.code === other.code;
	}
}
