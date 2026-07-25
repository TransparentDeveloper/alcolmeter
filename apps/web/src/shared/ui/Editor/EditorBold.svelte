<script lang="ts">
	import EditorButton from './EditorButton.svelte';
	import { getEditorContext } from './context';

	const editor = getEditorContext();
</script>

<EditorButton label="굵게" active={editor.bold} onclick={() => editor.toggleBold()}>
	<span class="glyph">가</span>
</EditorButton>

<style>
	.glyph {
		font-weight: var(--ds-weight-bold);
	}
</style>
