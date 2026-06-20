import { describe, expect, it } from 'vitest';

import { FermentationCalculator } from '.';
import { Nuruk, Rice, Water } from '../../model/ingredient';

const calculator = new FermentationCalculator();

function run(waterGrams: number, stageCount: number) {
	return calculator.calculate({
		rice: Rice.ofGrams(1000),
		water: Water.ofGrams(waterGrams),
		nuruk: Nuruk.ofGrams(100),
		stageCount
	});
}

describe('발효 계산기', () => {
	it('발효횟수가 많을수록 도수가 높아진다', () => {
		expect(run(2000, 3).abvPercent).toBeGreaterThan(run(2000, 1).abvPercent);
	});

	it('물을 더 넣으면 도수가 낮아진다', () => {
		expect(run(4000, 3).abvPercent).toBeLessThan(run(2000, 3).abvPercent);
	});

	it('물이 적어 더 진해도 도수가 거꾸로 낮아지지 않는다', () => {
		// 예전 버그: 너무 진하면 손실이 과해 도수가 거꾸로 떨어졌다
		expect(run(500, 3).abvPercent).toBeGreaterThanOrEqual(run(2000, 3).abvPercent);
	});

	it('한 번에 담가도(1단) 배합에 따라 도수가 달라진다', () => {
		// 예전 버그: 1단이면 배합과 무관하게 한 값으로 고정됐다
		expect(run(500, 1).abvPercent).not.toBeCloseTo(run(2000, 1).abvPercent, 1);
	});

	it('도수는 효모 내성을 넘지 않는다', () => {
		// 물을 거의 안 넣어 농도를 극단적으로 높여도
		expect(run(100, 10).abvPercent).toBeLessThanOrEqual(18.5 + 1e-9);
	});

	it('분배 단계 수는 발효횟수와 같다', () => {
		expect(run(2000, 3).stages).toHaveLength(3);
	});

	it('누룩은 첫 단계(밑술)에만 들어간다', () => {
		const stages = run(2000, 3).stages;
		expect(stages[0]!.nuruk).toBeDefined();
		expect(stages[1]!.nuruk).toBeUndefined();
		expect(stages[2]!.nuruk).toBeUndefined();
	});

	it('물·쌀은 모든 단계에 들어간다', () => {
		const stages = run(2000, 3).stages;
		expect(stages.every((s) => s.rice.amount > 0)).toBe(true);
		expect(stages.every((s) => (s.water?.amount ?? 0) > 0)).toBe(true);
	});

	it('뒤 단계로 갈수록 쌀은 많아지고 물은 적어진다 (밑술→덧술)', () => {
		const stages = run(2000, 3).stages;
		expect(stages[2]!.rice.amount).toBeGreaterThan(stages[0]!.rice.amount);
		expect(stages[0]!.water!.amount).toBeGreaterThan(stages[2]!.water!.amount);
	});

	it('발효횟수가 1 미만이면 거부한다', () => {
		expect(() => run(2000, 0)).toThrow(RangeError);
	});
});
