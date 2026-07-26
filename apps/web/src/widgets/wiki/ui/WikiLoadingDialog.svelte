<script lang="ts">
	import { WikiLoadingDialogState } from './WikiLoadingDialogState.svelte';

	// 버튼 없는 진행 표시 다이얼로그. ESC로도 닫히지 않는다.
	const loading = new WikiLoadingDialogState();

	export function open(): void {
		loading.open(content);
	}

	export function close(): void {
		loading.close();
	}
</script>

{#snippet content()}
	<p class="loading">저장 중이에요…</p>
{/snippet}

<style>
	.loading {
		margin: 0;
		padding: var(--ds-space-md) 0;
		text-align: center;
		font-size: var(--ds-text-sm);
		color: var(--ds-color-ink-2);
	}
</style>
