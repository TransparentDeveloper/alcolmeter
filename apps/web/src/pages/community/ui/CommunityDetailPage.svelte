<script lang="ts">
	import { goto } from '$app/navigation';
	import { PostModel } from '$entities/post/model';
	import type { PostData } from '$entities/post/model';
	import { PostAPI } from '$entities/post/api';
	import { Supabase } from '$shared/supabase/api';
	import {
		PostDetail,
		PostConfirmDialog,
		PostLoadingDialog,
		PostNoticeDialog
	} from '$widgets/community/ui';

	let { post, bodyHtml }: { post: PostData; bodyHtml: string } = $props();

	const model = $derived(new PostModel(post));
	let confirmDialog = $state<PostConfirmDialog | null>(null);
	let loadingDialog = $state<PostLoadingDialog | null>(null);
	let noticeDialog = $state<PostNoticeDialog | null>(null);

	// 확인 → 삭제 → 목록으로. 실패는 안내 다이얼로그로 알린다.
	async function remove() {
		if (!(await confirmDialog?.open())) return;
		loadingDialog?.open();
		try {
			await PostAPI.remove(Supabase.getClient(), model.id);
			loadingDialog?.close();
			goto('/community');
		} catch (e) {
			loadingDialog?.close();
			noticeDialog?.open({
				title: '삭제에 실패했어요',
				description: e instanceof Error ? e.message : '삭제에 실패했어요.'
			});
		}
	}
</script>

<PostDetail post={model} {bodyHtml} ondelete={remove} />
<PostConfirmDialog
	bind:this={confirmDialog}
	title="이 글을 삭제할까요?"
	description="삭제하면 되돌릴 수 없어요."
	confirmLabel="삭제하기"
/>
<PostLoadingDialog bind:this={loadingDialog} message="삭제 중이에요…" />
<PostNoticeDialog bind:this={noticeDialog} />
