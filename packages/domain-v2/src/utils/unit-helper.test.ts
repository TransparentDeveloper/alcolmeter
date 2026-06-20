import type { UnitType } from '../types';

import { describe, expect, it } from 'vitest';
import { toGrams } from './unit-helper';

describe('toGrams', () => {
	it('그램은 변환 없이 그대로다', () => {
		expect(toGrams(500, 'g')).toBe(500);
	});

	it('킬로그램을 그램으로 환산한다', () => {
		expect(toGrams(1, 'kg')).toBe(1000);
	});

	it('리터를 그램으로 환산한다(밀도 1)', () => {
		expect(toGrams(2, 'L')).toBe(2000);
	});

	it('밀리리터를 그램으로 환산한다(밀도 1)', () => {
		expect(toGrams(250, 'ml')).toBe(250);
	});

	it('지원하지 않는 단위는 거부한다', () => {
		expect(() => toGrams(1, '되' as unknown as UnitType)).toThrow(RangeError);
	});
});
