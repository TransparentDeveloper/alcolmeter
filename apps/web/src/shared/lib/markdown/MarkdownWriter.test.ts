/** @vitest-environment happy-dom */
import { describe, it, expect } from 'vitest';
import { MarkdownWriter } from './MarkdownWriter';

// 주의: innerHTML은 한 줄로 쓴다(들여쓰기 개행이 텍스트 노드로 들어가는 것 방지)
function dom(html: string): HTMLElement {
	const root = document.createElement('div');
	root.innerHTML = html;
	return root;
}

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

// execCommand(목록 토글·formatBlock 등)는 블록을 다른 블록으로 감싼 DOM을 예사로 만든다.
// 이 모양을 문단으로 오인하면 제목·목록 마커가 소실되고 텍스트가 구분자 없이 접합된다.
describe('MarkdownWriter.fromDom 중첩 블록', () => {
	it('컨테이너(div)로 감싸도 안의 블록 구조를 보존한다', () => {
		expect(
			MarkdownWriter.fromDom(dom('<div><h3>소제목</h3><p>본문</p><ul><li>쌀</li></ul></div>'))
		).toBe('### 소제목\n\n본문\n\n- 쌀');
	});
	it('여러 겹 감싸도 보존한다', () => {
		expect(MarkdownWriter.fromDom(dom('<div><div><h3>소제목</h3></div><p>본문</p></div>'))).toBe(
			'### 소제목\n\n본문'
		);
	});
	it('인라인과 블록이 섞이면 인라인 구간을 문단으로 끊는다', () => {
		expect(MarkdownWriter.fromDom(dom('<div>앞 문장<h3>소제목</h3>뒤 문장</div>'))).toBe(
			'앞 문장\n\n### 소제목\n\n뒤 문장'
		);
	});
	it('인접한 블록끼리 접합해 강조 마크를 깨뜨리지 않는다', () => {
		expect(
			MarkdownWriter.fromDom(
				dom('<div><ul><li><b>당화</b></li><li><b>알코올 발효</b></li></ul></div>')
			)
		).toBe('- **당화**\n- **알코올 발효**');
	});
	it('문단이 여러 개인 인용구는 각 줄에 인용 표시를 붙인다', () => {
		expect(MarkdownWriter.fromDom(dom('<blockquote><p>첫 줄</p><p>둘째 줄</p></blockquote>'))).toBe(
			'> 첫 줄\n>\n> 둘째 줄'
		);
	});
	it('블록이 여러 개인 목록 항목은 들여쓰기로 잇는다', () => {
		expect(MarkdownWriter.fromDom(dom('<ul><li><p>첫 문단</p><p>둘째 문단</p></li></ul>'))).toBe(
			'- 첫 문단\n\n  둘째 문단'
		);
	});
	it('순서 목록 항목의 이어지는 블록은 번호 폭만큼 들여쓴다', () => {
		expect(MarkdownWriter.fromDom(dom('<ol><li><p>첫 문단</p><p>둘째 문단</p></li></ol>'))).toBe(
			'1. 첫 문단\n\n   둘째 문단'
		);
	});
	it('컨테이너 안의 구분선도 살린다', () => {
		expect(MarkdownWriter.fromDom(dom('<div><p>위</p><hr><p>아래</p></div>'))).toBe(
			'위\n\n---\n\n아래'
		);
	});
});

