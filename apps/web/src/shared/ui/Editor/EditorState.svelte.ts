import { MarkdownWriter } from '$shared/lib/markdown';
import { TableGrid, type TableAlign } from './TableGrid';

type EditorBlockType = 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'blockquote';

// 표를 교체한 뒤 새 표를 되찾는 표식. insertHTML이 노드를 갈아끼워 참조가 끊기기 때문이다.
const TABLE_MARK = 'data-table-edit';

interface EditorLinkUi {
	open: boolean;
	armed: boolean;
	editing: boolean;
	href: string;
	top: number;
	left: number;
}

const CLOSED_LINK: EditorLinkUi = {
	open: false,
	armed: false,
	editing: false,
	href: '',
	top: 0,
	left: 0
};

// 에디터 로직: execCommand 캡슐화 + 선택 상태 추적 + 마크다운 직렬화.
// UI(툴바 아이템)는 컨텍스트로 이 인스턴스를 받아 메서드만 호출한다.
// execCommand는 deprecated지만 현행 전 브라우저에서 동작하고 네이티브 undo가 따라온다.
// 여기 캡슐화돼 있어 Selection API 수동 구현으로 교체해도 UI는 불변.
class EditorState {
	bold = $state(false);
	italic = $state(false);
	strike = $state(false);
	bulletList = $state(false);
	orderedList = $state(false);
	inListItem = $state(false);
	inLink = $state(false);
	block = $state<EditorBlockType>('p');
	isEmpty = $state(true);
	link = $state<EditorLinkUi>({ ...CLOSED_LINK });
	// 표 상태: 툴바가 표 전용 컨트롤을 이 값으로 여닫고 버튼을 비활성한다
	inTable = $state(false);
	canDeleteTableRow = $state(false);
	canDeleteTableColumn = $state(false);
	columnAlign = $state<TableAlign>('left');

	// 서식(툴바 버튼) 상태가 하나라도 켜져 있으면 true. 빈 에디터라도 서식이 켜졌으면
	// 커서 자리에 마커·스타일이 이미 보이므로 플레이스홀더를 감추는 데 쓴다.
	get hasActiveFormat(): boolean {
		return (
			this.bold ||
			this.italic ||
			this.strike ||
			this.bulletList ||
			this.orderedList ||
			this.inLink ||
			this.block !== 'p'
		);
	}

	private root: HTMLElement | null = null;
	private savedRange: Range | null = null;
	private readonly onChange: (md: string) => void;

	constructor(onChange: (md: string) => void) {
		this.onChange = onChange;
	}

	attach(root: HTMLElement): void {
		this.root = root;
		document.execCommand('defaultParagraphSeparator', false, 'p');
		this.isEmpty = MarkdownWriter.fromDom(root).length === 0;
	}

	// contenteditable input마다 호출: md 직렬화 → 소비자로 (단방향: 에디터 → 부모)
	emit(): void {
		if (!this.root) return;
		const md = MarkdownWriter.fromDom(this.root);
		this.isEmpty = md.length === 0;
		this.onChange(md);
	}

	// document selectionchange마다 호출: 툴바 활성 상태 동기화
	syncFromSelection(): void {
		const sel = document.getSelection();
		if (!this.root || !sel?.anchorNode || !this.root.contains(sel.anchorNode)) return;
		this.bold = document.queryCommandState('bold');
		this.italic = document.queryCommandState('italic');
		this.strike = document.queryCommandState('strikeThrough');
		// 목록 상태는 queryCommandState를 쓰지 않는다: 중첩에서 바깥 목록까지 잡아
		// ol 안 중첩 ul에서 둘 다 true가 된다. 가장 가까운 목록의 타입으로 판정한다.
		const list = this.currentList();
		this.bulletList = list?.tagName === 'UL';
		this.orderedList = list?.tagName === 'OL';
		this.inLink = this.currentAnchor() !== null;
		this.inListItem = this.currentListItem() !== null;
		this.block = this.currentBlock();
		this.syncTableFromSelection();
		// 링크 armed: 비어있지 않은 선택이 생기면 그 자리에서 팝오버
		if (this.link.armed && !sel.isCollapsed) this.openLinkPopover();
	}

