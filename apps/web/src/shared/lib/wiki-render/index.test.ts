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
	it('취소선(~~)을 <s>로 렌더한다', () => {
		const html = renderWiki('~~설익음~~', new Set());
		expect(html).toContain('<s>설익음</s>');
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
	it('::youtube{id} 를 썸네일 파사드 링크로 바꾼다', () => {
		const html = renderWiki('본문\n\n::youtube{id=abc123}\n\n끝', slugs);
		expect(html).toContain('class="wiki-video"');
		expect(html).toContain('https://www.youtube.com/watch?v=abc123');
		expect(html).toContain('i.ytimg.com/vi/abc123');
		expect(html).not.toContain('<iframe');
	});
	it('괄호로 끝나는 CJK 볼드를 닫는다 (CJK flanking)', () => {
		const html = renderWiki('**단행복합발효(單行複合醱酵)**는 방식입니다.', new Set());
		expect(html).toContain('<strong>단행복합발효(單行複合醱酵)</strong>');
		expect(html).not.toContain('**');
	});
});

describe('renderWiki 표', () => {
	it('파이프 표를 표 DOM으로 렌더한다', () => {
		const html = renderWiki('| 재료 | 양 |\n| --- | --- |\n| 쌀 | 1kg |', new Set());
		expect(html).toContain('<table>');
		expect(html).toContain('<th>재료</th>');
		expect(html).toContain('<td>쌀</td>');
	});
	it('열 정렬을 text-align 스타일로 통과시킨다', () => {
		const html = renderWiki('| 가 | 나 | 다 |\n| :--- | :---: | ---: |\n| 1 | 2 | 3 |', new Set());
		expect(html).toContain('style="text-align:left"');
		expect(html).toContain('style="text-align:center"');
		expect(html).toContain('style="text-align:right"');
	});
	it('셀 안 위키링크를 앵커로 만든다', () => {
		const html = renderWiki('| 항목 |\n| --- |\n| [[효모]] |', slugs);
		expect(html).toContain('<td><a class="wiki-link" href="/wiki/%ED%9A%A8%EB%AA%A8">효모</a></td>');
	});
	it('셀 안 없는 slug는 missing 스팬으로 남긴다', () => {
		expect(renderWiki('| 항목 |\n| --- |\n| [[없음]] |', slugs)).toContain('wiki-link--missing');
	});
	it('셀 안 강조·취소선을 살린다', () => {
		const html = renderWiki('| 가 | 나 |\n| --- | --- |\n| **굵게** | ~~취소~~ |', new Set());
		expect(html).toContain('<strong>굵게</strong>');
		expect(html).toContain('<s>취소</s>');
	});
	it('셀에 text-align 외의 스타일은 통과시키지 않는다', () => {
		const html = renderWiki('| 가 |\n| --- |\n| 나 |', new Set());
		expect(html).not.toContain('position');
		expect(html).not.toContain('background');
	});
	it('이스케이프한 파이프는 셀을 쪼개지 않는다', () => {
		const html = renderWiki('| 기호 |\n| --- |\n| 가\\|나 |', new Set());
		expect(html).toContain('<td>가|나</td>');
	});
});
