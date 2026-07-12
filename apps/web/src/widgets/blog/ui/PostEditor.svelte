<script lang="ts">
	import { PostEditorState } from './PostEditorState.svelte';

	let {
		editor,
		submitLabel,
		onsubmit
	}: {
		editor: PostEditorState;
		submitLabel: string;
		onsubmit: () => void;
	} = $props();
</script>

<form onsubmit={(e) => e.preventDefault()}>
	<input class="title" bind:value={editor.title} placeholder="제목" />

	{#each editor.blocks as block (block.id)}
		<fieldset>
			<input class="heading" bind:value={block.heading} placeholder="소제목 (선택)" />
			<textarea bind:value={block.text} placeholder="본문" rows="4"></textarea>
			{#if editor.blocks.length > 1}
				<button type="button" class="remove" onclick={() => editor.removeBlock(block.id)}
					>문단 삭제</button
				>
			{/if}
		</fieldset>
	{/each}

	<div class="row">
		<button type="button" onclick={() => editor.addBlock()}>+ 문단 추가</button>
		<button type="submit" disabled={!editor.isValid} onclick={onsubmit}>{submitLabel}</button>
	</div>
</form>

<style>
	form {
		max-width: 44rem;
		margin: 0 auto;
		display: grid;
		gap: var(--ds-space-lg);
	}
	.title {
		font-family: var(--ds-font-display);
		font-size: var(--ds-text-lg);
		padding: var(--ds-space-sm);
	}
	fieldset {
		display: grid;
		gap: var(--ds-space-sm);
		border: var(--ds-border-width) solid var(--ds-color-border-1);
		padding: var(--ds-space-md);
	}
	input,
	textarea,
	button {
		font: inherit;
		padding: var(--ds-space-sm);
	}
	textarea {
		resize: vertical;
	}
	.remove {
		justify-self: start;
		color: var(--ds-color-ink-3);
		background: none;
		border: none;
		cursor: pointer;
		padding: 0;
	}
	.row {
		display: flex;
		justify-content: space-between;
	}
	button[disabled] {
		opacity: 0.5;
		cursor: not-allowed;
	}
</style>