	toggleBold(): void {
		this.exec('bold');
	}
	toggleItalic(): void {
		this.exec('italic');
	}
	toggleStrike(): void {
		this.exec('strikeThrough');
	}
	// 표 셀 안에서는 블록을 만들지 않는다: GFM 셀은 인라인 한 줄만 담아서, 셀에 생긴 목록·제목·
	// 구분선은 저장할 때 표기가 평문으로 눌려 내용이 뭉개진다.
	toggleBulletList(): void {
		if (this.currentCell()) return;
		this.toggleList('insertUnorderedList', 'UL');
	}
	toggleOrderedList(): void {
		if (this.currentCell()) return;
		this.toggleList('insertOrderedList', 'OL');
	}
	// 목록 항목 안에서만 동작(밖이면 no-op이라 blockquote 오염 없음).
	// 첫 항목 들여쓰기는 부모 없는 고아 중첩을 만들므로 막는다 (일반 에디터 관례).
	indentList(): void {
		const li = this.currentListItem();
		if (!li || !li.previousElementSibling) return;
		this.exec('indent');
	}
	outdentList(): void {
		if (!this.currentListItem()) return;
		this.exec('outdent');
	}
	// Chromium InsertListCommand는 선택 범위의 항목만 타입을 바꿔서, 캐럿만 두고 다른 타입
	// 버튼을 누르면 그 항목 하나만 바뀌며 목록이 쪼개진다. 다른 타입 목록 안이면 가장 가까운
	// 목록(중첩이면 그 레벨) 전체를 선택해 한 번의 execCommand로 통째 전환한다(undo 한 단계 유지).
	// 같은 타입(해제)과 목록 밖(생성)은 엔진 기본 동작이 옳으므로 그대로 둔다.
	private toggleList(command: string, targetTag: 'UL' | 'OL'): void {
		const list = this.currentList();
		if (!list || list.tagName === targetTag) {
			this.exec(command);
			return;
		}
		// 전환 캐럿 복원용 좌표: InsertListCommand가 노드를 갈아끼워 Range 복원이 안 되므로
		// '부모의 몇 번째 자식 목록, 몇 번째 li'를 기억했다가 새 목록의 같은 자리로 되돌린다.
		const li = this.currentListItem();
		const itemIndex = li ? Array.from(list.querySelectorAll<HTMLElement>('li')).indexOf(li) : -1;
		const parent = list.parentElement;
		const listIndex = parent ? Array.prototype.indexOf.call(parent.children, list) : -1;

		const sel = document.getSelection();
		const range = document.createRange();
		range.selectNodeContents(list);
		sel?.removeAllRanges();
		sel?.addRange(range);
		this.exec(command);

		const newList = parent && listIndex >= 0 ? parent.children[listIndex] : null;
		const items = newList ? Array.from(newList.querySelectorAll('li')) : [];
		const target = items[itemIndex] ?? items[items.length - 1];
		if (target && sel) {
			const caret = document.createRange();
			caret.selectNodeContents(target);
			caret.collapse(false);
			sel.removeAllRanges();
			sel.addRange(caret);
			this.syncFromSelection();
		}
	}

	// 내용 전체가 목록 마커('-'/숫자)면 마커를 지우고 해당 목록으로 전환한다. 전환했으면 true.
	// 문단이면 그 타입의 목록을 새로 만들고, 목록 항목 안이면 그 타입의 중첩 목록으로 들여쓴다.
	autoListFromMarker(): boolean {
		if (this.currentCell()) return false;
		const li = this.currentListItem();
		if (li) return this.nestListFromMarker(li);
		const block = this.currentParagraph();
		if (!block) return false;
		const type = matchListMarker((block.textContent ?? '').trim());
		if (!type) return false;
		this.deleteContents(block);
		this.exec(type === 'ol' ? 'insertOrderedList' : 'insertUnorderedList');
		return true;
	}

