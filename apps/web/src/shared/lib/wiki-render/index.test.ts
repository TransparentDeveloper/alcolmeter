import { describe, it, expect } from 'vitest';
import { renderWiki } from './index';

const slugs = new Set(['효모', '당화']);

describe('renderWiki', () => {
	it('존재하는 위키링크는 /wiki 앵커로', () => {
		const html = renderWiki('[[효모]] 참고', slugs);
		expect(html).toContain('<a class="wiki-link" href="/wiki/%ED%9A%A8%EB%AA%A8">효모</a>');
	});
	it('표시문구 문법 지원', () => {
		const html = renderWiki('[[당화|당화 과정]]', slugs);
		expect(html).toContain('>당화 과정</a>');
	});
	it('없는 slug는 missing 스팬', () => {
		const html = renderWiki('[[없음]]', slugs);
		expect(html).toContain('wiki-link--missing');
		expect(html).not.toContain('href');
	});
	it('raw HTML/script를 살균한다', () => {
		const html = renderWiki('<script>alert(1)</script>\n\n**굵게**', slugs);
		expect(html).not.toContain('<script>');
		expect(html).toContain('<strong>굵게</strong>');
	});
	it('javascript: 링크를 제거한다', () => {
		const html = renderWiki('[클릭](javascript:alert(1))', slugs);
		expect(html).not.toContain('javascript:');
	});
});
