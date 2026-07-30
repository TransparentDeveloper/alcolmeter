/** @vitest-environment happy-dom */
import { describe, it, expect } from 'vitest';
import { TableGrid } from './TableGrid';
import { MarkdownWriter } from '$shared/lib/markdown';

// 주의: innerHTML은 한 줄로 쓴다(들여쓰기 개행이 텍스트 노드로 들어가는 것 방지)
function table(html: string): HTMLElement {
	const host = document.createElement('div');
	host.innerHTML = html;
	return host.firstElementChild as HTMLElement;
}

// 행마다 셀의 태그와 정렬을 한눈에 보기 위한 요약. 정렬 없는 셀은 태그만 남는다.
function shape(el: HTMLElement): string[] {
	return TableGrid.rows(el).map((row) =>
		TableGrid.cells(row)
			.map((cell) => {
				const align = cell.style.textAlign;
				return align ? `${cell.tagName.toLowerCase()}:${align}` : cell.tagName.toLowerCase();
			})
			.join(' ')
	);
}

function texts(el: HTMLElement): string[][] {
	return TableGrid.rows(el).map((row) =>
		TableGrid.cells(row).map((cell) => cell.textContent?.trim() ?? '')
	);
}

describe('TableGrid.create', () => {
	it('헤더 1행 + 본문 2행 × 3열로 만든다', () => {
		expect(shape(TableGrid.create())).toEqual(['th th th', 'td td td', 'td td td']);
	});
	it('헤더는 thead, 본문은 tbody에 담는다', () => {
		const created = TableGrid.create();
		expect(created.querySelectorAll('thead > tr')).toHaveLength(1);
		expect(created.querySelectorAll('tbody > tr')).toHaveLength(2);
	});
	it('빈 셀은 <br>로 채운다 (캐럿 진입 보장)', () => {
		const created = TableGrid.create();
		expect(TableGrid.cellAt(created, 0, 0)?.innerHTML).toBe('<br>');
		expect(TableGrid.cellAt(created, 1, 0)?.innerHTML).toBe('<br>');
	});
	it('만든 표는 정렬 표기 없이 빈 표 마크다운으로 직렬화된다', () => {
		const host = document.createElement('div');
		host.appendChild(TableGrid.create());
		expect(MarkdownWriter.fromDom(host)).toBe(
			'|  |  |  |\n| --- | --- | --- |\n|  |  |  |\n|  |  |  |'
		);
	});
});

describe('TableGrid.rows·cells·columnCount', () => {
	it('thead와 tbody의 행을 DOM 순서로 모은다', () => {
		const el = table(
			'<table><thead><tr><th>가</th></tr></thead><tbody><tr><td>나</td></tr><tr><td>다</td></tr></tbody></table>'
		);
		expect(texts(el)).toEqual([['가'], ['나'], ['다']]);
	});
	it('셀이 아닌 자식은 셀로 세지 않는다', () => {
		const el = table('<table><tr><td>가</td><td>나</td></tr></table>');
		// 파서는 tr 안의 비-셀 요소를 표 밖으로 밀어내므로 DOM으로 직접 끼워 넣는다
		TableGrid.rows(el)[0].appendChild(document.createElement('div'));
		expect(TableGrid.cells(TableGrid.rows(el)[0])).toHaveLength(2);
	});
	it('열 수는 가장 넓은 행에 맞춘다', () => {
		const el = table('<table><tr><th>가</th></tr><tr><td>나</td><td>다</td></tr></table>');
		expect(TableGrid.columnCount(el)).toBe(2);
	});
	it('행이 없는 표의 열 수는 0', () => {
		expect(TableGrid.columnCount(table('<table></table>'))).toBe(0);
	});
});

