<script lang="ts">
	import { goto } from '$app/navigation';
	import { WikiForm, WikiEditState } from '$widgets/wiki/ui';
	import { authStore } from '$features/auth/store/index.svelte';

	let { slug }: { slug: string } = $props();
	const state = new WikiEditState(slug);

	// 상태 확정 후: 비로그인 → 로그인, 로그인 → 문서 로딩(없으면 상세로).
	$effect(() => {
		if (authStore.value.status === 'signedOut') {
			goto(`/login?redirect=/wiki/${encodeURIComponent(slug)}/edit`, { replaceState: true });
			return;
		}
		if (authStore.value.status === 'signedIn') {
			state.load().then((r) => {
				if (r === 'notfound') goto(`/wiki/${encodeURIComponent(slug)}`);
			});
		}
	});

	async function submit() {
		const user = authStore.value.user;
		if (!user) return;
		if (await state.submit(user)) goto(`/wiki/${encodeURIComponent(slug)}`);
	}
</script>

<main>
	{#if state.form}
		<WikiForm form={state.form} submitLabel={state.saving ? '저장 중…' : '수정 저장'} onsubmit={submit} />
		{#if state.errorMessage}<p role="alert">{state.errorMessage}</p>{/if}
	{:else}
		<p class="loading">불러오는 중…</p>
	{/if}
</main>

<style>
	main {
		display: grid;
		gap: var(--ds-space-lg);
	}
	.loading {
		margin: 0;
		color: var(--ds-color-ink-3);
	}
	p[role='alert'] {
		margin: 0;
		color: var(--ds-color-error);
	}
</style>
