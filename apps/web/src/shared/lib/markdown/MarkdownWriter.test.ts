/** @vitest-environment happy-dom */
import { describe, it, expect } from 'vitest';
import { MarkdownWriter } from './MarkdownWriter';

// 주의: innerHTML은 한 줄로 쓴다(들여쓰기 개행이 텍스트 노드로 들어가는 것 방지)
function dom(html: string): HTMLElement {
	const root = document.createElement('div');
	root.innerHTML = html;
	return root;
}

describe('MarkdownWriter 토큰 어휘', () => {
	it('조각 빌더가 마크다운 조각을 만든다', () => {
		expect(MarkdownWriter.bold('밥')).toBe('**밥**');
		expect(MarkdownWriter.italic('밥')).toBe('_밥_');
		expect(MarkdownWriter.code('밥')).toBe('`밥`');
		expect(MarkdownWriter.strikethrough('밥')).toBe('~~밥~~');
		expect(MarkdownWriter.link('네이버', 'https://naver.com')).toBe('[네이버](https://naver.com)');
		expect(MarkdownWriter.heading(2, '만드는 법')).toBe('## 만드는 법');
		expect(MarkdownWriter.bulletItem('쌀')).toBe('- 쌀');
		expect(MarkdownWriter.orderedItem(3, '찐다')).toBe('3. 찐다');
		expect(MarkdownWriter.blockquote('인용')).toBe('> 인용');
		expect(MarkdownWriter.divider()).toBe('---');
	});
});

describe('MarkdownWriter.fromDom', () => {
	it('빈 에디터(<p><br></p>)는 빈 문자열', () => {
		expect(MarkdownWriter.fromDom(dom('<p><br></p>'))).toBe('');
		expect(MarkdownWriter.fromDom(dom(''))).toBe('');
	});
	it('문단·제목 (블록 사이 빈 줄)', () => {
		expect(MarkdownWriter.fromDom(dom('<h2>제목</h2><p>본문</p>'))).toBe('## 제목\n\n본문');
		expect(MarkdownWriter.fromDom(dom('<h3>소제목</h3>'))).toBe('### 소제목');
		expect(MarkdownWriter.fromDom(dom('<h4>더 작은 제목</h4>'))).toBe('#### 더 작은 제목');
	});
	it('div(브라우저 기본 블록)도 문단으로', () => {
		expect(MarkdownWriter.fromDom(dom('<div>한 줄</div><div>두 줄</div>'))).toBe('한 줄\n\n두 줄');
	});
	it('b/strong·i/em을 정규화한다', () => {
		expect(MarkdownWriter.fromDom(dom('<p><b>굵게</b> <i>기울임</i></p>'))).toBe('**굵게** _기울임_');
		expect(MarkdownWriter.fromDom(dom('<p><strong>굵게</strong> <em>기울임</em></p>'))).toBe(
			'**굵게** _기울임_'
		);
	});
	it('마크 가장자리 공백은 밖으로 뺀다 (유효한 md 강조)', () => {
		expect(MarkdownWriter.fromDom(dom('<p><b>굵게 </b>다음</p>'))).toBe('**굵게** 다음');
	});
	it('취소선(s·strike·del)을 정규화한다', () => {
		expect(MarkdownWriter.fromDom(dom('<p><s>취소</s></p>'))).toBe('~~취소~~');
		expect(MarkdownWriter.fromDom(dom('<p><strike>취소</strike></p>'))).toBe('~~취소~~');
		expect(MarkdownWriter.fromDom(dom('<p><del>취소</del></p>'))).toBe('~~취소~~');
	});
	it('중첩 마크', () => {
		expect(MarkdownWriter.fromDom(dom('<p><b><i>둘 다</i></b></p>'))).toBe('**_둘 다_**');
	});
	it('링크', () => {
		expect(MarkdownWriter.fromDom(dom('<p><a href="https://naver.com">네이버</a> 참고</p>'))).toBe(
			'[네이버](https://naver.com) 참고'
		);
	});
	it('br은 hard break(두 칸+개행)', () => {
		expect(MarkdownWriter.fromDom(dom('<p>윗줄<br>아랫줄</p>'))).toBe('윗줄  \n아랫줄');
	});
	it('목록', () => {
		expect(MarkdownWriter.fromDom(dom('<ul><li>쌀</li><li>물</li></ul>'))).toBe('- 쌀\n- 물');
		expect(MarkdownWriter.fromDom(dom('<ol><li>씻기</li><li>찌기</li></ol>'))).toBe(
			'1. 씻기\n2. 찌기'
		);
	});
	it('중첩 목록은 4칸 들여쓰기 (ol 부모에서도 안전)', () => {
		expect(MarkdownWriter.fromDom(dom('<ul><li>쌀<ul><li>멥쌀</li></ul></li></ul>'))).toBe(
			'- 쌀\n    - 멥쌀'
		);
	});
	it('hr은 구분선', () => {
		expect(MarkdownWriter.fromDom(dom('<p>위</p><hr><p>아래</p>'))).toBe('위\n\n---\n\n아래');
	});
	it('span 등 미지 태그는 태그를 버리고 내용만', () => {
		expect(MarkdownWriter.fromDom(dom('<p><span style="color:red">빨강</span></p>'))).toBe('빨강');
	});
	it('인용구', () => {
		expect(MarkdownWriter.fromDom(dom('<blockquote><p>인용</p></blockquote>'))).toBe('> 인용');
	});
	it('[[slug]]·::youtube 평문을 파괴하지 않는다', () => {
		expect(MarkdownWriter.fromDom(dom('<p>[[고두밥]] 참고</p>'))).toBe('[[고두밥]] 참고');
		expect(MarkdownWriter.fromDom(dom('<p>::youtube{id=abc}</p>'))).toBe('::youtube{id=abc}');
	});
});
