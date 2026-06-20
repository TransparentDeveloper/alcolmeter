import { describe, expect, it } from 'vitest';

import { MakgeolliCalculator } from '.';
import { Rice } from '../../model/ingredient';
import { RiceForm } from '../../model/rice-form';
import type { RiceFormCodeType } from '../../model/rice-form';

const calculator = new MakgeolliCalculator();

function brew(riceGrams: number, waterRatio: number, stageCount: number, form: RiceFormCodeType = 'JUK') {
	return calculator.calculate({
		rice: Rice.ofGrams(riceGrams),
		baseForm: RiceForm.of(form),
		waterRatio,
		nurukRatio: 0.1,
		stageCount
	});
}

describe('막걸리 계산기', () => {
	it('발효횟수가 많을수록 도수가 높아진다', () => {
		expect(brew(1000, 1.0, 3).abvPercent).toBeGreaterThan(brew(1000, 1.0, 1).abvPercent);
	});

	it('급수율을 높이면(물 많이) 도수가 낮아진다', () => {
		expect(brew(1000, 2.0, 3).abvPercent).toBeLessThan(brew(1000, 1.0, 3).abvPercent);
	});

	it('도수는 효모 내성을 넘지 않는다', () => {
		expect(brew(1000, 0.3, 5).abvPercent).toBeLessThanOrEqual(18.5 + 1e-9);
	});

	it('분배 단계 수는 발효횟수와 같다', () => {
		expect(brew(1000, 1.0, 3).stages).toHaveLength(3);
	});

	it('마지막 덧술은 고두밥, 누룩은 첫 단계(밑술)에만 들어간다', () => {
		const stages = brew(1000, 1.0, 3, 'JUK').stages;
		expect(stages[2]!.form.code).toBe('GODUBAP');
		expect(stages[0]!.form.code).toBe('JUK');
		expect(stages[0]!.nuruk.amount).toBeGreaterThan(0);
		expect(stages[1]!.nuruk.amount).toBe(0);
		expect(stages[2]!.nuruk.amount).toBe(0);
	});

	it('뒤 단계로 갈수록 쌀이 많아진다 (밑술 작게 → 덧술 크게)', () => {
		const stages = brew(1000, 1.0, 3).stages;
		expect(stages[2]!.rice.amount).toBeGreaterThan(stages[0]!.rice.amount);
	});

	it('최적 급수율로 빚으면 잔당이 줄어든다', () => {
		const base = brew(1000, 1.0, 3);
		expect(base.optimalWaterRatio).toBeGreaterThan(0);
		const atOptimal = brew(1000, base.optimalWaterRatio, 3);
		expect(atOptimal.residualSugarLiters).toBeLessThan(base.residualSugarLiters);
	});

	it('발효횟수가 1 미만이면 거부한다', () => {
		expect(() => brew(1000, 1.0, 0)).toThrow(RangeError);
	});
});
