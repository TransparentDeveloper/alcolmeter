import { describe, expect, it } from 'vitest';
import { MakgeolliStyle } from '.';

describe('MakgeolliStyle', () => {
	it('단양주(1회), 이양주(2회), 삼양주(3회)를 표현한다', () => {
		expect(MakgeolliStyle.of(1).brewCount).toBe(1);
		expect(MakgeolliStyle.of(2).brewCount).toBe(2);
		expect(MakgeolliStyle.of(3).brewCount).toBe(3);
	});

	it('빚는 횟수가 같으면 동일한 양조 방식이다', () => {
		expect(MakgeolliStyle.of(2).equals(MakgeolliStyle.of(2))).toBe(true);
	});

	it('빚는 횟수가 다르면 다른 양조 방식이다', () => {
		expect(MakgeolliStyle.of(1).equals(MakgeolliStyle.of(2))).toBe(false);
	});
});
