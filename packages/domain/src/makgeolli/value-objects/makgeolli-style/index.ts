import { ValueObject } from '../../../building-blocks';

type MakgeolliBrewCount = 1 | 2 | 3;

export class MakgeolliStyle extends ValueObject<MakgeolliStyle> {
	private constructor(public readonly brewCount: MakgeolliBrewCount) {
		super();
	}

	static of(brewCount: MakgeolliBrewCount): MakgeolliStyle {
		return new MakgeolliStyle(brewCount);
	}

	equals(other: MakgeolliStyle): boolean {
		return other instanceof MakgeolliStyle && this.brewCount === other.brewCount;
	}
}
