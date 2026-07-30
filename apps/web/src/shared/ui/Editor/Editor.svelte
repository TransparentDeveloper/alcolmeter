<script lang="ts">
	import { onMount, type Snippet } from 'svelte';
	import { MarkdownConverter } from '$shared/lib/markdown';
	import { EditorState } from './EditorState.svelte';
	import { setEditorContext } from './context';

	let {
		value = $bindable(''),
		placeholder = '',
		children
	}: {
		value?: string;
		placeholder?: string;
		children?: Snippet;
	} = $props();

	// 컨텍스트로 공유되는 에디터 로직. value는 단방향(에디터 → 부모):
	// 마운트 1회 seed 후 외부 value 변경은 반영하지 않는다(재시드 → 커서 소실 방지).
	const editor = new EditorState((md) => (value = md));
	setEditorContext(editor);

	let area: HTMLDivElement;

	onMount(() => {
		area.innerHTML = MarkdownConverter.toHtml(value) || '<p><br></p>';
		editor.attach(area);
		const sync = () => editor.syncFromSelection();
		document.addEventListener('selectionchange', sync);
		return () => document.removeEventListener('selectionchange', sync);
	});

	// 붙여넣기는 항상 평문: 외부 앱(워드·한글·카톡)의 서식 HTML·이미지 유입 차단
	function onPaste(e: ClipboardEvent) {
		e.preventDefault();
		const text = e.clipboardData?.getData('text/plain') ?? '';
		if (text) document.execCommand('insertText', false, text);
	}

	function onKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') editor.closeLinkPopover();
		// 표 안에서 Tab은 셀 이동(마지막 셀이면 행 추가)이고, Enter는 막는다:
		// GFM 셀은 인라인 한 줄만 담아서 셀 안 개행을 저장할 방법이 없다.
		if (editor.inTable) {
			if (e.key === 'Tab') {
				e.preventDefault();
				editor.moveCell(e.shiftKey ? -1 : 1);
				return;
			}
			if (e.key === 'Enter') {
				e.preventDefault();
				return;
			}
		}
		const isTab = e.key === 'Tab';
		if (!isTab && e.key !== ' ') return;
		// 마커('-'/숫자)만 있는 문단·목록 항목에서 Tab·Space는 그 타입의 목록(중첩) 전환이 우선.
		// 그 외 목록 안 Tab은 들여쓰기, 나머지는 기본 동작(포커스 이동·공백 입력)을 지킨다.
		if ((!isTab || !e.shiftKey) && editor.autoListFromMarker()) {
			e.preventDefault();
			return;
		}
		if (isTab && editor.inListItem) {
			e.preventDefault();
			if (e.shiftKey) editor.outdentList();
			else editor.indentList();
		}
	}
</script>

<div class="editor">
	{@render children?.()}
	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<div
		class="area"
		class:show-placeholder={editor.isEmpty && !editor.hasActiveFormat}
		bind:this={area}
		contenteditable="true"
		role="textbox"
		aria-multiline="true"
		tabindex="0"
		data-placeholder={placeholder}
		oninput={() => editor.emit()}
		onpaste={onPaste}
		onkeydown={onKeydown}
	></div>
</div>