describe('MarkdownWriter.fromDom 복합 구조', () => {
	it('컨테이너 세 겹 + 구분선 + 목록', () => {
		expect(
			MarkdownWriter.fromDom(
				dom(
					'<div><div><p>여는 문단</p><div><h2>제목</h2><ul><li>항목</li></ul></div></div><hr><p>닫는 문단</p></div>'
				)
			)
		).toBe('여는 문단\n\n## 제목\n\n- 항목\n\n---\n\n닫는 문단');
	});
	it('컨테이너 안에서 hard break와 블록이 섞여도 각각 살린다', () => {
		expect(MarkdownWriter.fromDom(dom('<div>첫 줄<br>둘째 줄<h3>제목</h3>뒤 문장</div>'))).toBe(
			'첫 줄  \n둘째 줄\n\n### 제목\n\n뒤 문장'
		);
	});
	it('제목 안의 링크·강조를 보존한다', () => {
		expect(
			MarkdownWriter.fromDom(
				dom('<div><h2>제목 <a href="https://a.com">링크</a> <b>굵게</b></h2></div>')
			)
		).toBe('## 제목 [링크](https://a.com) **굵게**');
	});
	it('목록 항목이 div로 감싸여도 항목 하나로 본다', () => {
		expect(
			MarkdownWriter.fromDom(dom('<ul><li><div>항목1</div></li><li><div>항목2</div></li></ul>'))
		).toBe('- 항목1\n- 항목2');
	});
	it('목록 항목 안의 인용구는 콘텐츠 칼럼에 맞춰 들여쓴다', () => {
		expect(
			MarkdownWriter.fromDom(dom('<ul><li>항목<blockquote><p>인용</p></blockquote></li></ul>'))
		).toBe('- 항목\n\n  > 인용');
	});
	it('목록 항목 안의 블록은 DOM 순서를 지킨다 (중첩 목록을 뒤로 밀지 않는다)', () => {
		expect(
			MarkdownWriter.fromDom(dom('<ul><li>쌀<ul><li>멥쌀</li></ul><p>추가 설명</p></li></ul>'))
		).toBe('- 쌀\n    - 멥쌀\n\n  추가 설명');
	});
	it('인용구 안의 목록', () => {
		expect(MarkdownWriter.fromDom(dom('<blockquote><ul><li>가</li><li>나</li></ul></blockquote>'))).toBe(
			'> - 가\n> - 나'
		);
	});
	it('인용구 안의 제목과 중첩 인용구', () => {
		expect(
			MarkdownWriter.fromDom(
				dom('<blockquote><h3>제목</h3><blockquote><p>중첩</p></blockquote></blockquote>')
			)
		).toBe('> ### 제목\n>\n> > 중첩');
	});
	it('목록 3단 중첩 (ul → ul → ol)', () => {
		expect(
			MarkdownWriter.fromDom(dom('<ul><li>쌀<ul><li>멥쌀<ol><li>씻기</li></ol></li></ul></li></ul>'))
		).toBe('- 쌀\n    - 멥쌀\n        1. 씻기');
	});
	it('블록 사이 공백 텍스트 노드는 문단을 만들지 않는다', () => {
		expect(MarkdownWriter.fromDom(dom('<div>\n<h3>제목</h3>\n<p>본문</p>\n</div>'))).toBe(
			'### 제목\n\n본문'
		);
	});
	it('내용 없는 컨테이너는 사라진다', () => {
		expect(MarkdownWriter.fromDom(dom('<div><p><br></p><div>   </div></div>'))).toBe('');
	});
	// Chrome execCommand('indent')는 중첩 목록을 li 밖(목록 직계 자식)에 만든다.
	// 이 비표준 모양도 depth+1 중첩으로 받아줘야 저장 시 내용이 유실되지 않는다.
	it('목록 직계 자식 중첩 목록(Chrome 모양)도 중첩으로 직렬화한다', () => {
		expect(MarkdownWriter.fromDom(dom('<ul><li>쌀</li><ul><li>멥쌀</li></ul></ul>'))).toBe(
			'- 쌀\n    - 멥쌀'
		);
	});
	it('순서 목록의 직계 자식 중첩은 번호를 이어 센다', () => {
		expect(
			MarkdownWriter.fromDom(dom('<ol><li>씻기</li><ol><li>불리기</li></ol><li>찌기</li></ol>'))
		).toBe('1. 씻기\n    1. 불리기\n2. 찌기');
	});
	it('직계 자식 중첩의 목록 종류 혼합(ul 안 ol)', () => {
		expect(MarkdownWriter.fromDom(dom('<ul><li>쌀</li><ol><li>씻기</li></ol></ul>'))).toBe(
			'- 쌀\n    1. 씻기'
		);
	});
	it('직계 자식 중첩이 여러 단계여도 깊이를 누적한다', () => {
		expect(
			MarkdownWriter.fromDom(dom('<ul><li>가</li><ul><li>나</li><ul><li>다</li></ul></ul></ul>'))
		).toBe('- 가\n    - 나\n        - 다');
	});
	// 편집 중 li에 <br>만 남는 순간(중첩 직후 등)의 빈 목록이 개행 찌꺼기를 남기면 안 된다
	it('빈 항목만 있는 중첩 목록은 흔적 없이 사라진다', () => {
		expect(MarkdownWriter.fromDom(dom('<ol><li>하나</li><ol><li><br></li></ol></ol>'))).toBe(
			'1. 하나'
		);
		expect(MarkdownWriter.fromDom(dom('<ul><li>쌀<ul><li><br></li></ul></li></ul>'))).toBe('- 쌀');
	});
});

