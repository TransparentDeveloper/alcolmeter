<script lang="ts">
	import EditorButton from './EditorButton.svelte';
	import { getEditorContext } from './context';

	// level = 실제 시맨틱 태그 단계(h2·h3·h4). 표시 라벨은 소비자가 정한다(라벨=뷰 관리 컨벤션).
	let { level, label }: { level: 2 | 3 | 4; label: string } = $props();

	const editor = getEditorContext();
	const block = $derived<'h2' | 'h3' | 'h4'>(`h${level}`);
	// 버튼 글자 크기 차등: 단계가 깊을수록 작게 (H1 > H2 > H3)
	const SIZES: Record<2 | 3 | 4, string> = {
		2: 'var(--ds-text-base)',
		3: 'var(--ds-text-sm)',
		4: 'var(--ds-text-xs)'
	};
	const size = $derived(SIZES[level]);
</script>

<EditorButton {label} active={editor.block === block} onclick={() => editor.toggleBlock(block)}>
	<span class="txt" style:font-size={size}>{label}</span>
</EditorButton>

<style>
	/* 크기가 다른 H1·H2·H3의 글자 밑선을 버튼 하단에 맞춘다(타입스케일) */
	.txt {
		align-self: flex-end;
		padding-bottom: var(--ds-space-2xs);
		font-weight: var(--ds-weight-bold);
		line-height: 1;
	}
</style>