<style>
	/* 툴바(헤더 스트립)+본문을 테두리 하나로 묶은 단일 컨트롤 */
	.editor {
		background: var(--ds-color-surface);
		border: var(--ds-border-width) solid var(--ds-color-border-2);
		border-radius: var(--ds-radius-md);
	}

	.area {
		position: relative;
		min-height: 24rem;
		padding: var(--ds-space-md);
		font-size: var(--ds-text-xs);
		line-height: var(--ds-leading-normal);
		color: var(--ds-color-ink-2);
	}
	.area:focus {
		outline: none;
	}
	.area.show-placeholder::before {
		content: attr(data-placeholder);
		position: absolute;
		top: var(--ds-space-md);
		left: var(--ds-space-md);
		color: var(--ds-color-ink-4);
		pointer-events: none;
	}

	/* 편집 중 타이포를 조회(WikiBody prose)와 시각적으로 맞춘다. 동적 DOM이라 :global 필요 */
	.area :global(h1) {
		font-family: var(--ds-font-display);
		font-size: var(--ds-text-xl);
		font-weight: var(--ds-weight-bold);
		letter-spacing: var(--ds-tracking-tight);
		color: var(--ds-color-ink-1);
		margin: var(--ds-space-xl) 0 var(--ds-space-sm);
	}
	.area :global(h2) {
		font-family: var(--ds-font-display);
		font-size: var(--ds-text-lg);
		font-weight: var(--ds-weight-bold);
		letter-spacing: var(--ds-tracking-tight);
		color: var(--ds-color-ink-1);
		margin: var(--ds-space-xl) 0 var(--ds-space-sm);
	}
	.area :global(h3) {
		font-family: var(--ds-font-display);
		font-size: var(--ds-text-base);
		font-weight: var(--ds-weight-bold);
		letter-spacing: var(--ds-tracking-tight);
		color: var(--ds-color-ink-1);
		margin: var(--ds-space-lg) 0 var(--ds-space-sm);
	}
	.area :global(h4) {
		font-family: var(--ds-font-display);
		font-size: var(--ds-text-sm);
		font-weight: var(--ds-weight-bold);
		letter-spacing: var(--ds-tracking-tight);
		color: var(--ds-color-ink-1);
		margin: var(--ds-space-lg) 0 var(--ds-space-sm);
	}
	.area :global(h1:first-child),
	.area :global(h2:first-child),
	.area :global(h3:first-child),
	.area :global(h4:first-child) {
		margin-top: 0;
	}
	.area :global(p) {
		margin: var(--ds-space-md) 0;
	}
	.area :global(p:first-child) {
		margin-top: 0;
	}
	.area :global(ul),
	.area :global(ol) {
		margin: var(--ds-space-md) 0;
		padding-left: 1.25rem;
		display: flex;
		flex-direction: column;
		gap: var(--ds-space-xs);
	}
	/* 중첩 목록: 부모 li와 한 덩어리로 보이게 상하 마진 제거 */
	.area :global(ul ul),
	.area :global(ul ol),
	.area :global(ol ul),
	.area :global(ol ol) {
		margin: 0;
	}
	.area :global(strong),
	.area :global(b) {
		font-weight: var(--ds-weight-bold);
		color: var(--ds-color-ink-1);
	}
	.area :global(a) {
		color: var(--ds-color-action);
		text-decoration: none;
		border-bottom: 1px solid var(--ds-color-border-3);
	}
	.area :global(hr) {
		margin: var(--ds-space-lg) 0;
		border: none;
		border-top: var(--ds-border-width) solid var(--ds-color-border-2);
	}
	.area :global(blockquote) {
		margin: var(--ds-space-lg) 0;
		padding: var(--ds-space-md) var(--ds-space-lg);
		background: var(--ds-color-spark-tint);
		border-left: 3px solid var(--ds-color-spark);
		border-radius: var(--ds-radius-sm);
		color: var(--ds-color-ink-1);
		font-size: var(--ds-text-sm);
	}
	.area :global(blockquote p) {
		margin: 0;
	}

	/* 표: 조회(Prose)는 밑줄만 긋지만 편집 중에는 격자 전체를 보여야 셀 경계와 빈 셀이 보인다 */
	.area :global(table) {
		width: 100%;
		/* 열 폭을 내용과 무관하게 고정한다: 기본값 auto면 한 셀에 글을 적는 동안
		   브라우저가 열 폭을 다시 나눠 다른 열이 밀려 좁아진다 */
		table-layout: fixed;
		border-collapse: collapse;
		margin: var(--ds-space-md) 0;
	}
	.area :global(th),
	.area :global(td) {
		padding: var(--ds-space-xs) var(--ds-space-sm);
		border: var(--ds-border-width) solid var(--ds-color-border-2);
		text-align: left;
		/* 폭이 고정이라 긴 낱말·URL은 줄바꿈해야 셀을 넘지 않는다 */
		overflow-wrap: break-word;
	}
	.area :global(th) {
		font-family: var(--ds-font-mono);
		font-weight: var(--ds-weight-medium);
		color: var(--ds-color-ink-3);
		background: var(--ds-color-hover);
	}
</style>
