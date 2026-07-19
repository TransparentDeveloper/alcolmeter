import { describe, it, expect } from 'vitest';
import { JsonLd } from './JsonLd';

// 사용자 콘텐츠(용어 제목·요약)가 JSON-LD로 head에 {@html} 주입되므로, </script> 조기 종료를 막아야 한다.
describe('JsonLd XSS 방지', () => {
	it('DefinedTerm 필드의 </script>를 이스케이프해 script 조기 종료를 막는다', () => {
		const markup = JsonLd.createDefinedTermSchemaMarkup({
			name: '</script><script>alert(1)</script>',
			description: '설명',
			url: 'https://alcolmeter.kr/wiki/x'
		});
		expect(markup.match(/<script/g)?.length).toBe(1); // 여는 태그 하나뿐
		expect(markup).not.toContain('</script><script>');
		expect(markup).toContain('\\u003c/script');
	});

	it('DefinedTermSet의 용어 필드도 이스케이프한다', () => {
		const markup = JsonLd.createDefinedTermSetSchemaMarkup({
			name: '세트',
			description: '설명',
			url: 'https://alcolmeter.kr/wiki',
			terms: [{ name: '</script>', description: 'd', url: 'https://alcolmeter.kr/wiki/y' }]
		});
		expect(markup.match(/<script/g)?.length).toBe(1);
		expect(markup.match(/<\/script>/g)?.length).toBe(1); // 래퍼의 닫는 태그 하나뿐(주입분은 이스케이프됨)
	});
});
