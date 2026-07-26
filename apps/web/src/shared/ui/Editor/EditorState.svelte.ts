import { MarkdownWriter } from '$shared/lib/markdown';

type EditorBlockType = 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'blockquote';

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
	toggleBulletList(): void {
		this.toggleList('insertUnorderedList', 'UL');
	}
	toggleOrderedList(): void {
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
		this.exec('insertHorizontalRule');
	}
	setBlock(type: EditorBlockType): void {
		this.exec('formatBlock', `<${type}>`);
	}
	// 같은 블록이면 본문(p)으로 되돌리는 토글 (제목·소제목·인용구 버튼용)
	toggleBlock(type: EditorBlockType): void {
		this.setBlock(this.block === type ? 'p' : type);
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

	private currentAnchor(): HTMLElement | null {
		const sel = document.getSelection();
		let node: Node | null = sel?.anchorNode ?? null;
		while (node && node !== this.root) {
			if (node.nodeType === Node.ELEMENT_NODE && (node as HTMLElement).tagName === 'A') {
				return node as HTMLElement;
			}
			node = node.parentNode;
		}
		return null;
	}

	private currentParagraph(): HTMLElement | null {
		const sel = document.getSelection();
		let node: Node | null = sel?.anchorNode ?? null;
		while (node && node !== this.root) {
			if (node.nodeType === Node.ELEMENT_NODE) {
				const tag = (node as HTMLElement).tagName;
				if (tag === 'P' || tag === 'DIV') return node as HTMLElement;
			}
			node = node.parentNode;
		}
		return null;
	}

	private currentList(): HTMLElement | null {
		const sel = document.getSelection();
		let node: Node | null = sel?.anchorNode ?? null;
		while (node && node !== this.root) {
			if (node.nodeType === Node.ELEMENT_NODE) {
				const tag = (node as HTMLElement).tagName;
				if (tag === 'UL' || tag === 'OL') return node as HTMLElement;
			}
			node = node.parentNode;
		}
		return null;
	}

	private currentListItem(): HTMLElement | null {
		const sel = document.getSelection();
		let node: Node | null = sel?.anchorNode ?? null;
		while (node && node !== this.root) {
			if (node.nodeType === Node.ELEMENT_NODE && (node as HTMLElement).tagName === 'LI') {
				return node as HTMLElement;
			}
			node = node.parentNode;
		}
		return null;
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
export type { EditorBlockType, EditorLinkUi };
