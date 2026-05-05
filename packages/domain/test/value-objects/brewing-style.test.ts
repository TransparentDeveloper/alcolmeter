import { describe, expect, it } from 'vitest';
import { BrewingStyle } from '../../src/brewing/value-objects/brewing-style';

describe('BrewingStyle', () => {
	it('세 가지 스타일 인스턴스 제공', () => {
		expect(BrewingStyle.danyang().code).toBe('danyang');
		expect(BrewingStyle.iyang().code).toBe('iyang');
		expect(BrewingStyle.samyang().code).toBe('samyang');
	});

	it('단계 수: 단양주 1, 이양주 2, 삼양주 3', () => {
		expect(BrewingStyle.danyang().stageCount).toBe(1);
		expect(BrewingStyle.iyang().stageCount).toBe(2);
		expect(BrewingStyle.samyang().stageCount).toBe(3);
	});

	it('단양주 단계 이름: ["전량 투입"]', () => {
		expect(BrewingStyle.danyang().stageNames).toEqual(['전량 투입']);
	});

	it('이양주 단계 이름: ["밑술", "덧술"]', () => {
		expect(BrewingStyle.iyang().stageNames).toEqual(['밑술', '덧술']);
	});

	it('삼양주 단계 이름: ["밑술", "덧술", "덧술2"]', () => {
		expect(BrewingStyle.samyang().stageNames).toEqual(['밑술', '덧술', '덧술2']);
	});

	it('fromCode 라운드트립', () => {
		expect(BrewingStyle.fromCode('iyang').equals(BrewingStyle.iyang())).toBe(true);
	});

	it('알 수 없는 코드는 에러', () => {
		expect(() => BrewingStyle.fromCode('xxx' as never)).toThrow(Error);
	});

	it('equals는 code 비교', () => {
		expect(BrewingStyle.danyang().equals(BrewingStyle.danyang())).toBe(true);
		expect(BrewingStyle.danyang().equals(BrewingStyle.iyang())).toBe(false);
	});
});
