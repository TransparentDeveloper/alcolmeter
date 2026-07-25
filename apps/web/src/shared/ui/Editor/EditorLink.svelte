<script lang="ts">
	import EditorButton from './EditorButton.svelte';
	import { getEditorContext } from './context';

	const editor = getEditorContext();

	let url = $state('');
	let invalid = $state(false);
	let inputEl: HTMLInputElement | undefined = $state();

	// 팝오버가 열릴 때 기존 href를 채우고 입력에 포커스
	$effect(() => {
		if (editor.link.open) {
			url = editor.link.href;
			invalid = false;
			inputEl?.focus();
		}
	});

	function confirm() {
		invalid = !editor.confirmLink(url);
	}

	function onkeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			e.preventDefault(); // WikiForm 제출 방지
			confirm();
		}
		if (e.key === 'Escape') editor.closeLinkPopover();
	}
</script>

<EditorButton
	label="링크"
	active={editor.inLink || editor.link.armed}
	onclick={() => editor.requestLink()}
>
	<svg
		viewBox="0 0 16 16"
		width="16"
		height="16"
		aria-hidden="true"
		fill="none"
		stroke="currentColor"
		stroke-width="1.5"
		stroke-linecap="round"
	>
		<path d="M6.5 9.5 9.5 6.5" />
		<path d="M7 4.75 8.5 3.25a2.65 2.65 0 0 1 3.75 3.75L10.75 8.5" />
		<path d="M9 11.25 7.5 12.75a2.65 2.65 0 0 1-3.75-3.75L5.25 7.5" />
	</svg>
</EditorButton>

{#if editor.link.open}
	<div class="popover" style:top="{editor.link.top}px" style:left="{editor.link.left}px">
		<input bind:this={inputEl} bind:value={url} placeholder="https://…" {onkeydown} />
		{#if invalid}
			<p class="hint">http(s) 주소만 넣을 수 있어요.</p>
		{/if}
		<div class="row">
			{#if editor.link.editing}
				<button type="button" class="ghost" onclick={() => editor.unlink()}>해제</button>
			{/if}
			<button type="button" class="ghost" onclick={() => editor.closeLinkPopover()}>취소</button>
			<button type="button" class="primary" onclick={confirm}>삽입</button>
		</div>
	</div>
{/if}

<style>
	.popover {
		position: fixed;
		z-index: 10;
		display: grid;
		gap: var(--ds-space-xs);
		width: 17rem;
		padding: var(--ds-space-sm);
		background: var(--ds-color-surface);
		border: var(--ds-border-width) solid var(--ds-color-border-2);
		border-radius: var(--ds-radius-md);
		box-shadow: var(--ds-shadow-raised);
	}
	.popover input {
		font: inherit;
		font-size: var(--ds-text-sm);
		color: var(--ds-color-ink-1);
		background: var(--ds-color-surface);
		border: var(--ds-border-width) solid var(--ds-color-border-2);
		border-radius: var(--ds-radius-sm);
		padding: var(--ds-space-2xs) var(--ds-space-sm);
	}
	.popover input:focus {
		outline: none;
		border-color: var(--ds-color-focus);
	}
	.hint {
		margin: 0;
		font-size: var(--ds-text-xs);
		color: var(--ds-color-spark);
	}
	.row {
		display: flex;
		justify-content: flex-end;
		gap: var(--ds-space-2xs);
	}
	.row button {
		font: inherit;
		font-size: var(--ds-text-xs);
		border-radius: var(--ds-radius-sm);
		padding: var(--ds-space-2xs) var(--ds-space-sm);
		cursor: pointer;
	}
	.ghost {
		color: var(--ds-color-ink-2);
		background: none;
		border: var(--ds-border-width) solid var(--ds-color-border-2);
	}
	.ghost:hover {
		border-color: var(--ds-color-border-3);
	}
	.primary {
		color: var(--ds-color-on-action);
		background: var(--ds-color-action);
		border: var(--ds-border-width) solid transparent;
	}
	.primary:hover {
		background: var(--ds-color-action-hover);
	}
</style>
