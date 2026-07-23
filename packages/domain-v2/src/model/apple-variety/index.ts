export type AppleVarietyCodeType = 'FUJI' | 'HONGOK' | 'HONGRO' | 'AORI';

/**
 * 사과 품종 — 하드 사이다 원료. 품종마다 착즙액 당도(Brix)와 착즙률이 다르다.
 * 값은 캘리브레이션 전 임시값.
 */
export class AppleVariety {
	private static readonly INSTANCES: Record<AppleVarietyCodeType, AppleVariety> = {
		FUJI: new AppleVariety('FUJI', 14, 0.65),
		HONGOK: new AppleVariety('HONGOK', 12, 0.6),
		HONGRO: new AppleVariety('HONGRO', 13, 0.62),
		AORI: new AppleVariety('AORI', 11, 0.63)
	};

	private constructor(
		public readonly code: AppleVarietyCodeType,
		/** 착즙액 당도 (°Bx) */
		public readonly brix: number,
		/** 착즙률: 사과 1kg당 나오는 즙 부피 (L/kg) */
		public readonly juiceYield: number
	) {}

	static of(code: AppleVarietyCodeType): AppleVariety {
		const variety = AppleVariety.INSTANCES[code];
		if (!variety) {
			throw new RangeError(`알 수 없는 사과 품종: ${code}`);
		}
		return variety;
	}

	equals(other: AppleVariety): boolean {
		return other instanceof AppleVariety && this.code === other.code;
	}
}
