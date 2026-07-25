<script lang="ts">
	import EditorButton from './EditorButton.svelte';
	import { getEditorContext } from './context';

	const editor = getEditorContext();
</script>

<EditorButton
	label="글머리 목록"
	active={editor.bulletList}
	onclick={() => editor.toggleBulletList()}
>
	<svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
		<circle cx="2.5" cy="3.5" r="1.2" fill="currentColor" />
		<circle cx="2.5" cy="8" r="1.2" fill="currentColor" />
		<circle cx="2.5" cy="12.5" r="1.2" fill="currentColor" />
		<path
			d="M6 3.5h8M6 8h8M6 12.5h8"
			stroke="currentColor"
			stroke-width="1.5"
			stroke-linecap="round"
		/>
	</svg>
</EditorButton>
