<script lang="ts">
	import type { Snippet } from 'svelte';
	import { DialogFrame, DialogState } from '$shared/ui';

	let { children }: { children: Snippet } = $props();

	// 전역 다이얼로그 스택을 만들고 context로 주입한다. 소비처는 DialogState.use().open(snippet).
	const dialogs = DialogState.provide();
</script>

{@render children()}

{#each dialogs.stack as entry (entry.id)}
	{@const close = () => dialogs.close(entry.id)}
	<DialogFrame onDismiss={close}>
		{@render entry.content({ close })}
	</DialogFrame>
{/each}
