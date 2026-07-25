/** @vitest-environment happy-dom */
import { describe, it, expect } from 'vitest';
import { MarkdownConverter } from './MarkdownConverter';
import { MarkdownWriter } from './MarkdownWriter';

describe('MarkdownConverter.toHtml', () => {
	it('서브셋 md를 HTML로', () => {
		const html = MarkdownConverter.toHtml('## 제목\n\n**굵게** _기울임_');
		expect(html).toContain('<h2>제목</h2>');
		expect(html).toContain('<strong>굵게</strong>');
		expect(html).toContain('<em>기울임</em>');
	});
	it('취소선(~~)을 <s>로', () => {
		expect(MarkdownConverter.toHtml('~~취소~~')).toContain('<s>취소</s>');
	});
	it('제목4(####)를 <h4>로', () => {
		expect(MarkdownConverter.toHtml('#### 소소제목')).toContain('<h4>소소제목</h4>');
	});
	it('hard break를 <br>로', () => {
		expect(MarkdownConverter.toHtml('윗줄  \n아랫줄')).toContain('<br');
	});
	it('raw HTML·위험 스킴을 살균한다', () => {
		expect(MarkdownConverter.toHtml('<script>alert(1)</script>')).not.toContain('<script>');
		// javascript: 링크는 앵커가 되지 않는다(평문으로 남아 무해 + 라운드트립 보존)
		expect(MarkdownConverter.toHtml('[x](javascript:alert(1))')).not.toContain('href="javascript');
	});
	it('링크파이 없음: 평문 URL은 링크가 안 된다', () => {
		expect(MarkdownConverter.toHtml('https://naver.com 참고')).not.toContain('<a');
	});
	it('CJK 괄호 끝 볼드 (cjk-friendly)', () => {
		expect(MarkdownConverter.toHtml('**단행복합발효(單行複合醱酵)**입니다')).toContain('<strong>');
	});
});

describe('라운드트립 (toHtml → DOM → fromDom)', () => {
	function roundtrip(md: string): string {
		const root = document.createElement('div');
		root.innerHTML = MarkdownConverter.toHtml(md);
		return MarkdownWriter.fromDom(root);
	}
	it('대표 문서가 보존된다', () => {
		const source = [
			'## 만드는 법',
			'',
			'**고두밥**은 _찐 쌀_이고 ~~설익지~~ 않았다.',
			'',
			'- 쌀',
			'- 물',
			'',
			'1. 씻는다',
			'2. 찐다',
			'',
			'---',
			'',
			'[참고](https://naver.com)'
		].join('\n');
		expect(roundtrip(source)).toBe(source);
	});
	it('제목 3단계(h2·h3·h4) 왕복', () => {
		const src = '## 큰제목\n\n### 중제목\n\n#### 소제목';
		expect(roundtrip(src)).toBe(src);
	});
	it('hard break 보존', () => {
		expect(roundtrip('윗줄  \n아랫줄')).toBe('윗줄  \n아랫줄');
	});
	it('위키 문법([[slug]]·::youtube) 평문 보존', () => {
		expect(roundtrip('[[고두밥]] 참고\n\n::youtube{id=abc123}')).toBe(
			'[[고두밥]] 참고\n\n::youtube{id=abc123}'
		);
	});
});
