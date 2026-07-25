<script lang="ts">
	import EditorButton from './EditorButton.svelte';
	import { getEditorContext } from './context';

	const editor = getEditorContext();
</script>

<EditorButton label="취소선" active={editor.strike} onclick={() => editor.toggleStrike()}>
	<span class="glyph">가</span>
</EditorButton>

<style>
	.glyph {
		text-decoration: line-through;
	}
</style>
