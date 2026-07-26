<script lang="ts">
	import { goto } from '$app/navigation';
	import {
		WikiForm,
		WikiConfirmDialog,
		WikiLoadingDialog,
		WikiNoticeDialog,
		WikiEditState
	} from '$widgets/wiki/ui';
	import { authStore } from '$features/auth/store/index.svelte';

	let { slug }: { slug: string } = $props();
	const editState = new WikiEditState(slug);
	let confirmDialog = $state<WikiConfirmDialog | null>(null);
	let loadingDialog = $state<WikiLoadingDialog | null>(null);
	let noticeDialog = $state<WikiNoticeDialog | null>(null);

	// 상태 확정 후: 비로그인 → 로그인, 로그인 → 문서 로딩(없으면 상세로).
	$effect(() => {
		if (authStore.value.status === 'signedOut') {
			goto(`/login?redirect=/wiki/${encodeURIComponent(slug)}/edit`);
			return;
		}
		if (authStore.value.status === 'signedIn') {
			editState.load().then((r) => {
				if (r === 'notfound') goto(`/wiki/${encodeURIComponent(slug)}`);
			});
		}
	});

	// 확인 → 저장 → 상세로 이동
	async function submit() {
		const user = authStore.value.user;
		if (!user) return;
		if (!(await confirmDialog?.open())) return;
		loadingDialog?.open();
		try {
			await editState.submit(user);
			loadingDialog?.close();
			goto(`/wiki/${encodeURIComponent(slug)}`);
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
		<WikiForm form={editState.form} submitLabel="수정 저장" onsubmit={submit} />
	{:else}
		<p class="loading">불러오는 중…</p>
	{/if}
	<WikiConfirmDialog
		bind:this={confirmDialog}
		title="수정 내용을 저장할까요?"
		description="저장하면 바로 반영되고 편집 이력에 남아요."
		confirmLabel="저장하기"
	/>
	<WikiLoadingDialog bind:this={loadingDialog} />
	<WikiNoticeDialog bind:this={noticeDialog} />
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