describe('TableGrid.alignOf·columnAlign', () => {
	it('정렬 스타일이 없으면 왼쪽', () => {
		const el = table('<table><tr><th>가</th></tr></table>');
		expect(TableGrid.alignOf(TableGrid.cellAt(el, 0, 0)!)).toBe('left');
	});
	it('가운데·오른쪽을 읽는다', () => {
		const el = table(
			'<table><tr><th style="text-align:center">가</th><th style="text-align:right">나</th></tr></table>'
		);
		expect(TableGrid.alignOf(TableGrid.cellAt(el, 0, 0)!)).toBe('center');
		expect(TableGrid.alignOf(TableGrid.cellAt(el, 0, 1)!)).toBe('right');
	});
	it('GFM에 없는 정렬 값은 왼쪽으로 떨어뜨린다', () => {
		const el = table('<table><tr><th style="text-align:justify">가</th></tr></table>');
		expect(TableGrid.alignOf(TableGrid.cellAt(el, 0, 0)!)).toBe('left');
	});
	it('셀이 없으면 왼쪽', () => {
		expect(TableGrid.alignOf(undefined)).toBe('left');
	});
	it('열 정렬은 헤더 행에서만 읽는다', () => {
		const el = table(
			'<table><tr><th>가</th></tr><tr><td style="text-align:right">나</td></tr></table>'
		);
		expect(TableGrid.columnAlign(el, 0)).toBe('left');
	});
	it('헤더에 없는 열의 정렬은 왼쪽', () => {
		const el = table('<table><tr><th>가</th></tr><tr><td>나</td><td>다</td></tr></table>');
		expect(TableGrid.columnAlign(el, 1)).toBe('left');
	});
});

describe('TableGrid.position·cellAt', () => {
	const el = table(
		'<table><thead><tr><th>가</th><th>나</th></tr></thead><tbody><tr><td>다</td><td>라</td></tr></tbody></table>'
	);

	it('셀의 행·열 좌표를 낸다 (thead·tbody를 통틀어 센다)', () => {
		expect(TableGrid.position(el, TableGrid.cellAt(el, 0, 1)!)).toEqual({ row: 0, col: 1 });
		expect(TableGrid.position(el, TableGrid.cellAt(el, 1, 0)!)).toEqual({ row: 1, col: 0 });
	});
	it('셀 안쪽 요소로도 좌표를 찾는다', () => {
		const cell = TableGrid.cellAt(el, 1, 1)!;
		cell.innerHTML = '<b>라</b>';
		expect(TableGrid.position(el, cell.firstElementChild as HTMLElement)).toEqual({
			row: 1,
			col: 1
		});
	});
	it('표에 없는 셀은 좌표가 없다', () => {
		expect(TableGrid.position(el, document.createElement('td'))).toEqual({ row: -1, col: -1 });
	});
	it('범위 밖 좌표는 null', () => {
		expect(TableGrid.cellAt(el, 9, 0)).toBeNull();
		expect(TableGrid.cellAt(el, 0, 9)).toBeNull();
	});
});

describe('TableGrid.insertRowAfter', () => {
	it('본문 행 아래에 같은 열 수의 빈 행을 넣는다', () => {
		const el = table(
			'<table><thead><tr><th>가</th><th>나</th></tr></thead><tbody><tr><td>다</td><td>라</td></tr></tbody></table>'
		);
		TableGrid.insertRowAfter(el, 1);
		expect(texts(el)).toEqual([
			['가', '나'],
			['다', '라'],
			['', '']
		]);
	});
	it('헤더 행이 기준이면 본문 맨 앞으로 넣는다', () => {
		const el = table(
			'<table><thead><tr><th>가</th></tr></thead><tbody><tr><td>나</td></tr></tbody></table>'
		);
		TableGrid.insertRowAfter(el, 0);
		expect(texts(el)).toEqual([['가'], [''], ['나']]);
		expect(el.querySelectorAll('thead > tr')).toHaveLength(1);
	});
	it('본문 중간 행이 기준이면 바로 아래에 넣는다', () => {
		const el = table(
			'<table><tr><th>가</th></tr><tr><td>나</td></tr><tr><td>다</td></tr></table>'
		);
		TableGrid.insertRowAfter(el, 1);
		expect(texts(el)).toEqual([['가'], ['나'], [''], ['다']]);
	});
	it('새 행은 td로 만든다 (헤더 아래여도 헤더가 아니다)', () => {
		const el = table('<table><thead><tr><th>가</th></tr></thead></table>');
		TableGrid.insertRowAfter(el, 0);
		expect(shape(el)).toEqual(['th', 'td']);
	});
	it('tbody가 없으면 만들어 붙인다', () => {
		const el = table('<table><thead><tr><th>가</th></tr></thead></table>');
		TableGrid.insertRowAfter(el, 0);
		expect(el.querySelectorAll('tbody > tr')).toHaveLength(1);
	});
	it('열 정렬을 새 행에 이어받는다', () => {
		const el = table(
			'<table><tr><th>가</th><th style="text-align:center">나</th><th style="text-align:right">다</th></tr></table>'
		);
		TableGrid.insertRowAfter(el, 0);
		expect(shape(el)[1]).toBe('td td:center td:right');
	});
	it('행마다 셀 수가 어긋나면 가장 넓은 행에 맞춘다', () => {
		const el = table('<table><tr><th>가</th></tr><tr><td>나</td><td>다</td></tr></table>');
		TableGrid.insertRowAfter(el, 1);
		expect(texts(el)[2]).toEqual(['', '']);
	});
	it('없는 행이 기준이면 아무것도 하지 않는다', () => {
		const el = table('<table><tr><th>가</th></tr></table>');
		TableGrid.insertRowAfter(el, 5);
		expect(TableGrid.rows(el)).toHaveLength(1);
	});
});

