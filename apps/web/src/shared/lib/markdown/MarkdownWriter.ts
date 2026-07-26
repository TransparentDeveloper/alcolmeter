// 마크다운 "생성": 토큰 어휘(조각 빌더) + contenteditable DOM 직렬화.
// 이스케이프는 하지 않는다(v1 결정): [[slug]]·::youtube 평문 보존이 우선이고, 현행 textarea와 동일 동작.

class MarkdownWriter {
	// 인라인으로 삼키면 안 되는 태그. 여기 없는 태그는 인라인 취급이라 태그만 벗기고 내용을 이어붙인다.
	private static readonly BLOCK_TAGS = new Set([
		'P',
		'DIV',
		'H1',
		'H2',
		'H3',
		'H4',
		'H5',
		'H6',
		'UL',
		'OL',
		'LI',
		'HR',
		'BLOCKQUOTE',
		'PRE',
		'TABLE',
		'THEAD',
		'TBODY',
		'TR',
		'TH',
		'TD',
		'DL',
		'DT',
		'DD',
		'SECTION',
		'ARTICLE',
		'FIGURE',
		'FIGCAPTION'
	]);

	// 토큰 어휘(조각 빌더). fromDom 내부 전용이라 밖으로 열지 않는다.
	private static bold(text: string): string {
		return `**${text}**`;
	}
	private static italic(text: string): string {
		return `_${text}_`;
	}
	private static code(text: string): string {
		return `\`${text}\``;
	}
	private static strikethrough(text: string): string {
		return `~~${text}~~`;
	}
	private static link(text: string, href: string): string {
		return `[${text}](${href})`;
	}
	private static heading(level: number, text: string): string {
		return `${'#'.repeat(level)} ${text}`;
	}
	private static bulletItem(text: string): string {
		return `- ${text}`;
	}
	private static orderedItem(order: number, text: string): string {
		return `${order}. ${text}`;
	}
	private static blockquote(text: string): string {
		return `> ${text}`;
	}
	private static divider(): string {
		return '---';
	}

	// contenteditable 루트를 순회해 마크다운 문서로 직렬화한다. 빈 문서는 ''.
	static fromDom(root: HTMLElement): string {
		return MarkdownWriter.serializeBlocks(Array.from(root.childNodes))
			.filter((block) => block.trim().length > 0)
			.join('\n\n');
	}

	// 이하 fromDom 전용 private 헬퍼(밖에서 부르지 않는다).

	// 자식 목록을 블록 단위로 나눈다. 연속된 인라인은 문단 하나로 묶고, 블록은 블록 경로로 넘긴다.
	// execCommand가 만드는 '블록 안의 블록'을 문단으로 오인해 평문으로 뭉개지 않으려면 이 분기가 필요하다.
	private static serializeBlocks(nodes: Node[]): string[] {
		const blocks: string[] = [];
		let run: Node[] = [];
		function flushRun(): void {
			const text = MarkdownWriter.inlineOfNodes(run);
			if (text) blocks.push(text);
			run = [];
		}
		for (const node of nodes) {
			if (MarkdownWriter.isBlock(node)) {
				flushRun();
				blocks.push(...MarkdownWriter.serializeBlock(node));
			} else {
				run.push(node);
			}
		}
		flushRun();
		return blocks;
	}

	private static isBlock(node: Node): boolean {
		return (
			node.nodeType === Node.ELEMENT_NODE &&
			MarkdownWriter.BLOCK_TAGS.has((node as HTMLElement).tagName)
		);
	}

	private static serializeBlock(node: Node): string[] {
		if (node.nodeType !== Node.ELEMENT_NODE) return [];
		const el = node as HTMLElement;
		switch (el.tagName) {
			case 'H1':
			case 'H2':
			case 'H3':
			case 'H4': {
				const text = MarkdownWriter.inlineOf(el);
				return text ? [MarkdownWriter.heading(Number(el.tagName[1]), text)] : [];
			}
			case 'HR':
				return [MarkdownWriter.divider()];
			case 'UL':
				return [MarkdownWriter.serializeList(el, 0, 'ul')];
			case 'OL':
				return [MarkdownWriter.serializeList(el, 0, 'ol')];
			case 'BLOCKQUOTE': {
				// 문단이 여러 개면 빈 줄까지 인용 안에 있어야 하므로 줄 단위로 표시를 붙인다
				const inner = MarkdownWriter.serializeBlocks(Array.from(el.childNodes)).join('\n\n');
				if (!inner) return [];
				return [
					inner
						.split('\n')
						.map((line) => (line ? MarkdownWriter.blockquote(line) : '>'))
						.join('\n')
				];
			}
			// P·DIV(브라우저 기본 블록)·미지 블록: 블록 자식이 있으면 문단이 아니라 컨테이너다
			default: {
				const children = Array.from(el.childNodes);
				if (children.some((child) => MarkdownWriter.isBlock(child))) {
					return MarkdownWriter.serializeBlocks(children);
				}
				const text = MarkdownWriter.inlineOf(el);
				return text ? [text] : [];
			}
		}
	}