	// 목록 항목 안 마커: 마커를 지우고 들여쓴 뒤, 마커 타입이 부모와 다르면 중첩 목록만 전환한다.
	// 첫 항목은 부모 없는 고아 중첩이 되므로 들여쓰기와 같은 기준으로 막는다.
	private nestListFromMarker(li: HTMLElement): boolean {
		const type = matchListMarker((li.textContent ?? '').trim());
		if (!type || !li.previousElementSibling) return false;
		this.deleteContents(li);
		this.exec('indent');
		const targetTag = type === 'ol' ? 'OL' : 'UL';
		if (this.currentList()?.tagName !== targetTag) {
			this.toggleList(type === 'ol' ? 'insertOrderedList' : 'insertUnorderedList', targetTag);
		}
		return true;
	}

	private deleteContents(el: HTMLElement): void {
		const range = document.createRange();
		range.selectNodeContents(el);
		const sel = document.getSelection();
		sel?.removeAllRanges();
		sel?.addRange(range);
		document.execCommand('delete');
	}
	insertDivider(): void {
		if (this.currentCell()) return;
		this.exec('insertHorizontalRule');
	}
	setBlock(type: EditorBlockType): void {
		if (this.currentCell()) return;
		this.exec('formatBlock', `<${type}>`);
	}
	// 같은 블록이면 본문(p)으로 되돌리는 토글 (제목·소제목·인용구 버튼용)
	toggleBlock(type: EditorBlockType): void {
		this.setBlock(this.block === type ? 'p' : type);
	}

	// 표 삽입. 표가 본문 마지막이면 캐럿이 표 밖으로 나올 길이 없어서 뒤에 빈 문단을 함께 넣는다
	// (빈 문단은 직렬화에서 사라지므로 저장 결과엔 흔적이 없다). 중첩 표는 GFM에 없어 표 안에선 막는다.
	insertTable(): void {
		if (!this.root || this.currentCell()) return;
		this.root.focus();
		const sel = document.getSelection();
		if (!sel?.anchorNode || !this.root.contains(sel.anchorNode)) this.restoreSelection();
		const table = TableGrid.create();
		table.setAttribute(TABLE_MARK, '');
		document.execCommand('insertHTML', false, `${table.outerHTML}<p><br></p>`);
		this.settleTable(0, 0);
	}

	insertTableRow(): void {
		this.editTable((table, row, col) => {
			TableGrid.insertRowAfter(table, row);
			return { row: row + 1, col };
		});
	}

	deleteTableRow(): void {
		this.editTable((table, row, col) =>
			TableGrid.deleteRow(table, row)
				? { row: Math.min(row, TableGrid.rows(table).length - 1), col }
				: null
		);
	}

	insertTableColumn(): void {
		this.editTable((table, row, col) => {
			TableGrid.insertColumnAfter(table, col);
			return { row, col: col + 1 };
		});
	}

	deleteTableColumn(): void {
		this.editTable((table, row, col) =>
			TableGrid.deleteColumn(table, col)
				? { row, col: Math.min(col, TableGrid.columnCount(table) - 1) }
				: null
		);
	}

	setColumnAlign(align: TableAlign): void {
		this.editTable((table, row, col) => {
			TableGrid.setColumnAlign(table, col, align);
			return { row, col };
		});
	}

	deleteTable(): void {
		const table = this.currentTable();
		if (!this.root || !table) return;
		this.root.focus();
		this.selectNode(table);
		document.execCommand('delete');
		this.syncFromSelection();
		this.emit();
	}

	// Tab 이동. 마지막 셀에서 앞으로 가면 행을 새로 만들고 그 첫 셀로 간다(표 편집 관례).
	moveCell(offset: 1 | -1): void {
		const table = this.currentTable();
		const cell = this.currentCell();
		if (!table || !cell) return;
		const cells = TableGrid.rows(table).flatMap((row) => TableGrid.cells(row));
		const next = cells.indexOf(cell) + offset;
		if (next < 0) return;
		if (next >= cells.length) {
			this.editTable((clone, row) => {
				TableGrid.insertRowAfter(clone, row);
				return { row: row + 1, col: 0 };
			});
			return;
		}
		this.placeCaret(cells[next]);
		this.syncFromSelection();
	}

