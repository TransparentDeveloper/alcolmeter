<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		onDismiss,
		dismissible = true,
		children
	}: { onDismiss: () => void; dismissible?: boolean; children: Snippet } = $props();

	let el = $state<HTMLDialogElement | null>(null);

	// 마운트 시 모달로 열고(top-layer 스택 → 중첩), 언마운트 시 닫는다.
	$effect(() => {
		const dialog = el;
		if (!dialog) return;
		dialog.showModal();
		return () => {
			if (dialog.open) dialog.close();
		};
	});
</script>

<dialog
	bind:this={el}
	class="frame"
	oncancel={(e) => {
		if (!dismissible) e.preventDefault();
	}}
	onclose={onDismiss}
>
	{@render children()}
</dialog>

<style>
	.frame {
		/* app.css `* { margin: 0 }`이 dialog 기본 margin:auto를 죽여 중앙정렬이 풀린다 → 복원 */
		margin: auto;
		width: min(28rem, calc(100vw - var(--ds-space-2xl)));
		padding: var(--ds-space-xl);
		border: var(--ds-border-width) solid var(--ds-color-border-2);
		border-radius: var(--ds-radius-md);
		background: var(--ds-color-surface);
		color: var(--ds-color-ink-2);
	}

	.frame::backdrop {
		background: color-mix(in srgb, var(--ds-color-ink-1) 45%, transparent);
	}
</style>