	// 자식 인라인 직렬화 + 정리: hard break 직후 공백 제거, 양끝 trim
	private static inlineOf(el: HTMLElement): string {
		return MarkdownWriter.inlineOfNodes(Array.from(el.childNodes));
	}

	private static inlineOfNodes(nodes: Node[]): string {
		return nodes
			.map((node) => MarkdownWriter.serializeInline(node))
			.join('')
			.replace(/ {2}\n +/g, '  \n')
			.trim();
	}

	private static serializeInline(node: Node): string {
		if (node.nodeType === Node.TEXT_NODE) {
			// 텍스트 노드의 개행·nbsp는 렌더링 규칙대로 공백 하나로 (개행은 <br>만이 만든다)
			return (node.textContent ?? '').replace(/\s+/g, ' ');
		}
		if (node.nodeType !== Node.ELEMENT_NODE) return '';
		const el = node as HTMLElement;
		const children = Array.from(el.childNodes)
			.map((child) => MarkdownWriter.serializeInline(child))
			.join('');
		switch (el.tagName) {
			case 'BR':
				return '  \n';
			case 'B':
			case 'STRONG':
				return MarkdownWriter.wrapMark(children, MarkdownWriter.bold);
			case 'I':
			case 'EM':
				return MarkdownWriter.wrapMark(children, MarkdownWriter.italic);
			case 'S':
			case 'STRIKE':
			case 'DEL':
				return MarkdownWriter.wrapMark(children, MarkdownWriter.strikethrough);
			case 'CODE':
				return MarkdownWriter.wrapMark(children, MarkdownWriter.code);
			case 'A': {
				const href = el.getAttribute('href') ?? '';
				return href && children ? MarkdownWriter.link(children, href) : children;
			}
			// span 등 미지 인라인은 태그를 버리고 내용만
			default:
				return children;
		}
	}

	// 가장자리 공백을 마크 밖으로: '**굵게 **'는 md에서 강조로 안 잡힌다
	private static wrapMark(children: string, wrap: (text: string) => string): string {
		const lead = children.match(/^\s*/)![0];
		const trail = children.match(/\s*$/)![0];
		const core = children.slice(lead.length, children.length - trail.length);
		return core ? lead + wrap(core) + trail : children;
	}

	// 중첩 목록 들여쓰기 4칸: ol 부모(콘텐츠 칼럼 3)에서도 CommonMark 중첩으로 인정되는 안전값
	private static serializeList(list: HTMLElement, depth: number, type: 'ul' | 'ol'): string {
		const lines: string[] = [];
		const indent = '    '.repeat(depth);
		// 항목의 두 번째 블록부터는 불릿 콘텐츠 칼럼(ul 2·ol 3)에 맞춰 들여쓴다
		const hang = indent + (type === 'ul' ? '  ' : '   ');
		let order = 1;
		for (const child of Array.from(list.children)) {
			// Chrome execCommand('indent')는 중첩 목록을 li 밖(목록 직계)에 만들기 때문에 depth+1 중첩으로 수용한다
			if (child.tagName === 'UL' || child.tagName === 'OL') {
				const nested = MarkdownWriter.serializeList(
					child as HTMLElement,
					depth + 1,
					child.tagName === 'UL' ? 'ul' : 'ol'
				);
				// 빈 항목뿐인 중첩(편집 중 li에 <br>만 남는 순간)은 개행 찌꺼기를 남기지 않는다
				if (nested) lines.push(nested);
				continue;
			}
			if (child.tagName !== 'LI') continue;
			const li = child as HTMLElement;
			// 첫 블록은 마커 줄에, 나머지는 빈 줄 + 들여쓰기로 잇는다
			let marked = false;
			function pushBlocks(blocks: string[]): void {
				for (const block of blocks) {
					if (marked) {
						lines.push('', ...block.split('\n').map((line) => hang + line));
						continue;
					}
					lines.push(
						indent +
							(type === 'ul'
								? MarkdownWriter.bulletItem(block)
								: MarkdownWriter.orderedItem(order++, block))
					);
					marked = true;
				}
			}
			// 중첩 목록은 만난 자리에서 depth+1로 처리해 DOM 순서를 지킨다
			let run: Node[] = [];
			for (const node of Array.from(li.childNodes)) {
				const tag = node.nodeType === Node.ELEMENT_NODE ? (node as HTMLElement).tagName : '';
				if (tag !== 'UL' && tag !== 'OL') {
					run.push(node);
					continue;
				}
				pushBlocks(MarkdownWriter.serializeBlocks(run));
				run = [];
				const nested = MarkdownWriter.serializeList(
					node as HTMLElement,
					depth + 1,
					tag === 'UL' ? 'ul' : 'ol'
				);
				if (nested) lines.push(nested);
			}
			pushBlocks(MarkdownWriter.serializeBlocks(run));
		}
		return lines.join('\n');
	}
}

export { MarkdownWriter };