describe('TableGrid.canDeleteRow·canDeleteColumn', () => {
	it('본문이 두 행 이상이면 지울 수 있다', () => {
		const el = table(
			'<table><tr><th>가</th></tr><tr><td>나</td></tr><tr><td>다</td></tr></table>'
		);
		expect(TableGrid.canDeleteRow(el, 1)).toBe(true);
		expect(TableGrid.canDeleteRow(el, 2)).toBe(true);
	});
	it('헤더 행은 지울 수 없다', () => {
		const el = table('<table><tr><th>가</th></tr><tr><td>나</td></tr><tr><td>다</td></tr></table>');
		expect(TableGrid.canDeleteRow(el, 0)).toBe(false);
	});
	it('행이 둘뿐이면(헤더 + 본문 1행) 지울 수 없다', () => {
		const el = table('<table><tr><th>가</th></tr><tr><td>나</td></tr></table>');
		expect(TableGrid.canDeleteRow(el, 1)).toBe(false);
	});
	it('열이 둘 이상이면 지울 수 있고, 하나뿐이면 지울 수 없다', () => {
		expect(TableGrid.canDeleteColumn(table('<table><tr><th>가</th><th>나</th></tr></table>'))).toBe(
			true
		);
		expect(TableGrid.canDeleteColumn(table('<table><tr><th>가</th></tr></table>'))).toBe(false);
	});
});

describe('TableGrid.deleteRow', () => {
	it('본문 행을 지운다', () => {
		const el = table(
			'<table><tr><th>가</th></tr><tr><td>나</td></tr><tr><td>다</td></tr></table>'
		);
		expect(TableGrid.deleteRow(el, 1)).toBe(true);
		expect(texts(el)).toEqual([['가'], ['다']]);
	});
	it('헤더 행은 지우지 않는다 (GFM 표의 필수 구성)', () => {
		const el = table(
			'<table><tr><th>가</th></tr><tr><td>나</td></tr><tr><td>다</td></tr></table>'
		);
		expect(TableGrid.deleteRow(el, 0)).toBe(false);
		expect(texts(el)).toEqual([['가'], ['나'], ['다']]);
	});
	it('본문 마지막 한 행은 남긴다 (행 최소 2개)', () => {
		const el = table(
			'<table><thead><tr><th>가</th></tr></thead><tbody><tr><td>나</td></tr></tbody></table>'
		);
		expect(TableGrid.deleteRow(el, 1)).toBe(false);
		expect(texts(el)).toEqual([['가'], ['나']]);
	});
	it('연달아 지워도 행 두 개에서 멈춘다', () => {
		const el = table(
			'<table><tr><th>가</th></tr><tr><td>나</td></tr><tr><td>다</td></tr></table>'
		);
		expect(TableGrid.deleteRow(el, 2)).toBe(true);
		expect(TableGrid.deleteRow(el, 1)).toBe(false);
		expect(texts(el)).toEqual([['가'], ['나']]);
	});
	it('없는 행은 지우지 않는다', () => {
		const el = table('<table><tr><th>가</th></tr><tr><td>나</td></tr><tr><td>다</td></tr></table>');
		expect(TableGrid.deleteRow(el, 7)).toBe(false);
	});
});

