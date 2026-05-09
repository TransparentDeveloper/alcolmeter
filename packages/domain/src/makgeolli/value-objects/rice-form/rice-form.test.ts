import { describe, expect, it } from 'vitest';
import { RiceForm } from '.';

describe('RiceForm', () => {
	it('네 가지 쌀 가공 형태를 제공한다 (고두밥, 떡, 범벅, 죽)', () => {
		expect(RiceForm.of('GODUBAP').code).toBe('GODUBAP');
		expect(RiceForm.of('TTEOK').code).toBe('TTEOK');
		expect(RiceForm.of('BEOMBUK').code).toBe('BEOMBUK');
		expect(RiceForm.of('JUK').code).toBe('JUK');
	});

	it('쌀 형태마다 고유한 쌀:물 비율을 가진다', () => {
		expect(RiceForm.of('GODUBAP').riceWaterRatio).toBe(0);
		expect(RiceForm.of('TTEOK').riceWaterRatio).toBe(1);
		expect(RiceForm.of('BEOMBUK').riceWaterRatio).toBe(3);
		expect(RiceForm.of('JUK').riceWaterRatio).toBe(5);
	});

	it('범벅·죽은 덧술에 물을 추가하고, 고두밥·떡은 추가하지 않는다', () => {
		expect(RiceForm.of('GODUBAP').addsFinalWater).toBe(false);
		expect(RiceForm.of('TTEOK').addsFinalWater).toBe(false);
		expect(RiceForm.of('BEOMBUK').addsFinalWater).toBe(true);
		expect(RiceForm.of('JUK').addsFinalWater).toBe(true);
	});

	it('같은 형태끼리는 동일하고 다른 형태와는 구별된다', () => {
		expect(RiceForm.of('TTEOK').equals(RiceForm.of('TTEOK'))).toBe(true);
		expect(RiceForm.of('TTEOK').equals(RiceForm.of('JUK'))).toBe(false);
	});
});
