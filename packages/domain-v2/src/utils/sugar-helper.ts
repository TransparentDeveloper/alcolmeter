// 발효 가능한 당 1g이 효율까지 반영해 내는 잠재 에탄올(L).
// 이론 최대치(0.000648 = 당1g→에탄올0.511g/밀도0.789)에서 발효 효율(~90%)을 반영한 값.
// 캘리브레이션 전 임시값.
const ETHANOL_LITERS_PER_SUGAR_GRAM = 0.000583;

/** 발효 가능한 당 질량(g)을 잠재 에탄올(L)로 환산한다. */
function sugarGramsToEthanolLiters(sugarGrams: number): number {
	return sugarGrams * ETHANOL_LITERS_PER_SUGAR_GRAM;
}

/** 잠재 에탄올(L)을 그걸 낸 발효 가능한 당 질량(g)으로 되돌린다(잔당 표시용). */
function ethanolLitersToSugarGrams(ethanolLiters: number): number {
	return ethanolLiters / ETHANOL_LITERS_PER_SUGAR_GRAM;
}

export { sugarGramsToEthanolLiters, ethanolLitersToSugarGrams };
