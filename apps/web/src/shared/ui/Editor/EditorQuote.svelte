<script lang="ts">
	import EditorButton from './EditorButton.svelte';
	import { getEditorContext } from './context';

	const editor = getEditorContext();
</script>

<EditorButton
	label="인용구"
	active={editor.block === 'blockquote'}
	onclick={() => editor.toggleBlock('blockquote')}
>
	<svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" fill="currentColor">
		<path
			d="M3 4h4v4c0 2-1.3 3.3-3.3 4l-.7-1.2C4.2 10.4 5 9.7 5 8.5H3V4zm6 0h4v4c0 2-1.3 3.3-3.3 4l-.7-1.2c1.2-.4 2-1.1 2-2.3H9V4z"
		/>
	</svg>
</EditorButton>
