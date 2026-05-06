import { ValueObject } from '../../building-blocks';

export type BrewingStyleCode = 'danyang' | 'iyang' | 'samyang';

export class BrewingStyle extends ValueObject<BrewingStyle> {
	private constructor(
		public readonly code: BrewingStyleCode,
		public readonly stageNames: ReadonlyArray<string>
	) {
		super();
	}

	private static readonly INSTANCES: Record<BrewingStyleCode, BrewingStyle> = {
		danyang: new BrewingStyle('danyang', ['전량 투입']),
		iyang: new BrewingStyle('iyang', ['밑술', '덧술']),
		samyang: new BrewingStyle('samyang', ['밑술', '덧술', '덧술2'])
	};

	static danyang(): BrewingStyle {
		return BrewingStyle.INSTANCES.danyang;
	}

	static iyang(): BrewingStyle {
		return BrewingStyle.INSTANCES.iyang;
	}

	static samyang(): BrewingStyle {
		return BrewingStyle.INSTANCES.samyang;
	}

	static fromCode(code: BrewingStyleCode): BrewingStyle {
		const instance = BrewingStyle.INSTANCES[code];
		if (!instance) {
			throw new Error(`Unknown BrewingStyle code: ${code}`);
		}
		return instance;
	}

	get stageCount(): number {
		return this.stageNames.length;
	}

	equals(other: BrewingStyle): boolean {
		return other instanceof BrewingStyle && this.code === other.code;
	}
}
