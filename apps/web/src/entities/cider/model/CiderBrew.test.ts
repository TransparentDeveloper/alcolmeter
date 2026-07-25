import { describe, expect, it } from 'vitest';

import { CiderBrew } from './CiderBrew';

describe('사이다 결과 뷰모델', () => {
	it('잔당이 거의 없으면 드라이로 판정한다', () => {
		const brew = CiderBrew.fromOutcome({ abvPercent: 7, volumeLiters: 6.5, residualSugarGrams: 0 });
		expect(brew.fermentationStopped).toBe(false);
	});

	it('리터당 잔당이 임계를 넘으면 발효 정지로 판정한다', () => {
		const brew = CiderBrew.fromOutcome({ abvPercent: 12, volumeLiters: 6.5, residualSugarGrams: 200 });
		expect(brew.fermentationStopped).toBe(true);
		expect(brew.residualSugarPerLiter).toBeGreaterThan(0);
	});

	it('생산량이 0이면 리터당 잔당은 0이다', () => {
		const brew = CiderBrew.fromOutcome({ abvPercent: 0, volumeLiters: 0, residualSugarGrams: 0 });
		expect(brew.residualSugarPerLiter).toBe(0);
	});
});
