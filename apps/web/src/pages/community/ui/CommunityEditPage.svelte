<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { PostEditor, PostEditState } from '$widgets/community/ui';
	import { authStore } from '$features/auth/store/index.svelte';

	const state = new PostEditState(Number(page.params.id));

	// 상태 확정 후: 비로그인 → 로그인, 로그인 → 글 로딩·소유권 확인.
	$effect(() => {
		const { status, user } = authStore.value;
		if (status === 'loading' || state.loaded) return;
		if (status === 'signedOut' || !user) {
			goto(`/login?redirect=/community/${state.id}/edit`, { replaceState: true });
			return;
		}
		void resolve(user.id);
	});

	// 로딩 결과에 따라 목적지로 보낸다 (네비게이션은 페이지 몫).
	async function resolve(userId: string) {
		const result = await state.load(userId);
		if (result === 'notfound') goto('/community');
		else if (result === 'forbidden') goto(`/community/${state.id}`);
	}

	async function submit() {
		if (await state.submit()) goto(`/community/${state.id}`);
	}
</script>

<main>
	{#if state.editor}
		<PostEditor
			editor={state.editor}
			submitLabel={state.saving ? '저장 중…' : '수정 완료'}
			onsubmit={submit}
		/>
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
