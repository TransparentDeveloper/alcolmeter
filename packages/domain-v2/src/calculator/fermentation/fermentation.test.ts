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

	it('도수는 효모 내성을 넘지 않는다', () => {
		// 물을 거의 안 넣어 농도를 극단적으로 높여도
		expect(run(100, 10).abvPercent).toBeLessThanOrEqual(18);
	});

	it('분배 단계 수는 발효횟수와 같다', () => {
		expect(run(2000, 3).stages).toHaveLength(3);
	});

	it('물·누룩은 첫 단계에만, 쌀은 모든 단계에 들어간다', () => {
		const stages = run(2000, 3).stages;
		expect(stages[0]!.water).toBeDefined();
		expect(stages[0]!.nuruk).toBeDefined();
		expect(stages[1]!.water).toBeUndefined();
		expect(stages.every((s) => s.rice.amount > 0)).toBe(true);
	});

	it('발효횟수가 1 미만이면 거부한다', () => {
		expect(() => run(2000, 0)).toThrow(RangeError);
	});
});
