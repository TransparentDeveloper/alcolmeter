import { ValueObject } from '../../building-blocks';
import { Ratio } from './ratio';

export type RiceFormCode = 'godubap' | 'tteok' | 'beombuk' | 'juk';

export class RiceForm extends ValueObject<RiceForm> {
	private constructor(
		public readonly code: RiceFormCode,
		public readonly riceWaterRatio: Ratio
	) {
		super();
	}

	private static readonly INSTANCES: Record<RiceFormCode, RiceForm> = {
		godubap: new RiceForm('godubap', Ratio.ofFraction(0)),
		tteok: new RiceForm('tteok', Ratio.ofFraction(1)),
		beombuk: new RiceForm('beombuk', Ratio.ofFraction(3)),
		juk: new RiceForm('juk', Ratio.ofFraction(5))
	};

	static godubap(): RiceForm {
		return RiceForm.INSTANCES.godubap;
	}

	static tteok(): RiceForm {
		return RiceForm.INSTANCES.tteok;
	}

	static beombuk(): RiceForm {
		return RiceForm.INSTANCES.beombuk;
	}

	static juk(): RiceForm {
		return RiceForm.INSTANCES.juk;
	}

	static fromCode(code: RiceFormCode): RiceForm {
		const instance = RiceForm.INSTANCES[code];
		if (!instance) {
			throw new Error(`Unknown RiceForm code: ${code}`);
		}
		return instance;
	}

	equals(other: RiceForm): boolean {
		return other instanceof RiceForm && this.code === other.code;
	}
}
