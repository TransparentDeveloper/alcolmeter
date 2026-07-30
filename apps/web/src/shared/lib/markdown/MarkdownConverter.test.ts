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
	it('표를 편집 가능한 표 DOM으로', () => {
		const html = MarkdownConverter.toHtml('| 재료 | 양 |\n| --- | --- |\n| 쌀 | 1kg |');
		expect(html).toContain('<table>');
		expect(html).toContain('<thead>');
		expect(html).toContain('<tbody>');
		expect(html).toContain('<th>재료</th>');
		expect(html).toContain('<td>쌀</td>');
	});
	it('열 정렬을 text-align 인라인 스타일로 통과시킨다', () => {
		const html = MarkdownConverter.toHtml('| 가 | 나 | 다 |\n| :--- | :---: | ---: |\n| 1 | 2 | 3 |');
		expect(html).toContain('style="text-align:left"');
		expect(html).toContain('style="text-align:center"');
		expect(html).toContain('style="text-align:right"');
	});
	it('셀 안 인라인 서식을 살린다', () => {
		const html = MarkdownConverter.toHtml('| 항목 |\n| --- |\n| **당화** `t` |');
		expect(html).toContain('<strong>당화</strong>');
		expect(html).toContain('<code>t</code>');
	});
	it('표 모양 raw HTML은 평문으로 남는다 (html: false)', () => {
		expect(MarkdownConverter.toHtml('<table><tr><td>가</td></tr></table>')).not.toContain(
			'<table>'
		);
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
		expect(roundtrip('[[고두밥]] 평문 보존\n\n::youtube{id=abc123}')).toBe(
			'[[고두밥]] 평문 보존\n\n::youtube{id=abc123}'
		);
	});
	it('문단이 여러 개인 인용구 왕복', () => {
		const src = '> 첫 줄\n>\n> 둘째 줄';
		expect(roundtrip(src)).toBe(src);
	});
	it('인용구 안 목록 왕복', () => {
		const src = '> - 가\n> - 나';
		expect(roundtrip(src)).toBe(src);
	});
	it('목록 3단 중첩 왕복', () => {
		const src = '- 쌀\n    - 멥쌀\n        1. 씻기';
		expect(roundtrip(src)).toBe(src);
	});
	it('목록 3단 혼합(ul→ol→ul) 왕복', () => {
		const src = '- 가\n    1. 나\n        - 다';
		expect(roundtrip(src)).toBe(src);
	});
	it('순서 목록 안 순서 목록 왕복 (번호 유지)', () => {
		const src = '1. 하나\n    1. 둘\n    2. 셋\n2. 넷';
		expect(roundtrip(src)).toBe(src);
	});
	it('형제 중첩 그룹이 여러 개인 목록 왕복', () => {
		const src = '- 가\n    - 가1\n- 나\n    - 나1';
		expect(roundtrip(src)).toBe(src);
	});
	it('중첩 항목의 인라인 강조 왕복', () => {
		const src = '- **굵게**\n    - _기울임_ 항목';
		expect(roundtrip(src)).toBe(src);
	});
	it('목록 항목 안 hard break 왕복', () => {
		const src = '- 윗줄  \n아랫줄';
		expect(roundtrip(src)).toBe(src);
	});
	it('느슨한 목록(항목 사이 빈 줄)은 촘촘한 목록으로 정규화된다', () => {
		expect(roundtrip('- 가\n\n- 나')).toBe('- 가\n- 나');
	});
	it('복합 문서(제목·목록·인용·구분선·링크)가 보존된다', () => {
		const source = [
			'## 이양주',
			'',
			'**이양주(二釀酒)**는 두 번 빚는 술이다.',
			'',
			'### 발효 원리',
			'',
			'- **당화**: 전분이 당으로 바뀐다',
			'- **알코올 발효**: 당이 알코올로 바뀐다',
			'    1. 밑술',
			'    2. 덧술',
			'',
			'> 삼양주는 한 번 더 덧술을 한다.',
			'',
			'---',
			'',
			'[참고](https://naver.com) · [[고두밥]]'
		].join('\n');
		expect(roundtrip(source)).toBe(source);
	});
});

