<script lang="ts">
	import { MetaHead } from '$shared/ui';
	import { PostModel } from '$entities/post/model';
	import type { PostData } from '$entities/post/model';
	import { BlogDetailPage } from '$pages/blog/ui';

	let { post }: { post: PostData } = $props();

	const model = $derived(new PostModel(post));
</script>

<MetaHead
	title={`${model.title} · 알콜미터 커뮤니티`}
	description={model.summary || model.title}
	path={`/blog/${model.id}`}
/>

<BlogDetailPage {post} />
