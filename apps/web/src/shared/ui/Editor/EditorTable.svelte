<script lang="ts">
	import EditorButton from './EditorButton.svelte';
	import { getEditorContext } from './context';

	const editor = getEditorContext();
</script>

<!-- 표 안에서는 비활성: GFM에 중첩 표가 없다 -->
<EditorButton label="표" disabled={editor.inTable} onclick={() => editor.insertTable()}>
	<svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
		<rect
			x="2"
			y="3"
			width="12"
			height="10"
			rx="1"
			fill="none"
			stroke="currentColor"
			stroke-width="1.5"
		/>
		<path d="M2 6.5h12M6 6.5V13M10 6.5V13" stroke="currentColor" stroke-width="1.5" />
	</svg>
</EditorButton>
