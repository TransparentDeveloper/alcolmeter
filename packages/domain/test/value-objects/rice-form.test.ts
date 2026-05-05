import { describe, expect, it } from 'vitest';
import { Ratio } from '../../src/brewing/value-objects/ratio';
import { RiceForm } from '../../src/brewing/value-objects/rice-form';

describe('RiceForm', () => {
	it('네 가지 폼 인스턴스를 제공', () => {
		expect(RiceForm.godubap().code).toBe('godubap');
		expect(RiceForm.tteok().code).toBe('tteok');
		expect(RiceForm.beombuk().code).toBe('beombuk');
		expect(RiceForm.juk().code).toBe('juk');
	});

	it('riceWaterRatio는 폼별 고정값', () => {
		expect(RiceForm.godubap().riceWaterRatio.equals(Ratio.ofFraction(0))).toBe(true);
		expect(RiceForm.tteok().riceWaterRatio.equals(Ratio.ofFraction(1))).toBe(true);
		expect(RiceForm.beombuk().riceWaterRatio.equals(Ratio.ofFraction(3))).toBe(true);
		expect(RiceForm.juk().riceWaterRatio.equals(Ratio.ofFraction(5))).toBe(true);
	});

	it('fromCode("godubap")는 godubap 인스턴스', () => {
		expect(RiceForm.fromCode('godubap').equals(RiceForm.godubap())).toBe(true);
	});

	it('알 수 없는 코드는 에러', () => {
		expect(() => RiceForm.fromCode('xyz' as never)).toThrow(Error);
	});

	it('equals는 code 비교', () => {
		expect(RiceForm.tteok().equals(RiceForm.tteok())).toBe(true);
		expect(RiceForm.tteok().equals(RiceForm.juk())).toBe(false);
	});
});
