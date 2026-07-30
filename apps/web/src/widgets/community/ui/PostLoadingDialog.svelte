<script lang="ts">
	import { LoadingDialogState } from '$shared/ui';

	// 버튼 없는 진행 표시 다이얼로그. ESC로도 닫히지 않는다.
	let { message = '저장 중이에요…' }: { message?: string } = $props();

	const loading = new LoadingDialogState();

	export function open(): void {
		loading.open(content);
	}

	export function close(): void {
		loading.close();
	}
</script>

{#snippet content()}
	<p class="loading">{message}</p>
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
