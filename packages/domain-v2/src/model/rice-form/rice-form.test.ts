import { describe, expect, it } from 'vitest';

import { RiceForm } from '.';

describe('RiceForm', () => {
	it('같은 형태는 동등하다', () => {
		expect(RiceForm.of('JUK').equals(RiceForm.of('JUK'))).toBe(true);
	});

	it('다른 형태는 동등하지 않다', () => {
		expect(RiceForm.of('JUK').equals(RiceForm.of('GODUBAP'))).toBe(false);
	});

	it('묽은 형태일수록 급수 가중이 크다 (죽 > 범벅 > 떡 > 고두밥)', () => {
		expect(RiceForm.of('JUK').waterRatio).toBeGreaterThan(RiceForm.of('BEOMBUK').waterRatio);
		expect(RiceForm.of('BEOMBUK').waterRatio).toBeGreaterThan(RiceForm.of('TTEOK').waterRatio);
		expect(RiceForm.of('TTEOK').waterRatio).toBeGreaterThan(RiceForm.of('GODUBAP').waterRatio);
	});

	it('고두밥은 물을 받지 않는다 (급수 가중 0)', () => {
		expect(RiceForm.of('GODUBAP').waterRatio).toBe(0);
	});
});
