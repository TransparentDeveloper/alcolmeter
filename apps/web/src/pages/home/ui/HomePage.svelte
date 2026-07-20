<script lang="ts">
	import { BrandStrip, CommunityFeed, WikiHighlight, DrinkSelection } from '$widgets/home/ui';
	import type { PostListItem } from '$entities/post/model';
	import type { WikiTermData } from '$entities/wiki/model';

	let { posts, terms }: { posts: PostListItem[]; terms: WikiTermData[] } = $props();
</script>

<div class="landing">
	<BrandStrip />
	<CommunityFeed {posts} />
	<WikiHighlight {terms} />
	<DrinkSelection />
</div>

<style>
	.landing {
		display: flex;
		flex-direction: column;
		gap: var(--ds-space-3xl);
		padding-bottom: var(--ds-space-2xl);
	}
</style>
