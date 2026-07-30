// 표 DOM 기하(행·열 좌표, 정렬, 행·열 삽입·삭제). selection·execCommand를 모르는 순수 조작이라
// 떼어진 표 요소만 다루고, 실제 편집 반영은 EditorState가 맡는다.
// GFM 표 규약을 그대로 따른다: 헤더 행은 반드시 하나 있고, 정렬은 셀이 아니라 열의 성질이다.

type TableAlign = 'left' | 'center' | 'right';

class TableGrid {
	// 삽입 기본 크기: 헤더 1행 + 본문 2행 × 3열
	private static readonly COLUMNS = 3;
	private static readonly BODY_ROWS = 2;

	// 빈 셀은 <br>로 채운다: 완전히 빈 td는 클릭·캐럿 진입이 브라우저마다 어긋난다.
	private static readonly EMPTY = '<br>';

	// 새 표 하나를 떼어진 요소로 만든다.
	static create(): HTMLElement {
		const table = document.createElement('table');
		const head = table.appendChild(document.createElement('thead'));
		head.appendChild(TableGrid.buildRow('th', TableGrid.COLUMNS));
		const body = table.appendChild(document.createElement('tbody'));
		for (let index = 0; index < TableGrid.BODY_ROWS; index += 1) {
			body.appendChild(TableGrid.buildRow('td', TableGrid.COLUMNS));
		}
		return table;
	}

	static rows(table: HTMLElement): HTMLElement[] {
		return Array.from(table.querySelectorAll('tr'));
	}

	static cells(row: HTMLElement): HTMLElement[] {
		return Array.from(row.children).filter(
			(cell): cell is HTMLElement => cell.tagName === 'TH' || cell.tagName === 'TD'
		);
	}

	// 열 수는 가장 넓은 행에 맞춘다(편집 중 행마다 셀 수가 어긋날 수 있다).
	static columnCount(table: HTMLElement): number {
		return Math.max(0, ...TableGrid.rows(table).map((row) => TableGrid.cells(row).length));
	}

	static alignOf(cell: HTMLElement | undefined): TableAlign {
		const align = cell?.style.textAlign;
		return align === 'center' || align === 'right' ? align : 'left';
	}

	// 정렬은 열의 성질이라 헤더 행에서만 읽는다.
	static columnAlign(table: HTMLElement, col: number): TableAlign {
		const header = TableGrid.rows(table)[0];
		return TableGrid.alignOf(header ? TableGrid.cells(header)[col] : undefined);
	}

	// 노드가 놓인 (행, 열) 좌표. 셀 자신뿐 아니라 셀 안쪽 노드로도 찾는다(선택 지점이 곧
	// 셀이 아닐 수 있다). 표 밖이면 { row: -1, col: -1 }.
	static position(table: HTMLElement, node: Node): { row: number; col: number } {
		const rows = TableGrid.rows(table);
		const row = rows.findIndex((candidate) => candidate.contains(node));
		if (row < 0) return { row: -1, col: -1 };
		const col = TableGrid.cells(rows[row]).findIndex(
			(cell) => cell === node || cell.contains(node)
		);
		return { row, col };
	}

	static cellAt(table: HTMLElement, row: number, col: number): HTMLElement | null {
		const target = TableGrid.rows(table)[row];
		return target ? TableGrid.cells(target)[col] ?? null : null;
	}

	// 기준 행 아래에 빈 본문 행을 넣는다. 헤더 행이 기준이면 본문 맨 앞으로 들어간다
	// (헤더는 한 행뿐이므로 그 아래가 곧 본문 첫 행이다).
	static insertRowAfter(table: HTMLElement, row: number): void {
		const reference = TableGrid.rows(table)[row];
		if (!reference) return;
		const inserted = TableGrid.buildRow('td', TableGrid.columnCount(table));
		for (const [col, cell] of TableGrid.cells(inserted).entries()) {
			TableGrid.applyAlign(cell, TableGrid.columnAlign(table, col));
		}
		if (reference.parentElement?.tagName === 'THEAD') {
			const body = TableGrid.body(table);
			body.insertBefore(inserted, body.firstChild);
			return;
		}
		reference.parentElement?.insertBefore(inserted, reference.nextSibling);
	}

	// 헤더 행은 GFM 표의 필수 구성이라 지우지 않는다. 지웠으면 true.
	static deleteRow(table: HTMLElement, row: number): boolean {
		if (row <= 0) return false;
		const target = TableGrid.rows(table)[row];
		if (!target) return false;
		target.remove();
		return true;
	}

	// 기준 열 오른쪽에 빈 열을 넣는다. 헤더 행에는 th, 본문 행에는 td로.
	static insertColumnAfter(table: HTMLElement, col: number): void {
		for (const row of TableGrid.rows(table)) {
			const cells = TableGrid.cells(row);
			const header = row.parentElement?.tagName === 'THEAD' || cells[0]?.tagName === 'TH';
			const inserted = TableGrid.buildCell(header ? 'th' : 'td');
			row.insertBefore(inserted, cells[col]?.nextSibling ?? null);
		}
	}

	// 마지막 남은 열은 지우지 않는다(열 없는 표는 표가 아니다). 지웠으면 true.
	static deleteColumn(table: HTMLElement, col: number): boolean {
		if (TableGrid.columnCount(table) <= 1) return false;
		let removed = false;
		for (const row of TableGrid.rows(table)) {
			const target = TableGrid.cells(row)[col];
			if (!target) continue;
			target.remove();
			removed = true;
		}
		return removed;
	}

	// 열 전체에 같은 정렬을 심는다: 편집 중 모습과 조회 렌더 결과를 맞춘다.
	static setColumnAlign(table: HTMLElement, col: number, align: TableAlign): void {
		for (const row of TableGrid.rows(table)) {
			const cell = TableGrid.cells(row)[col];
			if (cell) TableGrid.applyAlign(cell, align);
		}
	}

	// 이하 내부 헬퍼.

	// 왼쪽은 GFM 기본이라 스타일을 남기지 않는다(남기면 구분행에 ':---'가 붙어 왕복마다 표기가 는다).
	private static applyAlign(cell: HTMLElement, align: TableAlign): void {
		if (align === 'left') cell.style.removeProperty('text-align');
		else cell.style.textAlign = align;
	}

	private static buildRow(tag: 'th' | 'td', width: number): HTMLElement {
		const row = document.createElement('tr');
		for (let index = 0; index < width; index += 1) row.appendChild(TableGrid.buildCell(tag));
		return row;
	}

	private static buildCell(tag: 'th' | 'td'): HTMLElement {
		const cell = document.createElement(tag);
		cell.innerHTML = TableGrid.EMPTY;
		return cell;
	}

	private static body(table: HTMLElement): HTMLElement {
		const existing = table.querySelector('tbody');
		if (existing) return existing as HTMLElement;
		return table.appendChild(document.createElement('tbody'));
	}
}

export { TableGrid };
export type { TableAlign };
