<script lang="ts">
	import type { Snippet } from 'svelte';

	let { children }: { children?: Snippet } = $props();
</script>

<div class="toolbar" role="toolbar" aria-label="서식 도구">
	{@render children?.()}
</div>

<style>
	/* 에디터 상단 헤더 스트립. 긴 본문 스크롤 중에도 붙어 있도록 sticky */
	.toolbar {
		position: sticky;
		top: 0;
		z-index: 1;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--ds-space-2xs);
		padding: var(--ds-space-xs) var(--ds-space-sm);
		background: var(--ds-color-bg);
		border-bottom: var(--ds-border-width) solid var(--ds-color-border-2);
		border-radius: var(--ds-radius-md) var(--ds-radius-md) 0 0;
	}
</style>
