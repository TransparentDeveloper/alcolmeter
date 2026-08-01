<script lang="ts">
	import EditorButton from './EditorButton.svelte';
	import { getEditorContext } from './context';

	const editor = getEditorContext();
</script>

<!-- 표 셀에는 블록을 담을 수 없다(GFM 한계): 셀 안에서는 비활성 -->
<EditorButton
	label="번호 목록"
	active={editor.orderedList}
	disabled={editor.inTable}
	onclick={() => editor.toggleOrderedList()}
>
	<svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
		<text x="0.5" y="5.2" font-size="5.5" fill="currentColor">1</text>
		<text x="0.5" y="10.2" font-size="5.5" fill="currentColor">2</text>
		<text x="0.5" y="15.2" font-size="5.5" fill="currentColor">3</text>
		<path
			d="M6 3.5h8M6 8h8M6 12.5h8"
			stroke="currentColor"
			stroke-width="1.5"
			stroke-linecap="round"
		/>
	</svg>
</EditorButton>
