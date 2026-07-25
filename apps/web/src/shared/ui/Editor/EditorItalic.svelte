<script lang="ts">
	import EditorButton from './EditorButton.svelte';
	import { getEditorContext } from './context';

	const editor = getEditorContext();
</script>

<EditorButton label="기울임" active={editor.italic} onclick={() => editor.toggleItalic()}>
	<span class="glyph">가</span>
</EditorButton>

<style>
	.glyph {
		font-style: italic;
	}
</style>