describe('TableGrid.insertColumnAfter', () => {
	it('모든 행의 기준 열 오른쪽에 빈 셀을 넣는다', () => {
		const el = table(
			'<table><thead><tr><th>가</th><th>나</th></tr></thead><tbody><tr><td>다</td><td>라</td></tr></tbody></table>'
		);
		TableGrid.insertColumnAfter(el, 0);
		expect(texts(el)).toEqual([
			['가', '', '나'],
			['다', '', '라']
		]);
	});
	it('헤더 행에는 th, 본문 행에는 td를 넣는다', () => {
		const el = table(
			'<table><thead><tr><th>가</th></tr></thead><tbody><tr><td>나</td></tr></tbody></table>'
		);
		TableGrid.insertColumnAfter(el, 0);
		expect(shape(el)).toEqual(['th th', 'td td']);
	});
	it('thead가 없어도 th로 시작하는 행은 헤더로 본다', () => {
		const el = table('<table><tr><th>가</th></tr><tr><td>나</td></tr></table>');
		TableGrid.insertColumnAfter(el, 0);
		expect(shape(el)).toEqual(['th th', 'td td']);
	});
	it('마지막 열이 기준이면 맨 끝에 붙인다', () => {
		const el = table('<table><tr><th>가</th><th>나</th></tr></table>');
		TableGrid.insertColumnAfter(el, 1);
		expect(texts(el)).toEqual([['가', '나', '']]);
	});
	it('셀이 부족한 행에도 맨 끝에 붙여 열 수를 맞춰 간다', () => {
		const el = table('<table><tr><th>가</th><th>나</th></tr><tr><td>다</td></tr></table>');
		TableGrid.insertColumnAfter(el, 1);
		expect(texts(el)).toEqual([
			['가', '나', ''],
			['다', '']
		]);
	});
	it('새 열은 정렬 없이 시작한다', () => {
		const el = table('<table><tr><th style="text-align:right">가</th></tr></table>');
		TableGrid.insertColumnAfter(el, 0);
		expect(shape(el)).toEqual(['th:right th']);
	});
});

describe('TableGrid.deleteColumn', () => {
	it('모든 행에서 그 열을 지운다', () => {
		const el = table(
			'<table><tr><th>가</th><th>나</th></tr><tr><td>다</td><td>라</td></tr></table>'
		);
		expect(TableGrid.deleteColumn(el, 0)).toBe(true);
		expect(texts(el)).toEqual([['나'], ['라']]);
	});
	it('마지막 남은 열은 지우지 않는다', () => {
		const el = table('<table><tr><th>가</th></tr><tr><td>나</td></tr></table>');
		expect(TableGrid.deleteColumn(el, 0)).toBe(false);
		expect(texts(el)).toEqual([['가'], ['나']]);
	});
	it('셀이 부족한 행은 건너뛴다', () => {
		const el = table('<table><tr><th>가</th><th>나</th></tr><tr><td>다</td></tr></table>');
		expect(TableGrid.deleteColumn(el, 1)).toBe(true);
		expect(texts(el)).toEqual([['가'], ['다']]);
	});
	it('없는 열은 지우지 않는다', () => {
		const el = table('<table><tr><th>가</th><th>나</th></tr></table>');
		expect(TableGrid.deleteColumn(el, 5)).toBe(false);
	});
});

describe('TableGrid.setColumnAlign', () => {
	it('열의 모든 셀에 같은 정렬을 심는다', () => {
		const el = table(
			'<table><thead><tr><th>가</th><th>나</th></tr></thead><tbody><tr><td>다</td><td>라</td></tr></tbody></table>'
		);
		TableGrid.setColumnAlign(el, 1, 'center');
		expect(shape(el)).toEqual(['th th:center', 'td td:center']);
	});
	it('왼쪽 정렬은 스타일을 지운다 (GFM 기본이라 표기를 남기지 않는다)', () => {
		const el = table('<table><tr><th style="text-align:right">가</th></tr></table>');
		TableGrid.setColumnAlign(el, 0, 'left');
		expect(TableGrid.cellAt(el, 0, 0)?.getAttribute('style')).toBeFalsy();
	});
	it('정렬을 바꾸면 이전 정렬을 덮어쓴다', () => {
		const el = table('<table><tr><th style="text-align:center">가</th></tr></table>');
		TableGrid.setColumnAlign(el, 0, 'right');
		expect(shape(el)).toEqual(['th:right']);
	});
	it('셀이 부족한 행은 건너뛴다', () => {
		const el = table('<table><tr><th>가</th><th>나</th></tr><tr><td>다</td></tr></table>');
		TableGrid.setColumnAlign(el, 1, 'right');
		expect(shape(el)).toEqual(['th th:right', 'td']);
	});
	it('심은 정렬이 구분행 표기로 직렬화된다', () => {
		const host = document.createElement('div');
		const el = host.appendChild(TableGrid.create());
		TableGrid.setColumnAlign(el, 1, 'center');
		TableGrid.setColumnAlign(el, 2, 'right');
		expect(MarkdownWriter.fromDom(host).split('\n')[1]).toBe('| --- | :---: | ---: |');
	});
});
