import { describe, expect, it } from 'vitest';
import { Wash } from '.';

// 테스트용 발효 파라미터 (도메인 상수값은 추후 확정)
const MAX_CONCENTRATION = 0.06; // 한 번에 녹는 당 = 알코올 6%치
const MAX_ABV = 0.18; // 효모 내성에서 오는 최대 도수 18%

describe('Wash', () => {
	it('빈 술덧의 도수는 0이다', () => {
		expect(Wash.empty().abv).toBe(0);
	});

	it('당 농도가 한계를 넘으면 초과분은 단맛으로 굳는다', () => {
		// 부피 1L에 18%치 당 → 6%치만 녹고 12%치는 잔당으로
		const wash = Wash.empty().feed(1, 0.18, MAX_CONCENTRATION);
		expect(wash.sugar).toBeCloseTo(0.06, 5);
		expect(wash.discardedSugar).toBeCloseTo(0.12, 5);
	});

	it('발효는 도수가 내성에 닿을 때까지만 진행된다', () => {
		const wash = Wash.empty().feed(1, 0.3, MAX_CONCENTRATION).ferment(MAX_ABV);
		// 농도 한계로 6%치만 녹았고, 발효는 그 6%까지
		expect(wash.abv).toBeCloseTo(0.06, 5);
		expect(wash.sugar).toBeCloseTo(0, 5);
	});

	it('한 번에 다 부으면 농도 초과로 도수가 낮고 잔당이 많다', () => {
		const wash = Wash.empty().feed(1, 0.18, MAX_CONCENTRATION).ferment(MAX_ABV);
		expect(wash.abv).toBeCloseTo(0.06, 5);
		expect(wash.residualSugar).toBeCloseTo(0.12, 5);
	});

	it('같은 당을 나눠 투입하면 단계 사이 발효가 당을 비워 도수가 높아진다', () => {
		// 물 1L 먼저 깔고, 6%치씩 3번 — 사이사이 발효가 당을 치워 자리를 만든다
		let wash = Wash.empty().feed(1, 0.06, MAX_CONCENTRATION).ferment(MAX_ABV);
		wash = wash.feed(0, 0.06, MAX_CONCENTRATION).ferment(MAX_ABV);
		wash = wash.feed(0, 0.06, MAX_CONCENTRATION).ferment(MAX_ABV);
		expect(wash.abv).toBeCloseTo(0.18, 5);
		expect(wash.residualSugar).toBeCloseTo(0, 5);
	});

	it('나눠 담근 술이 한 번에 담근 술보다 도수가 높다', () => {
		const atOnce = Wash.empty().feed(1, 0.18, MAX_CONCENTRATION).ferment(MAX_ABV);

		let staged = Wash.empty().feed(1, 0.06, MAX_CONCENTRATION).ferment(MAX_ABV);
		staged = staged.feed(0, 0.06, MAX_CONCENTRATION).ferment(MAX_ABV);
		staged = staged.feed(0, 0.06, MAX_CONCENTRATION).ferment(MAX_ABV);

		expect(staged.abv).toBeGreaterThan(atOnce.abv);
	});
});
