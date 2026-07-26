import { describe, it, expect } from 'vitest';
import { matchListMarker } from './EditorState.svelte';

// 에디터 조작(execCommand·selection)은 happy-dom에 구현이 없어 유닛 범위 밖이다.
// 여기서는 Tab·Space 목록 전환의 판정 규칙(순수 로직)만 고정한다.
describe('matchListMarker', () => {
	it("'-'는 ul", () => {
		expect(matchListMarker('-')).toBe('ul');
	});
	it('숫자는 점 유무와 자릿수에 상관없이 ol', () => {
		expect(matchListMarker('1')).toBe('ol');
		expect(matchListMarker('1.')).toBe('ol');
		expect(matchListMarker('3.')).toBe('ol');
		expect(matchListMarker('12.')).toBe('ol');
	});
	it('마커가 아니면 null (본문을 삼키면 안 된다)', () => {
		expect(matchListMarker('')).toBeNull();
		expect(matchListMarker('--')).toBeNull();
		expect(matchListMarker('1)')).toBeNull();
		expect(matchListMarker('1. 항목')).toBeNull();
		expect(matchListMarker('- 항목')).toBeNull();
		expect(matchListMarker('가')).toBeNull();
		expect(matchListMarker('.')).toBeNull();
	});
});
