/** @vitest-environment happy-dom */
import { describe, it, expect, beforeEach } from 'vitest';
import { EditorState, matchListMarker } from './EditorState.svelte';
import { TableGrid } from './TableGrid';

// 에디터 조작(execCommand·selection)은 happy-dom에 구현이 없어 유닛 범위 밖이다.
// 여기서는 Tab·Space 목록 전환의 판정 규칙(순수 로직)만 고정한다.
describe('matchListMarker', () => {
	it("'-'는 ul", () => {
		expect(matchListMarker('-')).toBe('ul');
	});
	it('숫자는 점 유무와 자릿수에 상관없이 ol', () => {
		expect(matchListMarker('1')).toBe('ol');
		expect(matchListMarker('1.')).toBe('ol');
		expect(matchListMarker('3.')).toBe('ol');
		expect(matchListMarker('12.')).toBe('ol');
	});
	it('마커가 아니면 null (본문을 삼키면 안 된다)', () => {
		expect(matchListMarker('')).toBeNull();
		expect(matchListMarker('--')).toBeNull();
		expect(matchListMarker('1)')).toBeNull();
		expect(matchListMarker('1. 항목')).toBeNull();
		expect(matchListMarker('- 항목')).toBeNull();
		expect(matchListMarker('가')).toBeNull();
		expect(matchListMarker('.')).toBeNull();
	});
});

// 표 조작은 execCommand로 표를 갈아끼운 뒤 캐럿과 툴바 상태를 다시 세우는 이음새가 핵심이다.
// happy-dom에 execCommand가 없으므로 이 흐름에 필요한 두 명령만 최소로 세워 둔다.
// (브라우저 구현을 모사하는 게 아니라, 갈아끼운 뒤 상태가 다시 계산되는지를 본다.)
function stubExecCommand(): void {
	document.execCommand = ((command: string, _ui?: boolean, value?: string) => {
		const sel = document.getSelection();
		const range = sel?.rangeCount ? sel.getRangeAt(0) : null;
		if (!range) return false;
		if (command === 'insertHTML') {
			range.deleteContents();
			const holder = document.createElement('div');
			holder.innerHTML = value ?? '';
			const fragment = document.createDocumentFragment();
			while (holder.firstChild) fragment.appendChild(holder.firstChild);
			range.insertNode(fragment);
			return true;
		}
		if (command === 'delete') {
			range.deleteContents();
			return true;
		}
		return true;
	}) as typeof document.execCommand;
	document.queryCommandState = (() => false) as typeof document.queryCommandState;
}

function caretIn(node: Node): void {
	const range = document.createRange();
	range.selectNodeContents(node);
	range.collapse(true);
	const sel = document.getSelection()!;
	sel.removeAllRanges();
	sel.addRange(range);
}

// 주의: innerHTML은 한 줄로 쓴다(들여쓰기 개행이 텍스트 노드로 들어가는 것 방지)
function mount(html: string): { editor: EditorState; root: HTMLElement; body: () => string } {
	document.body.innerHTML = '';
	const root = document.createElement('div');
	root.contentEditable = 'true';
	root.innerHTML = html;
	document.body.appendChild(root);
	let latest = '';
	const editor = new EditorState((md) => (latest = md));
	editor.attach(root);
	return { editor, root, body: () => latest };
}

function liveTable(root: HTMLElement): HTMLElement {
	return root.querySelector('table') as HTMLElement;
}

