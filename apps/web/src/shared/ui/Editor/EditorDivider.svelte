<script lang="ts">
	import EditorButton from './EditorButton.svelte';
	import { getEditorContext } from './context';

	const editor = getEditorContext();
</script>

<EditorButton label="구분선" onclick={() => editor.insertDivider()}>
	<svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
		<path d="M2 8h12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
	</svg>
</EditorButton>
