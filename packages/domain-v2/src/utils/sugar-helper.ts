// 당 1g의 잠재 에탄올(L). 화학량론(당 1g → 에탄올 ~0.511g, 밀도 0.789 g/mL).
// 캘리브레이션 전 임시값.
const ETHANOL_LITERS_PER_SUGAR_GRAM = 0.000648;

/** 당 질량(g)을 발효 시 나올 잠재 에탄올(L)로 환산한다. */
export function sugarGramsToEthanolLiters(sugarGrams: number): number {
	return sugarGrams * ETHANOL_LITERS_PER_SUGAR_GRAM;
}
