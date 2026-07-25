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
	inLink = $state(false);
	block = $state<EditorBlockType>('p');
	isEmpty = $state(true);
	link = $state<EditorLinkUi>({ ...CLOSED_LINK });

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
		this.bulletList = document.queryCommandState('insertUnorderedList');
		this.orderedList = document.queryCommandState('insertOrderedList');
		this.inLink = this.currentAnchor() !== null;
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
		this.exec('insertUnorderedList');
	}
	toggleOrderedList(): void {
		this.exec('insertOrderedList');
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

// 스킴 없으면 https:// 자동 프리픽스, http(s) 외 스킴은 거부(null)
function normalizeUrl(raw: string): string | null {
	const trimmed = raw.trim();
	if (!trimmed) return null;
	if (/^https?:\/\//i.test(trimmed)) return trimmed;
	if (/^[a-z][a-z0-9+.-]*:/i.test(trimmed)) return null;
	return `https://${trimmed}`;
}

export { EditorState };
export type { EditorBlockType, EditorLinkUi };
