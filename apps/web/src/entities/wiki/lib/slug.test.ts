import { describe, it, expect } from 'vitest';
import { toSlug } from './slug';

describe('toSlug', () => {
	it('공백을 제거해 한 토큰으로 만든다', () => {
		expect(toSlug('알코올 발효')).toBe('알코올발효');
	});
	it('앞뒤 공백을 자른다', () => {
		expect(toSlug('  고두밥  ')).toBe('고두밥');
	});
	it('내부 연속 공백도 모두 제거한다', () => {
		expect(toSlug('단행 복합 발효')).toBe('단행복합발효');
	});
	it('한글·영문·숫자 외 특수문자는 뺀다', () => {
		expect(toSlug('pH/온도?')).toBe('pH온도');
	});
});
