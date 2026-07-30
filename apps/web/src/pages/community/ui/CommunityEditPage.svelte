<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import {
		PostForm,
		PostEditState,
		PostConfirmDialog,
		PostLoadingDialog,
		PostNoticeDialog
	} from '$widgets/community/ui';
	import { authStore } from '$features/auth/store/index.svelte';

	const editState = new PostEditState(Number(page.params.id));
	let confirmDialog = $state<PostConfirmDialog | null>(null);
	let loadingDialog = $state<PostLoadingDialog | null>(null);
	let noticeDialog = $state<PostNoticeDialog | null>(null);

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

	// 확인 → 저장 → 상세로 이동. 실패는 안내 다이얼로그로 알린다.
	async function submit() {
		if (!(await confirmDialog?.open())) return;
		loadingDialog?.open();
		try {
			const ok = await editState.submit();
			loadingDialog?.close();
			if (ok) goto(`/community/${editState.id}`);
		} catch (e) {
			loadingDialog?.close();
			noticeDialog?.open({
				title: '저장에 실패했어요',
				description: e instanceof Error ? e.message : '저장에 실패했어요.'
			});
		}
	}
</script>

<main>
	{#if editState.form}
		<PostForm form={editState.form} submitLabel="수정 저장" onsubmit={submit} />
	{:else}
		<p class="loading">불러오는 중…</p>
	{/if}
	<PostConfirmDialog
		bind:this={confirmDialog}
		title="수정 내용을 저장할까요?"
		description="저장하면 바로 반영돼요."
		confirmLabel="저장하기"
	/>
	<PostLoadingDialog bind:this={loadingDialog} />
	<PostNoticeDialog bind:this={noticeDialog} />
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
</style>
