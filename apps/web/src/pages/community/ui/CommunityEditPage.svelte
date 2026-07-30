<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { PostForm, PostEditState } from '$widgets/community/ui';
	import { authStore } from '$features/auth/store/index.svelte';

	const editState = new PostEditState(Number(page.params.id));
	let errorMessage = $state<string | null>(null);

	// 상태 확정 후: 비로그인 → 로그인, 로그인 → 글 로딩·소유권 확인.
	$effect(() => {
		const { status, user } = authStore.value;
		if (status === 'loading' || editState.loaded) return;
		if (status === 'signedOut' || !user) {
			goto(`/login?redirect=/community/${editState.id}/edit`, { replaceState: true });
			return;
		}
		void resolve(user.id);
	});

	// 로딩 결과에 따라 목적지로 보낸다 (네비게이션은 페이지 몫).
	async function resolve(userId: string) {
		const result = await editState.load(userId);
		if (result === 'notfound') goto('/community');
		else if (result === 'forbidden') goto(`/community/${editState.id}`);
	}

	async function submit() {
		errorMessage = null;
		try {
			if (await editState.submit()) goto(`/community/${editState.id}`);
		} catch (e) {
			errorMessage = e instanceof Error ? e.message : '저장에 실패했어요.';
		}
	}
</script>

<main>
	{#if editState.form}
		<PostForm
			form={editState.form}
			submitLabel={editState.saving ? '저장 중…' : '수정 저장'}
			onsubmit={submit}
		/>
		{#if errorMessage}<p role="alert">{errorMessage}</p>{/if}
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
