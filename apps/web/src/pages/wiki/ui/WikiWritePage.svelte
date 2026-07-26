<script lang="ts">
	import { goto } from '$app/navigation';
	import {
		WikiForm,
		WikiConfirmDialog,
		WikiLoadingDialog,
		WikiNoticeDialog,
		WikiWriteState
	} from '$widgets/wiki/ui';
	import { authStore } from '$features/auth/store/index.svelte';

	const writeState = new WikiWriteState();
	let confirmDialog = $state<WikiConfirmDialog | null>(null);
	let loadingDialog = $state<WikiLoadingDialog | null>(null);
	let noticeDialog = $state<WikiNoticeDialog | null>(null);

	// 로그인 가드: 상태가 확정된 뒤 비로그인이면 로그인으로 보낸다.
	$effect(() => {
		if (authStore.value.status === 'signedOut') goto('/login?redirect=/wiki/new');
	});

	// 중복이면 안내로 종료, 아니면 확인 → 저장 → 상세로 이동
	async function submit() {
		const user = authStore.value.user;
		if (!user) return;
		let duplicated = false;
		try {
			duplicated = await writeState.checkDuplicate();
		} catch {
			// 조회 실패는 통과시킨다 — 저장 시점 unique 위반 백업이 잡는다
		}
		if (duplicated) {
			noticeDialog?.open({
				title: '이미 있는 용어예요',
				description: '같은 이름의 문서가 이미 있어요. 기존 문서를 수정해 주세요.'
			});
			return;
		}
		if (!(await confirmDialog?.open())) return;
		loadingDialog?.open();
		try {
			await writeState.submit(user);
			loadingDialog?.close();
			goto(`/wiki/${encodeURIComponent(writeState.form.slug)}`);
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
	<WikiForm form={writeState.form} submitLabel="게시" onsubmit={submit} />
	<WikiConfirmDialog
		bind:this={confirmDialog}
		title="게시할까요?"
		description="게시하면 모든 방문자에게 공개돼요."
		confirmLabel="게시하기"
	/>
	<WikiLoadingDialog bind:this={loadingDialog} />
	<WikiNoticeDialog bind:this={noticeDialog} />
</main>

<style>
	main {
		display: grid;
		gap: var(--ds-space-lg);
	}
</style>
