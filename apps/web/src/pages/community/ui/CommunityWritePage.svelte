<script lang="ts">
	import { goto } from '$app/navigation';
	import {
		PostForm,
		PostWriteState,
		PostConfirmDialog,
		PostLoadingDialog,
		PostNoticeDialog
	} from '$widgets/community/ui';
	import { PostDraftService } from '$entities/post/service';
	import { authStore } from '$features/auth/store/index.svelte';

	const DRAFT_KEY = 'new';

	const writeState = new PostWriteState();
	let restoreDialog = $state<PostConfirmDialog | null>(null);
	let confirmDialog = $state<PostConfirmDialog | null>(null);
	let loadingDialog = $state<PostLoadingDialog | null>(null);
	let noticeDialog = $state<PostNoticeDialog | null>(null);
	// 초안 판단이 끝나기 전에는 폼을 렌더하지 않는다 (Editor가 마운트 때 본문을 1회 seed하므로).
	let ready = $state(false);

	// 로그인 가드: 상태가 확정된 뒤 비로그인이면 로그인으로 보낸다.
	$effect(() => {
		if (authStore.value.status === 'signedOut')
			goto('/login?redirect=/community/new', { replaceState: true });
	});

	// 로그인 확정 후 초안을 확인한다. 이어 쓰면 폼에 채우고, 아니면 초안을 버린다.
	$effect(() => {
		if (ready || authStore.value.status !== 'signedIn') return;
		const draft = PostDraftService.load(DRAFT_KEY);
		if (!draft || (!draft.title && !draft.body)) {
			ready = true;
			return;
		}
		void restore(draft);
	});

	async function restore(draft: { title: string; body: string }) {
		if (await restoreDialog?.open()) {
			writeState.form.title = draft.title;
			writeState.form.body = draft.body;
		} else {
			PostDraftService.clear(DRAFT_KEY);
		}
		ready = true;
	}

	// 확인 → 저장 → 상세로 이동. 실패는 안내 다이얼로그로 알린다.
	async function submit() {
		const user = authStore.value.user;
		if (!user) return;
		if (!(await confirmDialog?.open())) return;
		loadingDialog?.open();
		try {
			const id = await writeState.submit(user);
			loadingDialog?.close();
			if (id !== null) {
				PostDraftService.clear(DRAFT_KEY);
				goto(`/community/${id}`);
			}
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
	{#if ready}
		<PostForm form={writeState.form} submitLabel="발행" draftKey={DRAFT_KEY} onsubmit={submit} />
	{/if}
	<PostConfirmDialog
		bind:this={restoreDialog}
		title="작성 중이던 글이 있어요"
		description="이어서 쓸까요? 새로 쓰면 그 초안은 사라져요."
		confirmLabel="이어서 쓰기"
	/>
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