describe('MarkdownWriter.fromDom 표 구조', () => {
	it('헤더 행과 본문 행을 GFM 파이프 표로 쓴다', () => {
		expect(
			MarkdownWriter.fromDom(
				dom(
					'<table><thead><tr><th>재료</th><th>양</th></tr></thead><tbody><tr><td>쌀</td><td>1kg</td></tr><tr><td>물</td><td>1.5L</td></tr></tbody></table>'
				)
			)
		).toBe('| 재료 | 양 |\n| --- | --- |\n| 쌀 | 1kg |\n| 물 | 1.5L |');
	});
	it('thead가 없으면 첫 행을 헤더로 본다', () => {
		expect(
			MarkdownWriter.fromDom(
				dom(
					'<table><tbody><tr><td>가</td><td>나</td></tr><tr><td>다</td><td>라</td></tr></tbody></table>'
				)
			)
		).toBe('| 가 | 나 |\n| --- | --- |\n| 다 | 라 |');
	});
	it('헤더만 있고 본문 행이 없어도 구분행까지 쓴다', () => {
		expect(
			MarkdownWriter.fromDom(dom('<table><thead><tr><th>재료</th><th>양</th></tr></thead></table>'))
		).toBe('| 재료 | 양 |\n| --- | --- |');
	});
	it('한 행에 th와 td가 섞여도 셀로 함께 센다', () => {
		expect(MarkdownWriter.fromDom(dom('<table><tr><th>구분</th><td>값</td></tr></table>'))).toBe(
			'| 구분 | 값 |\n| --- | --- |'
		);
	});
	it('본문 행이 헤더보다 짧으면 빈 셀로 채운다', () => {
		expect(
			MarkdownWriter.fromDom(
				dom('<table><tr><th>가</th><th>나</th></tr><tr><td>다</td></tr></table>')
			)
		).toBe('| 가 | 나 |\n| --- | --- |\n| 다 |  |');
	});
	it('헤더가 본문보다 짧으면 열 수를 본문에 맞춰 넓힌다', () => {
		expect(
			MarkdownWriter.fromDom(
				dom('<table><tr><th>가</th></tr><tr><td>나</td><td>다</td></tr></table>')
			)
		).toBe('| 가 |  |\n| --- | --- |\n| 나 | 다 |');
	});
	it('셀이 전부 비어도 표 구조는 남는다', () => {
		expect(
			MarkdownWriter.fromDom(dom('<table><tr><th></th><th></th></tr><tr><td></td><td></td></tr></table>'))
		).toBe('|  |  |\n| --- | --- |\n|  |  |');
	});
	it('공백·nbsp만 있는 셀은 빈 셀로 본다', () => {
		expect(
			MarkdownWriter.fromDom(dom('<table><tr><td>가</td><td>&nbsp; </td></tr></table>'))
		).toBe('| 가 |  |\n| --- | --- |');
	});
	it('행이 없는 표는 흔적 없이 사라진다', () => {
		expect(MarkdownWriter.fromDom(dom('<table></table>'))).toBe('');
		expect(MarkdownWriter.fromDom(dom('<table><thead></thead><tbody></tbody></table>'))).toBe('');
	});
	it('문단 사이의 표도 블록으로 끊어 쓴다', () => {
		expect(
			MarkdownWriter.fromDom(dom('<p>위</p><table><tr><td>가</td></tr></table><p>아래</p>'))
		).toBe('위\n\n| 가 |\n| --- |\n\n아래');
	});
	it('컨테이너(div)로 감싼 표도 표로 살린다', () => {
		expect(
			MarkdownWriter.fromDom(dom('<div><h3>배합</h3><table><tr><td>가</td></tr></table></div>'))
		).toBe('### 배합\n\n| 가 |\n| --- |');
	});
	it('표가 연달아 있으면 각각 별개 블록으로 쓴다', () => {
		expect(
			MarkdownWriter.fromDom(
				dom('<table><tr><td>가</td></tr></table><table><tr><td>나</td></tr></table>')
			)
		).toBe('| 가 |\n| --- |\n\n| 나 |\n| --- |');
	});
});

