import { describe, expect, it } from 'vitest';

import { LiquorController } from '../interface';

const controller = new LiquorController();

describe('사이다 빚기(공개 API)', () => {
	it('사과 양·품종만으로 도수·생산량·잔당(그램)을 낸다', () => {
		const result = controller.cider({
			apple: { amount: 10, unit: 'kg', variety: 'FUJI' }
		});
		expect(result.abvPercent).toBeGreaterThan(0);
		expect(result.volumeLiters).toBeGreaterThan(0);
		expect(result.residualSugarGrams).toBeGreaterThanOrEqual(0);
	});

	it('가당하면 도수가 오른다', () => {
		const plain = controller.cider({ apple: { amount: 10, unit: 'kg', variety: 'FUJI' } });
		const chaptalized = controller.cider({
			apple: { amount: 10, unit: 'kg', variety: 'FUJI' },
			addedSugar: { kind: 'SUGAR', amount: 1, unit: 'kg' }
		});
		expect(chaptalized.abvPercent).toBeGreaterThan(plain.abvPercent);
	});

	it('정상 사과즙은 드라이하게 발효돼 잔당이 거의 없다', () => {
		const result = controller.cider({ apple: { amount: 10, unit: 'kg', variety: 'FUJI' } });
		expect(result.residualSugarGrams).toBeCloseTo(0, 3);
	});

	it('내성을 크게 넘기게 가당하면 잔당(그램)이 남는다', () => {
		const result = controller.cider({
			apple: { amount: 10, unit: 'kg', variety: 'FUJI' },
			addedSugar: { kind: 'SUGAR', amount: 5, unit: 'kg' }
		});
		expect(result.residualSugarGrams).toBeGreaterThan(0);
	});
});
