<script lang="ts">
	import { PostModel } from '$entities/post/model';
	import type { PostData } from '$entities/post/model';
	import { PostList } from '$widgets/community/ui';
	import { authStore } from '$features/auth/store/index.svelte';

	let { posts }: { posts: PostData[] } = $props();

	const models = $derived(posts.map((d) => new PostModel(d)));
	const canWrite = $derived(authStore.value.status === 'signedIn');
</script>

<main>
	<div class="head">
		<h1>커뮤니티</h1>
		{#if canWrite}
			<a class="write" href="/community/new">글쓰기</a>
		{/if}
	</div>
	<PostList posts={models} />
</main>

<style>
	main {
		display: grid;
		gap: var(--ds-space-xl);
	}
	.head {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
	}
	h1 {
		font-family: var(--ds-font-display);
	}
	.write {
		font-family: var(--ds-font-mono);
		font-size: var(--ds-text-sm);
		color: var(--ds-color-spark);
		text-decoration: none;
	}
</style>
