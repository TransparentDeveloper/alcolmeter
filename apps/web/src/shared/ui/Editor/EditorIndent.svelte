<script lang="ts">
	import EditorButton from './EditorButton.svelte';
	import { getEditorContext } from './context';

	const editor = getEditorContext();
</script>

<EditorButton label="들여쓰기" disabled={!editor.inListItem} onclick={() => editor.indentList()}>
	<svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
		<path
			d="M2 3.5h12M8 8h6M2 12.5h12"
			stroke="currentColor"
			stroke-width="1.5"
			stroke-linecap="round"
		/>
		<path d="M2 5.5L5.5 8 2 10.5Z" fill="currentColor" />
	</svg>
</EditorButton>
