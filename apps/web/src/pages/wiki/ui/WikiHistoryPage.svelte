<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import {
		WikiHistory,
		WikiConfirmDialog,
		WikiLoadingDialog,
		WikiNoticeDialog,
		WikiRevertState
	} from '$widgets/wiki/ui';
	import { authStore } from '$features/auth/store/index.svelte';
	import type { WikiTermData, WikiRevisionData } from '$entities/wiki/model';

	let {
		term,
		history,
		authorId
	}: { term: WikiTermData; history: WikiRevisionData[]; authorId: string } = $props();

	const revertState = new WikiRevertState(term.id, authorId);
	let confirmDialog = $state<WikiConfirmDialog | null>(null);
	let loadingDialog = $state<WikiLoadingDialog | null>(null);
	let noticeDialog = $state<WikiNoticeDialog | null>(null);

	$effect(() => {
		revertState.resolvePermission(authStore.value.user);
	});

	// 확인 → 되돌리기 → 목록 갱신
	async function onrevert(revId: number) {
		const user = authStore.value.user;
		if (!user) return;
		if (!(await confirmDialog?.open())) return;
		loadingDialog?.open();
		try {
			await revertState.revert(user, revId);
			loadingDialog?.close();
			await invalidateAll();
		} catch (e) {
			loadingDialog?.close();
			noticeDialog?.open({
				title: '되돌리기에 실패했어요',
				description: e instanceof Error ? e.message : '되돌리기에 실패했어요.'
			});
		}
	}
</script>

<main>
	<h1>{term.title} 편집 이력</h1>
	<WikiHistory slug={term.slug} {history} canRevert={revertState.canRevert} {onrevert} />
	<WikiConfirmDialog
		bind:this={confirmDialog}
		title="이 버전으로 되돌릴까요?"
		description="현재 내용이 이 버전으로 교체되고, 이 작업도 이력에 남아요."
		confirmLabel="되돌리기"
	/>
	<WikiLoadingDialog bind:this={loadingDialog} />
	<WikiNoticeDialog bind:this={noticeDialog} />
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
</style>
