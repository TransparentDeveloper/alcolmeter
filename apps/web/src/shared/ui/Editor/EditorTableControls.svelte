<script lang="ts">
	import EditorButton from './EditorButton.svelte';
	import EditorToolbarSeparator from './EditorToolbarSeparator.svelte';
	import { getEditorContext } from './context';
	import type { TableAlign } from './EditorState.svelte';

	const editor = getEditorContext();

	// 정렬 아이콘: 줄 길이와 치우침으로 방향을 보인다
	const ALIGNS: { value: TableAlign; label: string; lines: string }[] = [
		{ value: 'left', label: '왼쪽 정렬', lines: 'M2 4h12M2 8h7M2 12h10' },
		{ value: 'center', label: '가운데 정렬', lines: 'M2 4h12M4.5 8h7M3 12h10' },
		{ value: 'right', label: '오른쪽 정렬', lines: 'M2 4h12M7 8h7M4 12h10' }
	];
</script>

<!-- 캐럿이 표 안에 있을 때만 나타나는 표 전용 줄 -->
{#if editor.inTable}
	<div class="controls" role="group" aria-label="표 도구">
		<EditorButton label="행 추가" onclick={() => editor.insertTableRow()}>
			<span class="txt">행 +</span>
		</EditorButton>
		<EditorButton
			label="행 삭제"
			disabled={!editor.canDeleteTableRow}
			onclick={() => editor.deleteTableRow()}
		>
			<span class="txt">행 −</span>
		</EditorButton>
		<EditorButton label="열 추가" onclick={() => editor.insertTableColumn()}>
			<span class="txt">열 +</span>
		</EditorButton>
		<EditorButton
			label="열 삭제"
			disabled={!editor.canDeleteTableColumn}
			onclick={() => editor.deleteTableColumn()}
		>
			<span class="txt">열 −</span>
		</EditorButton>

		<EditorToolbarSeparator />

		{#each ALIGNS as align (align.value)}
			<EditorButton
				label={align.label}
				active={editor.columnAlign === align.value}
				onclick={() => editor.setColumnAlign(align.value)}
			>
				<svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
					<path d={align.lines} stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
				</svg>
			</EditorButton>
		{/each}

		<EditorToolbarSeparator />

		<EditorButton label="표 삭제" onclick={() => editor.deleteTable()}>
			<span class="txt">표 삭제</span>
		</EditorButton>
	</div>
{/if}

<style>
	/* 툴바 안에서 한 줄을 독차지한다(flex-basis 100%). 그래야 툴바의 sticky를 함께 타면서도
	   기본 서식 줄과 섞이지 않는다. */
	.controls {
		flex-basis: 100%;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--ds-space-2xs);
		margin-top: var(--ds-space-xs);
		padding-top: var(--ds-space-xs);
		border-top: var(--ds-border-width) solid var(--ds-color-border-2);
	}

	.txt {
		font-size: var(--ds-text-xs);
		font-weight: var(--ds-weight-medium);
		white-space: nowrap;
	}
</style>