describe('MarkdownWriter.fromDom 표 열 정렬', () => {
	it('가운데·오른쪽 정렬을 구분행 표기로 옮긴다 (왼쪽은 기본이라 표기 없음)', () => {
		expect(
			MarkdownWriter.fromDom(
				dom(
					'<table><thead><tr><th style="text-align:left">가</th><th style="text-align:center">나</th><th style="text-align:right">다</th></tr></thead></table>'
				)
			)
		).toBe('| 가 | 나 | 다 |\n| --- | :---: | ---: |');
	});
	it('정렬 없는 열은 기본 표기를 쓴다', () => {
		expect(
			MarkdownWriter.fromDom(
				dom('<table><tr><th>가</th><th style="text-align:center">나</th></tr></table>')
			)
		).toBe('| 가 | 나 |\n| --- | :---: |');
	});
	it('정렬은 헤더 행에서만 읽는다 (본문 셀 정렬은 무시)', () => {
		expect(
			MarkdownWriter.fromDom(
				dom('<table><tr><th>가</th></tr><tr><td style="text-align:right">나</td></tr></table>')
			)
		).toBe('| 가 |\n| --- |\n| 나 |');
	});
	it('헤더에 없는 열의 정렬은 기본 표기로 채운다', () => {
		expect(
			MarkdownWriter.fromDom(
				dom(
					'<table><tr><th style="text-align:right">가</th></tr><tr><td>나</td><td>다</td></tr></table>'
				)
			)
		).toBe('| 가 |  |\n| ---: | --- |\n| 나 | 다 |');
	});
});

describe('MarkdownWriter.fromDom 표 셀 내용', () => {
	it('인라인 서식과 링크를 보존한다', () => {
		expect(
			MarkdownWriter.fromDom(
				dom(
					'<table><tr><td><b>굵게</b></td><td><a href="https://naver.com">참고</a></td></tr></table>'
				)
			)
		).toBe('| **굵게** | [참고](https://naver.com) |\n| --- | --- |');
	});
	it('기울임·취소선·인라인 코드를 보존한다', () => {
		expect(
			MarkdownWriter.fromDom(
				dom('<table><tr><td><i>기울임</i></td><td><s>취소</s></td><td><code>코드</code></td></tr></table>')
			)
		).toBe('| _기울임_ | ~~취소~~ | `코드` |\n| --- | --- | --- |');
	});
	it('위키 문법 평문을 파괴하지 않는다', () => {
		expect(MarkdownWriter.fromDom(dom('<table><tr><td>[[고두밥]] 참고</td></tr></table>'))).toBe(
			'| [[고두밥]] 참고 |\n| --- |'
		);
	});
	it('파이프는 이스케이프해 표 구조를 지킨다', () => {
		expect(MarkdownWriter.fromDom(dom('<table><tr><td>가|나|다</td></tr></table>'))).toBe(
			'| 가\\|나\\|다 |\n| --- |'
		);
	});
	it('백슬래시를 먼저 이스케이프해 파이프 표기가 깨지지 않게 한다', () => {
		// 셀 평문이 '가\|나'면 파이프만 이스케이프하면 '가\\|나'가 되어 셀이 쪼개진다
		expect(MarkdownWriter.fromDom(dom('<table><tr><td>가\\|나</td></tr></table>'))).toBe(
			'| 가\\\\\\|나 |\n| --- |'
		);
		expect(MarkdownWriter.fromDom(dom('<table><tr><td>C:\\경로</td></tr></table>'))).toBe(
			'| C:\\\\경로 |\n| --- |'
		);
	});
	it('줄바꿈은 공백으로 눌린다 (GFM 셀은 개행 불가)', () => {
		expect(MarkdownWriter.fromDom(dom('<table><tr><td>윗줄<br>아랫줄</td></tr></table>'))).toBe(
			'| 윗줄 아랫줄 |\n| --- |'
		);
	});
	it('셀 안에 블록이 생겨도 한 셀로 눌러 담는다', () => {
		expect(
			MarkdownWriter.fromDom(dom('<table><tr><td><div>앞</div><div>뒤</div></td></tr></table>'))
		).toBe('| 앞 뒤 |\n| --- |');
	});
	it('셀 안 목록도 내용을 잃지 않고 한 셀로 눌러 담는다', () => {
		expect(
			MarkdownWriter.fromDom(dom('<table><tr><td><ul><li>가</li><li>나</li></ul></td></tr></table>'))
		).toBe('| - 가 - 나 |\n| --- |');
	});
	it('셀 안 span 등 미지 인라인은 태그를 버리고 내용만 남긴다', () => {
		expect(
			MarkdownWriter.fromDom(dom('<table><tr><td><span style="color:red">빨강</span></td></tr></table>'))
		).toBe('| 빨강 |\n| --- |');
	});
});