describe('EditorState 표 상태 동기화', () => {
	beforeEach(() => stubExecCommand());

	const THREE_ROWS =
		'<table><thead><tr><th>재료</th><th>양</th></tr></thead><tbody><tr><td>쌀</td><td>1kg</td></tr><tr><td>물</td><td>1.5L</td></tr></tbody></table>';

	it('표 밖에서는 표 상태가 전부 꺼져 있다', () => {
		const { editor, root } = mount('<p>본문</p>');
		caretIn(root.querySelector('p')!);
		editor.syncFromSelection();
		expect(editor.inTable).toBe(false);
		expect(editor.canDeleteTableRow).toBe(false);
		expect(editor.canDeleteTableColumn).toBe(false);
	});

	it('본문 행에 캐럿이 있으면 행 삭제가 열린다', () => {
		const { editor, root } = mount(THREE_ROWS);
		caretIn(TableGrid.cellAt(liveTable(root), 1, 0)!);
		editor.syncFromSelection();
		expect(editor.inTable).toBe(true);
		expect(editor.canDeleteTableRow).toBe(true);
	});

	it('헤더 행에 캐럿이 있으면 행 삭제가 막힌다', () => {
		const { editor, root } = mount(THREE_ROWS);
		caretIn(TableGrid.cellAt(liveTable(root), 0, 0)!);
		editor.syncFromSelection();
		expect(editor.inTable).toBe(true);
		expect(editor.canDeleteTableRow).toBe(false);
	});

	it('행을 지운 뒤 하한에 닿으면 행 삭제가 스스로 닫힌다', () => {
		const { editor, root } = mount(THREE_ROWS);
		caretIn(TableGrid.cellAt(liveTable(root), 1, 0)!);
		editor.syncFromSelection();

		editor.deleteTableRow();
		expect(TableGrid.rows(liveTable(root))).toHaveLength(2);
		expect(editor.canDeleteTableRow).toBe(false);
	});

	it('하한에서 한 번 더 눌러도 행이 줄지 않는다', () => {
		const { editor, root } = mount(THREE_ROWS);
		caretIn(TableGrid.cellAt(liveTable(root), 1, 0)!);
		editor.syncFromSelection();

		editor.deleteTableRow();
		editor.deleteTableRow();
		editor.deleteTableRow();
		expect(TableGrid.rows(liveTable(root))).toHaveLength(2);
	});

	it('열을 지운 뒤 한 열만 남으면 열 삭제가 스스로 닫힌다', () => {
		const { editor, root } = mount(THREE_ROWS);
		caretIn(TableGrid.cellAt(liveTable(root), 1, 0)!);
		editor.syncFromSelection();

		editor.deleteTableColumn();
		expect(TableGrid.columnCount(liveTable(root))).toBe(1);
		expect(editor.canDeleteTableColumn).toBe(false);

		editor.deleteTableColumn();
		expect(TableGrid.columnCount(liveTable(root))).toBe(1);
	});

	it('행을 넣으면 늘어난 표가 본문 마크다운에 반영된다', () => {
		const { editor, root, body } = mount(THREE_ROWS);
		caretIn(TableGrid.cellAt(liveTable(root), 1, 0)!);
		editor.syncFromSelection();

		editor.insertTableRow();
		expect(TableGrid.rows(liveTable(root))).toHaveLength(4);
		expect(body().split('\n')).toHaveLength(5);
	});

	it('열 정렬을 바꾸면 그 열 전체에 반영되고 상태가 따라온다', () => {
		const { editor, root, body } = mount(THREE_ROWS);
		caretIn(TableGrid.cellAt(liveTable(root), 0, 1)!);
		editor.syncFromSelection();

		editor.setColumnAlign('center');
		expect(editor.columnAlign).toBe('center');
		expect(body().split('\n')[1]).toBe('| --- | :---: |');
	});

	it('표를 지우면 표 상태가 꺼진다', () => {
		const { editor, root } = mount(THREE_ROWS);
		caretIn(TableGrid.cellAt(liveTable(root), 1, 0)!);
		editor.syncFromSelection();

		editor.deleteTable();
		expect(root.querySelector('table')).toBeNull();
		expect(editor.inTable).toBe(false);
	});

	it('갈아끼운 표에는 내부 표식이 남지 않는다', () => {
		const { editor, root } = mount(THREE_ROWS);
		caretIn(TableGrid.cellAt(liveTable(root), 1, 0)!);
		editor.syncFromSelection();

		editor.insertTableRow();
		expect(root.innerHTML).not.toContain('data-table-edit');
	});
});
