<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { WikiHistory, WikiRevertState } from '$widgets/wiki/ui';
	import { authStore } from '$features/auth/store/index.svelte';
	import type { WikiTermData, WikiRevisionData } from '$entities/wiki/model';

	let {
		term,
		history,
		authorId
	}: { term: WikiTermData; history: WikiRevisionData[]; authorId: string } = $props();

	const revertState = new WikiRevertState(term.id, authorId);
	$effect(() => {
		revertState.resolvePermission(authStore.value.user);
	});

	async function onrevert(revId: number) {
		const user = authStore.value.user;
		if (!user) return;
		if (await revertState.revert(user, revId)) await invalidateAll();
	}
</script>

<main>
	<h1>{term.title} 편집 이력</h1>
	<WikiHistory slug={term.slug} {history} canRevert={revertState.canRevert} {onrevert} />
	{#if revertState.errorMessage}<p role="alert">{revertState.errorMessage}</p>{/if}
</main>

<style>
	main {
		display: grid;
		gap: var(--ds-space-lg);
	}
	h1 {
		font-family: var(--ds-font-display);
		font-size: var(--ds-text-xl);
		margin: 0;
	}
	p[role='alert'] {
		margin: 0;
		color: var(--ds-color-error);
	}
</style>
