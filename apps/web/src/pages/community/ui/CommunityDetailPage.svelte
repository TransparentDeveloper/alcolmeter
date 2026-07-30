<script lang="ts">
	import { goto } from '$app/navigation';
	import { PostModel } from '$entities/post/model';
	import type { PostData } from '$entities/post/model';
	import { PostAPI } from '$entities/post/api';
	import { Supabase } from '$shared/supabase/api';
	import { PostDetail } from '$widgets/community/ui';

	let { post, bodyHtml }: { post: PostData; bodyHtml: string } = $props();

	const model = $derived(new PostModel(post));

	async function remove() {
		await PostAPI.remove(Supabase.getClient(), model.id);
		goto('/community');
	}
</script>

<PostDetail post={model} {bodyHtml} ondelete={remove} />
