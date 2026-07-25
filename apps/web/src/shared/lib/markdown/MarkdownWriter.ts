// 마크다운 "생성": 토큰 어휘(조각 빌더) + contenteditable DOM 직렬화.
// 이스케이프는 하지 않는다(v1 결정): [[slug]]·::youtube 평문 보존이 우선이고, 현행 textarea와 동일 동작.

class MarkdownWriter {
	static bold(text: string): string {
		return `**${text}**`;
	}
	static italic(text: string): string {
		return `_${text}_`;
	}
	static code(text: string): string {
		return `\`${text}\``;
	}
	static strikethrough(text: string): string {
		return `~~${text}~~`;
	}
	static link(text: string, href: string): string {
		return `[${text}](${href})`;
	}
	static heading(level: number, text: string): string {
		return `${'#'.repeat(level)} ${text}`;
	}
	static bulletItem(text: string): string {
		return `- ${text}`;
	}
	static orderedItem(order: number, text: string): string {
		return `${order}. ${text}`;
	}
	static blockquote(text: string): string {
		return `> ${text}`;
	}
	static divider(): string {
		return '---';
	}

	// contenteditable 루트를 순회해 마크다운 문서로 직렬화한다. 빈 문서는 ''.
	static fromDom(root: HTMLElement): string {
		const blocks: string[] = [];
		for (const node of Array.from(root.childNodes)) {
			blocks.push(...MarkdownWriter.serializeBlock(node));
		}
		return blocks.filter((block) => block.trim().length > 0).join('\n\n');
	}

	// 이하 fromDom 전용 private 헬퍼(밖에서 부르지 않는다).

	private static serializeBlock(node: Node): string[] {
		if (node.nodeType === Node.TEXT_NODE) {
			const text = (node.textContent ?? '').trim();
			return text ? [text] : [];
		}
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
				const text = MarkdownWriter.inlineOf(el);
				return text ? [MarkdownWriter.blockquote(text)] : [];
			}
			// P·DIV(브라우저 기본 블록)·미지 블록은 전부 문단으로
			default: {
				const text = MarkdownWriter.inlineOf(el);
				return text ? [text] : [];
			}
		}
	}

	// 자식 인라인 직렬화 + 정리: hard break 직후 공백 제거, 양끝 trim
	private static inlineOf(el: HTMLElement): string {
		return Array.from(el.childNodes)
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
		let order = 1;
		for (const child of Array.from(list.children)) {
			if (child.tagName !== 'LI') continue;
			const li = child as HTMLElement;
			const inline = Array.from(li.childNodes)
				.filter(
					(n) =>
						!(n.nodeType === Node.ELEMENT_NODE && ['UL', 'OL'].includes((n as HTMLElement).tagName))
				)
				.map((n) => MarkdownWriter.serializeInline(n))
				.join('')
				.replace(/ {2}\n +/g, '  \n')
				.trim();
			if (inline) {
				lines.push(
					indent +
						(type === 'ul'
							? MarkdownWriter.bulletItem(inline)
							: MarkdownWriter.orderedItem(order++, inline))
				);
			}
			for (const sub of Array.from(li.children)) {
				if (sub.tagName === 'UL') {
					lines.push(MarkdownWriter.serializeList(sub as HTMLElement, depth + 1, 'ul'));
				} else if (sub.tagName === 'OL') {
					lines.push(MarkdownWriter.serializeList(sub as HTMLElement, depth + 1, 'ol'));
				}
			}
		}
		return lines.join('\n');
	}
}

export { MarkdownWriter };