	// select처럼 포커스를 뺏는 컨트롤이 조작 직전에 호출해 선택을 보관한다
	saveSelection(): void {
		const sel = document.getSelection();
		if (sel?.rangeCount && this.root?.contains(sel.anchorNode)) {
			this.savedRange = sel.getRangeAt(0).cloneRange();
		}
	}

	// 링크 버튼: 링크 안이면 수정 팝오버, 선택 있으면 삽입 팝오버, 아니면 armed 토글
	requestLink(): void {
		const anchor = this.currentAnchor();
		const sel = document.getSelection();
		if (anchor) {
			const range = document.createRange();
			range.selectNodeContents(anchor);
			this.savedRange = range;
			this.openLinkPopover(anchor.getAttribute('href') ?? '', true);
		} else if (sel && !sel.isCollapsed && this.root?.contains(sel.anchorNode)) {
			this.openLinkPopover();
		} else {
			this.link = { ...CLOSED_LINK, armed: !this.link.armed };
		}
	}

	// 성공 시 true. 실패(잘못된 URL)면 false를 돌려 UI가 힌트를 띄운다.
	confirmLink(rawUrl: string): boolean {
		const url = normalizeUrl(rawUrl);
		if (!url) return false;
		this.root?.focus();
		this.restoreSelection();
		document.execCommand('createLink', false, url);
		this.closeLinkPopover();
		this.emit();
		return true;
	}

	unlink(): void {
		this.root?.focus();
		this.restoreSelection();
		document.execCommand('unlink');
		this.closeLinkPopover();
		this.emit();
	}

	closeLinkPopover(): void {
		this.link = { ...CLOSED_LINK };
	}

	private openLinkPopover(href = '', editing = false): void {
		if (!editing) {
			const sel = document.getSelection();
			if (!sel?.rangeCount) return;
			this.savedRange = sel.getRangeAt(0).cloneRange();
		}
		// 뷰포트(fixed) 좌표: 선택 영역 아래 + 좌우 클램프 (팝오버 폭 17rem≈272px)
		const rect = this.savedRange!.getBoundingClientRect();
		this.link = {
			open: true,
			armed: false,
			editing,
			href,
			top: rect.bottom + 6,
			left: Math.max(8, Math.min(rect.left, window.innerWidth - 288))
		};
	}

	private exec(command: string, value?: string): void {
		if (!this.root) return;
		this.root.focus();
		const sel = document.getSelection();
		if (!sel?.anchorNode || !this.root.contains(sel.anchorNode)) this.restoreSelection();
		document.execCommand(command, false, value);
		this.syncFromSelection();
		this.emit();
	}

	private restoreSelection(): void {
		if (!this.savedRange) return;
		const sel = document.getSelection();
		sel?.removeAllRanges();
		sel?.addRange(this.savedRange);
	}

	// 표 구조 변경은 표 전체를 새 HTML로 교체한다: execCommand 경로라 네이티브 undo가 따라오고,
	// 노드가 갈아끼워져 Range 복원이 안 되므로 캐럿은 (행, 열) 좌표로 되돌린다.
	// mutate가 null을 돌려주면(헤더 행 삭제 등 거부) 아무것도 바꾸지 않는다.
	private editTable(
		mutate: (table: HTMLElement, row: number, col: number) => { row: number; col: number } | null
	): void {
		const cell = this.currentCell();
		const table = this.currentTable();
		if (!this.root || !cell || !table) return;
		const { row, col } = TableGrid.position(table, cell);
		if (row < 0 || col < 0) return;
		const next = table.cloneNode(true) as HTMLElement;
		const caret = mutate(next, row, col);
		if (!caret) return;
		next.setAttribute(TABLE_MARK, '');
		this.root.focus();
		this.selectNode(table);
		document.execCommand('insertHTML', false, next.outerHTML);
		this.settleTable(caret.row, caret.col);
	}