describe('표 라운드트립 (toHtml → DOM → fromDom)', () => {
	function roundtrip(md: string): string {
		const root = document.createElement('div');
		root.innerHTML = MarkdownConverter.toHtml(md);
		return MarkdownWriter.fromDom(root);
	}

	it('기본 표 왕복', () => {
		const src = '| 재료 | 양 |\n| --- | --- |\n| 쌀 | 1kg |\n| 물 | 1.5L |';
		expect(roundtrip(src)).toBe(src);
	});
	it('한 열 표 왕복', () => {
		const src = '| 재료 |\n| --- |\n| 쌀 |';
		expect(roundtrip(src)).toBe(src);
	});
	it('네 열 표 왕복', () => {
		const src = '| 가 | 나 | 다 | 라 |\n| --- | --- | --- | --- |\n| 1 | 2 | 3 | 4 |';
		expect(roundtrip(src)).toBe(src);
	});
	it('헤더만 있는 표 왕복', () => {
		const src = '| 재료 | 양 |\n| --- | --- |';
		expect(roundtrip(src)).toBe(src);
	});
	it('가운데·오른쪽 정렬 왕복', () => {
		const src = '| 재료 | 양 |\n| :---: | ---: |\n| 쌀 | 1kg |';
		expect(roundtrip(src)).toBe(src);
	});
	it('정렬이 열마다 다른 표 왕복', () => {
		const src = '| 가 | 나 | 다 |\n| --- | :---: | ---: |\n| 1 | 2 | 3 |';
		expect(roundtrip(src)).toBe(src);
	});
	it('왼쪽 정렬 표기(:---)는 기본 표기(---)로 정규화된다', () => {
		expect(roundtrip('| 가 |\n| :--- |\n| 나 |')).toBe('| 가 |\n| --- |\n| 나 |');
	});
	it('구분행의 대시 개수는 세 개로 정규화된다', () => {
		expect(roundtrip('| 가 |\n| ------- |\n| 나 |')).toBe('| 가 |\n| --- |\n| 나 |');
	});
	it('바깥 파이프가 없는 표기도 표로 정규화된다', () => {
		expect(roundtrip('가 | 나\n--- | ---\n1 | 2')).toBe('| 가 | 나 |\n| --- | --- |\n| 1 | 2 |');
	});
	it('셀 수가 부족한 본문 행은 빈 셀로 채워 정규화된다', () => {
		expect(roundtrip('| 가 | 나 |\n| --- | --- |\n| 다 |')).toBe(
			'| 가 | 나 |\n| --- | --- |\n| 다 |  |'
		);
	});
	it('빈 셀이 섞인 표 왕복', () => {
		const src = '| 가 | 나 |\n| --- | --- |\n| 다 |  |';
		expect(roundtrip(src)).toBe(src);
	});
	it('셀 안 강조·링크·위키링크 왕복', () => {
		const src = '| 항목 | 설명 |\n| --- | --- |\n| **당화** | [[고두밥]] [참고](https://naver.com) |';
		expect(roundtrip(src)).toBe(src);
	});
	it('셀 안 기울임·취소선·인라인 코드 왕복', () => {
		const src = '| 가 | 나 | 다 |\n| --- | --- | --- |\n| _기울임_ | ~~취소~~ | `코드` |';
		expect(roundtrip(src)).toBe(src);
	});
	it('이스케이프한 파이프 왕복', () => {
		const src = '| 기호 |\n| --- |\n| 가\\|나 |';
		expect(roundtrip(src)).toBe(src);
	});
	it('백슬래시가 든 셀 왕복', () => {
		const src = '| 경로 |\n| --- |\n| C:\\\\굽는방 |';
		expect(roundtrip(src)).toBe(src);
	});
	it('CJK 셀 안 볼드 왕복 (cjk-friendly)', () => {
		const src = '| 용어 |\n| --- |\n| **단행복합발효(單行複合醱酵)** |';
		expect(roundtrip(src)).toBe(src);
	});
	it('표와 다른 블록이 섞인 문서 왕복', () => {
		const src = [
			'## 배합',
			'',
			'| 재료 | 양 |',
			'| ---: | --- |',
			'| 쌀 | 1kg |',
			'',
			'> 물은 나중에 잡습니다.',
			'',
			'- 쌀은 멥쌀',
			'- 물은 정수',
			'',
			'---',
			'',
			'| 단계 | 기간 |',
			'| --- | --- |',
			'| 밑술 | 3일 |'
		].join('\n');
		expect(roundtrip(src)).toBe(src);
	});
});
