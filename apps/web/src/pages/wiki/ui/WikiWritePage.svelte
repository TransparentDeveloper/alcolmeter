<script lang="ts">
	import { goto } from '$app/navigation';
	import { WikiEditor, WikiWriteState } from '$widgets/wiki/ui';
	import { authStore } from '$features/auth/store/index.svelte';

	const state = new WikiWriteState();

	// 로그인 가드: 상태가 확정된 뒤 비로그인이면 로그인으로 보낸다.
	$effect(() => {
		if (authStore.value.status === 'signedOut') goto('/login?redirect=/wiki/new');
	});

	async function submit() {
		const user = authStore.value.user;
		if (!user) return;
		const slug = await state.submit(user);
		if (slug !== null) goto(`/wiki/${encodeURIComponent(slug)}`);
	}
</script>

<svelte:head>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<main>
	<WikiEditor editor={state.editor} submitLabel={state.saving ? '저장 중…' : '게시'} onsubmit={submit} />
	{#if state.errorMessage}<p role="alert">{state.errorMessage}</p>{/if}
</main>

<style>
	main {
		display: grid;
		gap: var(--ds-space-lg);
	}
	p[role='alert'] {
		margin: 0;
		color: var(--ds-color-error);
	}
</style>
