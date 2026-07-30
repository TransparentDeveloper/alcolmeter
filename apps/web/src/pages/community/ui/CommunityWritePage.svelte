<script lang="ts">
	import { goto } from '$app/navigation';
	import {
		PostForm,
		PostWriteState,
		PostConfirmDialog,
		PostLoadingDialog,
		PostNoticeDialog
	} from '$widgets/community/ui';
	import { authStore } from '$features/auth/store/index.svelte';

	const writeState = new PostWriteState();
	let confirmDialog = $state<PostConfirmDialog | null>(null);
	let loadingDialog = $state<PostLoadingDialog | null>(null);
	let noticeDialog = $state<PostNoticeDialog | null>(null);

	// 로그인 가드: 상태가 확정된 뒤 비로그인이면 로그인으로 보낸다.
	$effect(() => {
		if (authStore.value.status === 'signedOut')
			goto('/login?redirect=/community/new', { replaceState: true });
	});

	// 확인 → 저장 → 상세로 이동. 실패는 안내 다이얼로그로 알린다.
	async function submit() {
		const user = authStore.value.user;
		if (!user) return;
		if (!(await confirmDialog?.open())) return;
		loadingDialog?.open();
		try {
			const id = await writeState.submit(user);
			loadingDialog?.close();
			if (id !== null) goto(`/community/${id}`);
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
	<PostForm form={writeState.form} submitLabel="발행" onsubmit={submit} />
	<PostConfirmDialog
		bind:this={confirmDialog}
		title="발행할까요?"
		description="발행하면 모든 방문자에게 공개돼요."
		confirmLabel="발행하기"
	/>
	<PostLoadingDialog bind:this={loadingDialog} />
	<PostNoticeDialog bind:this={noticeDialog} />
</main>

<style>
	main {
		display: grid;
		gap: var(--ds-space-lg);
	}
</style>
