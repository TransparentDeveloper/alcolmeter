<script lang="ts">
	import { MetaHead } from '$shared/ui';
	import { PostModel } from '$entities/post/model';
	import type { PostData } from '$entities/post/model';
	import { CommunityDetailPage } from '$pages/community/ui';

	let { post }: { post: PostData } = $props();

	const model = $derived(new PostModel(post));
</script>

<MetaHead
	title={`${model.title} · 알콜미터 커뮤니티`}
	description={model.summary || model.title}
	path={`/community/${model.id}`}
	image="/og/community.png"
/>

<CommunityDetailPage {post} />