	// insertHTML 직후: 표식으로 새 표를 찾아 표식을 떼고 캐럿을 (행, 열) 셀로 되돌린다.
	private settleTable(row: number, col: number): void {
		const table = this.root?.querySelector<HTMLElement>(`[${TABLE_MARK}]`);
		table?.removeAttribute(TABLE_MARK);
		const cell = table ? TableGrid.cellAt(table, row, col) : null;
		if (cell) this.placeCaret(cell);
		this.syncFromSelection();
		this.emit();
	}

	private syncTableFromSelection(): void {
		const table = this.currentTable();
		const cell = this.currentCell();
		const { row, col } = table && cell ? TableGrid.position(table, cell) : { row: -1, col: -1 };
		if (!table || row < 0 || col < 0) {
			this.inTable = false;
			this.canDeleteTableRow = false;
			this.canDeleteTableColumn = false;
			this.columnAlign = 'left';
			return;
		}
		this.inTable = true;
		this.canDeleteTableRow = TableGrid.canDeleteRow(table, row);
		this.canDeleteTableColumn = TableGrid.canDeleteColumn(table);
		this.columnAlign = TableGrid.columnAlign(table, col);
	}

	private selectNode(node: Node): void {
		const range = document.createRange();
		range.selectNode(node);
		const sel = document.getSelection();
		sel?.removeAllRanges();
		sel?.addRange(range);
	}

	private placeCaret(el: HTMLElement): void {
		const range = document.createRange();
		range.selectNodeContents(el);
		range.collapse(true);
		const sel = document.getSelection();
		sel?.removeAllRanges();
		sel?.addRange(range);
	}

	// 선택 지점에서 루트까지 올라가며 조건에 맞는 가장 가까운 요소를 찾는다.
	private closest(match: (tag: string) => boolean): HTMLElement | null {
		const sel = document.getSelection();
		let node: Node | null = sel?.anchorNode ?? null;
		while (node && node !== this.root) {
			if (node.nodeType === Node.ELEMENT_NODE && match((node as HTMLElement).tagName)) {
				return node as HTMLElement;
			}
			node = node.parentNode;
		}
		return null;
	}

	private currentAnchor(): HTMLElement | null {
		return this.closest((tag) => tag === 'A');
	}

	private currentParagraph(): HTMLElement | null {
		return this.closest((tag) => tag === 'P' || tag === 'DIV');
	}

	private currentList(): HTMLElement | null {
		return this.closest((tag) => tag === 'UL' || tag === 'OL');
	}

	private currentListItem(): HTMLElement | null {
		return this.closest((tag) => tag === 'LI');
	}

	private currentCell(): HTMLElement | null {
		return this.closest((tag) => tag === 'TH' || tag === 'TD');
	}

	private currentTable(): HTMLElement | null {
		return this.closest((tag) => tag === 'TABLE');
	}

	private currentBlock(): EditorBlockType {
		const sel = document.getSelection();
		let node: Node | null = sel?.anchorNode ?? null;
		while (node && node !== this.root) {
			if (node.nodeType === Node.ELEMENT_NODE) {
				const tag = (node as HTMLElement).tagName;
				if (tag === 'BLOCKQUOTE') return 'blockquote';
				if (tag === 'H1' || tag === 'H2' || tag === 'H3' || tag === 'H4') {
					return tag.toLowerCase() as EditorBlockType;
				}
			}
			node = node.parentNode;
		}
		return 'p';
	}
}

// 목록 전환 마커: '-'는 ul, 숫자(점 생략 가능, 예: 1·1.·12.)는 ol. 그 외 null.
function matchListMarker(text: string): 'ul' | 'ol' | null {
	if (text === '-') return 'ul';
	if (/^\d+\.?$/.test(text)) return 'ol';
	return null;
}

// 스킴 없으면 https:// 자동 프리픽스, http(s) 외 스킴은 거부(null)
function normalizeUrl(raw: string): string | null {
	const trimmed = raw.trim();
	if (!trimmed) return null;
	if (/^https?:\/\//i.test(trimmed)) return trimmed;
	if (/^[a-z][a-z0-9+.-]*:/i.test(trimmed)) return null;
	return `https://${trimmed}`;
}

export { EditorState, matchListMarker };
export type { EditorBlockType, EditorLinkUi, TableAlign };
