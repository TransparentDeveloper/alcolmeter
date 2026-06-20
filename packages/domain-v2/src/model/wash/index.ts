/**
 * 술덧(wash) — 발효 중/후의 액. 증류 시 증류기에 넣는 액이기도 하다.
 * 부피·에탄올·당 상태를 들고, 단계별 투입(feed)과 발효(ferment) 전이를 제공한다.
 *
 * 단위:
 *  - 부피·에탄올: L
 *  - 당: "에탄올 환산 L" = 이 당이 다 발효되면 나올 에탄올 부피 (양조의 '잠재 알코올').
 *        그램이 아니라 에탄올 기준으로 재므로 ethanol·headroom과 같은 자에서 직접 비교된다.
 *        당→에탄올 화학량론 변환은 Wash 밖(재료 레이어)에서 적용하고, Wash는 당 1 → 에탄올 1로 다룬다.
 *  - 도수(abv)·농도·내성: 0~1 분율
 *
 * 단순화: ferment는 volume을 바꾸지 않는다(CO₂ 배출 등 미세한 부피 변화 무시). 부피는 feed로만 정해진다.
 *
 * 내부 시뮬레이션 상태라 ValueObject로 두지 않는다(동등성 비교가 연산에 쓰이지
 * 않고, float 필드라 equals가 부적절). 모든 전이는 새 Wash를 반환한다(불변).
 */
export class Wash {
	private constructor(
		/** 총 액체 부피 (L) */
		public readonly volume: number,
		/** 누적 에탄올 (L) */
		public readonly ethanol: number,
		/** 발효 가능한 용존 당 (에탄올 환산 L) — 희석되면 더 발효될 수 있다 */
		public readonly sugar: number,
		/** 농도 초과로 발효되지 못하고 굳은 당 (에탄올 환산 L) — 영구 단맛 */
		public readonly discardedSugar: number
	) {}

	static empty(): Wash {
		return new Wash(0, 0, 0, 0);
	}

	/** 현재 도수 (0~1). 액이 없으면 0. */
	get abv(): number {
		return this.volume > 0 ? this.ethanol / this.volume : 0;
	}

	/** 발효되지 못하고 단맛으로 남은 당 총량 (에탄올 환산 L). */
	get residualSugar(): number {
		return this.sugar + this.discardedSugar;
	}

	/**
	 * 물·당을 투입한다. 투입 후 당 농도가 maxConcentration을 넘으면, 그 초과분 중
	 * lossRatio 비율만큼이 효모 삼투압 스트레스로 굳어 단맛(discardedSugar)으로 영구 손실되고,
	 * 나머지는 용존 당으로 남아 다음 투입(희석)·발효 때 다시 발효될 수 있다.
	 * 초과분 전부가 아니라 일부만 손실되므로, 한 번에 부어도 도수가 한 값으로 고정되지 않는다.
	 */
	feed(addedVolume: number, addedSugar: number, maxConcentration: number, lossRatio: number): Wash {
		const volume = this.volume + addedVolume;
		let sugar = this.sugar + addedSugar;
		let discardedSugar = this.discardedSugar;

		const excess = sugar - maxConcentration * volume;
		if (excess > 0) {
			const locked = lossRatio * excess; // 초과분 중 일부만 굳어 손실, 나머지는 용존으로 잔류
			discardedSugar += locked;
			sugar -= locked;
		}

		return new Wash(volume, this.ethanol, sugar, discardedSugar);
	}

	/**
	 * 용존 당을 에탄올로 전환한다. 도수가 maxAbv에 닿거나 당이 소진될 때까지.
	 * maxAbv는 효모 알코올 내성에서 오는 도달 가능한 최대 도수다.
	 * 남은 용존 당은 다음 투입(희석)으로 발효 여지가 생기면 다시 발효된다.
	 */
	ferment(maxAbv: number): Wash {
		const headroom = maxAbv * this.volume - this.ethanol;
		const converted = Math.max(0, Math.min(this.sugar, headroom));
		return new Wash(this.volume, this.ethanol + converted, this.sugar - converted, this.discardedSugar);
	}
}
