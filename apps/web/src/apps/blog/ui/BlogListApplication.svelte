<script lang="ts">
	import { MetaHead } from '$shared/ui';
	import { BlogListPage } from '$pages/blog/ui';
	import type { PostData } from '$entities/post/model';

	let { posts }: { posts: PostData[] } = $props();
</script>

<svelte:head>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<MetaHead
	title="커뮤니티 · 알콜미터"
	description="알콜미터 사용자들이 남긴 양조 기록·후기·질문."
	path="/blog"
/>

<BlogListPage {posts} />
