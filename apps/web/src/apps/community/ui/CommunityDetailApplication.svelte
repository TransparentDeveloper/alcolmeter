<script lang="ts">
	import { MetaHead } from '$shared/ui';
	import { JsonLd } from '$shared/lib';
	import { PostModel } from '$entities/post/model';
	import type { PostData } from '$entities/post/model';
	import { CommunityDetailPage } from '$pages/community/ui';

	let { post }: { post: PostData } = $props();

	const model = $derived(new PostModel(post));
	const description = $derived(model.summary || '알콜미터 커뮤니티에 올라온 글입니다.');
	// 본문에 이미지가 있으면 그걸 공유 카드에 쓰고, 없으면 커뮤니티 공통 이미지로 대체한다.
	const image = $derived(model.shareImage ?? '/og/community.png');
	const schema = $derived(
		JsonLd.createDiscussionForumPostingSchemaMarkup({
			headline: model.title,
			description,
			url: `https://alcolmeter.kr/community/${model.id}`,
			datePublished: model.createdAt,
			dateModified: model.updatedAt,
			authorName: model.author.displayName,
			...(model.shareImage ? { image: model.shareImage } : {})
		})
	);
</script>

<MetaHead
	title={`${model.title} - 커뮤니티 - 알콜미터`}
	ogTitle={`${model.title} - 알콜미터 커뮤니티`}
	{description}
	path={`/community/${model.id}`}
	{image}
	type="article"
	publishedTime={model.createdAt}
	modifiedTime={model.updatedAt}
	authorName={model.author.displayName}
	schemas={[schema]}
/>

<CommunityDetailPage {post} />
