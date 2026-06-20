import { describe, expect, it } from 'vitest';

import { Wash } from '.';

// 테스트용 발효 파라미터 (도메인 상수값은 calculator에서 확정)
const MAX_CONCENTRATION = 0.06; // 한 번에 녹는 당 한계
const MAX_ABV = 0.18; // 효모 내성에서 오는 최대 도수
const LOSS_RATIO = 0.6; // 농도 초과분 중 굳어 손실되는 비율

describe('Wash', () => {
	it('빈 술덧의 도수는 0이다', () => {
		expect(Wash.empty().abv).toBe(0);
	});

	it('한 번에 농도 한계를 넘겨 부으면 초과분 일부만 단맛으로 굳는다', () => {
		// 한계를 크게 넘겨 부어도, 초과분 전부가 아니라 일부만 굳는다
		const wash = Wash.empty().feed(1, 0.5, MAX_CONCENTRATION, LOSS_RATIO);
		expect(wash.discardedSugar).toBeGreaterThan(0); // 일부는 굳고
		expect(wash.sugar).toBeGreaterThan(MAX_CONCENTRATION); // 일부는 한계 이상으로 남는다(전부 버리지 않음)
	});

	it('당이 아무리 많아도 도수는 내성을 넘지 않는다', () => {
		const wash = Wash.empty().feed(1, 1, MAX_CONCENTRATION, LOSS_RATIO).ferment(MAX_ABV);
		expect(wash.abv).toBeLessThanOrEqual(MAX_ABV + 1e-9);
	});

	it('같은 당을 한 번에 부으면 나눠 부을 때보다 도수가 낮고 잔당이 많다', () => {
		const atOnce = Wash.empty().feed(1, 0.24, MAX_CONCENTRATION, LOSS_RATIO).ferment(MAX_ABV);

		// 같은 0.24를 0.06씩 4번 — 사이사이 발효가 당을 치워 자리를 만든다
		let staged = Wash.empty();
		for (let i = 0; i < 4; i++) {
			staged = staged.feed(i === 0 ? 1 : 0, 0.06, MAX_CONCENTRATION, LOSS_RATIO).ferment(MAX_ABV);
		}

		expect(staged.abv).toBeGreaterThan(atOnce.abv);
		expect(staged.residualSugar).toBeLessThan(atOnce.residualSugar);
	});

	it('한계 이내로 나눠 부으면 잔당 없이 내성까지 발효된다', () => {
		// 물 1L에 6%치씩 3번 = 18%치 → 내성에 정확히 닿고 잔당 0
		let wash = Wash.empty().feed(1, 0.06, MAX_CONCENTRATION, LOSS_RATIO).ferment(MAX_ABV);
		wash = wash.feed(0, 0.06, MAX_CONCENTRATION, LOSS_RATIO).ferment(MAX_ABV);
		wash = wash.feed(0, 0.06, MAX_CONCENTRATION, LOSS_RATIO).ferment(MAX_ABV);
		expect(wash.abv).toBeCloseTo(MAX_ABV, 9);
		expect(wash.residualSugar).toBeCloseTo(0, 9);
	});
});
