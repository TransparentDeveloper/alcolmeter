export type RiceFormCodeType = 'GODUBAP' | 'TTEOK' | 'BEOMBUK' | 'JUK';

/**
 * 쌀 가공 형태(고두밥·떡·범벅·죽) — 쌀 발효주(막걸리 등) 공통 값.
 *
 * `waterRatio`는 형태의 **상대 급수(물:쌀) 가중**이다. 총 물량을 정하지 않고,
 * 한 단계에 물을 얼마나 머금는지의 **분배 비율**로만 쓰인다.
 * (고두밥 0: 물을 거의 안 받아 되직 / 죽 5: 가장 묽음)
 * 값은 캘리브레이션 전 임시값.
 */
export class RiceForm {
	private static readonly INSTANCES: Record<RiceFormCodeType, RiceForm> = {
		GODUBAP: new RiceForm('GODUBAP', 0),
		TTEOK: new RiceForm('TTEOK', 1),
		BEOMBUK: new RiceForm('BEOMBUK', 3),
		JUK: new RiceForm('JUK', 5)
	};

	private constructor(
		public readonly code: RiceFormCodeType,
		/** 상대 급수 가중 (물:쌀). 분배 비율로만 사용. */
		public readonly waterRatio: number
	) {}

	static of(code: RiceFormCodeType): RiceForm {
		return RiceForm.INSTANCES[code];
	}

	equals(other: RiceForm): boolean {
		return other instanceof RiceForm && this.code === other.code;
	}
}
