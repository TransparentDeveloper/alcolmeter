import { describe, expect, it } from 'vitest';

import { AppleVariety } from '.';

describe('사과 품종', () => {
	it('같은 코드는 같은 품종으로 취급된다', () => {
		expect(AppleVariety.of('FUJI').equals(AppleVariety.of('FUJI'))).toBe(true);
	});

	it('품종마다 당도·착즙률 프리셋을 가진다', () => {
		const fuji = AppleVariety.of('FUJI');
		expect(fuji.brix).toBeGreaterThan(0);
		expect(fuji.juiceYield).toBeGreaterThan(0);
	});

	it('미지의 품종 코드는 undefined를 돌려주지 않고 실패한다', () => {
		// @ts-expect-error 미등록 코드
		expect(() => AppleVariety.of('UNKNOWN')).toThrow();
	});
});
