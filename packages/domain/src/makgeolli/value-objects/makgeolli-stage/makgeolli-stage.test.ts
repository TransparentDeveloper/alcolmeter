import { describe, expect, it } from 'vitest';
import { MakgeolliStage } from '.';
import { Mass } from '../mass';
import { RiceForm } from '../rice-form';

const tteok = RiceForm.of('TTEOK');
const godubap = RiceForm.of('GODUBAP');
const rice = Mass.ofGrams(500);
const water = Mass.ofGrams(500);
const nuruk = Mass.ofGrams(50);

describe('MakgeolliStage', () => {
	it('쌀 형태, 쌀량, 물량, 누룩량을 기록한다', () => {
		const stage = MakgeolliStage.of(tteok, rice, water, nuruk);
		expect(stage.riceForm.equals(tteok)).toBe(true);
		expect(stage.rice.equals(rice)).toBe(true);
		expect(stage.water.equals(water)).toBe(true);
		expect(stage.nuruk.equals(nuruk)).toBe(true);
	});

	it('모든 재료가 같을 때만 동일한 단계로 본다', () => {
		const base = MakgeolliStage.of(tteok, rice, water, nuruk);
		expect(base.equals(MakgeolliStage.of(tteok, rice, water, nuruk))).toBe(true);
		expect(base.equals(MakgeolliStage.of(godubap, rice, water, nuruk))).toBe(false);
		expect(base.equals(MakgeolliStage.of(tteok, Mass.ofGrams(600), water, nuruk))).toBe(false);
		expect(base.equals(MakgeolliStage.of(tteok, rice, Mass.ofGrams(200), nuruk))).toBe(false);
		expect(base.equals(MakgeolliStage.of(tteok, rice, water, Mass.zero()))).toBe(false);
	});
});
