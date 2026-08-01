<script lang="ts">
	import { PostModel } from '$entities/post/model';
	import type { PostData } from '$entities/post/model';
	import { PostList } from '$widgets/community/ui';
	import { authStore } from '$features/auth/store/index.svelte';

	let {
		posts,
		page,
		hasPrev,
		hasNext
	}: { posts: PostData[]; page: number; hasPrev: boolean; hasNext: boolean } = $props();

	const models = $derived(posts.map((d) => new PostModel(d)));
	// 비로그인도 글쓰기 입구를 본다. 누르면 로그인으로 안내하고 끝나면 작성 화면으로 돌아온다.
	const writeHref = $derived(
		authStore.value.status === 'signedIn' ? '/community/new' : '/login?redirect=/community/new'
	);
</script>

<main>
	<div class="head">
		<div class="head-text">
			<h1>커뮤니티</h1>
			<p class="tagline">직접 빚은 기록과 후기, 궁금증을 나눠요.</p>
		</div>
		<a class="write" href={writeHref}>글쓰기</a>
	</div>

	<PostList posts={models} />

	{#if hasPrev || hasNext}
		<nav class="pager">
			{#if hasPrev}
				<a href={`/community?page=${page - 1}`}>← 이전</a>
			{:else}
				<span></span>
			{/if}
			<span class="current">{page}</span>
			{#if hasNext}
				<a href={`/community?page=${page + 1}`}>다음 →</a>
			{:else}
				<span></span>
			{/if}
		</nav>
	{/if}
</main>

<style>
	main {
		display: grid;
		gap: var(--ds-space-xl);
	}
	.head {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		gap: var(--ds-space-md);
	}
	.head-text {
		display: grid;
		gap: var(--ds-space-2xs);
	}
	h1 {
		font-family: var(--ds-font-display);
		font-size: var(--ds-type-title);
		font-weight: var(--ds-weight-bold);
		letter-spacing: var(--ds-tracking-tight);
		color: var(--ds-color-ink-1);
		margin: 0;
	}
	.tagline {
		margin: 0;
		font-size: var(--ds-text-sm);
		color: var(--ds-color-ink-3);
	}
	.write {
		flex: none;
		font-family: var(--ds-font-mono);
		font-size: var(--ds-text-sm);
		color: var(--ds-color-spark);
		text-decoration: none;
		transition: color var(--ds-duration-short) var(--ds-ease-out);
	}
	.write:hover {
		color: var(--ds-color-spark-hover);
	}

	.pager {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--ds-space-lg);
		font-family: var(--ds-font-mono);
		font-size: var(--ds-text-xs);
	}
	.pager a {
		color: var(--ds-color-ink-3);
		text-decoration: none;
		transition: color var(--ds-duration-short) var(--ds-ease-out);
	}
	.pager a:hover {
		color: var(--ds-color-spark);
	}
	.pager .current {
		color: var(--ds-color-ink-1);
	}
</style>
