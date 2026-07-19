<script lang="ts">
	import { MetaHead } from '$shared/ui';
	import { JsonLd } from '$shared/lib';
	import { videoThumbnails, videoWatchUrl, videoEmbedUrl } from '$entities/wiki/lib';
	import type { WikiTermData } from '$entities/wiki/model';
	import { WikiDetailPage } from '$pages/wiki/ui';

	let { term, bodyHtml, related }: { term: WikiTermData; bodyHtml: string; related: { slug: string; title: string }[] } = $props();

	const schemas = $derived([
		JsonLd.createDefinedTermSchemaMarkup({
			name: term.title,
			description: term.summary,
			inDefinedTermSet: 'https://alcolmeter.kr/wiki',
			url: `https://alcolmeter.kr/wiki/${encodeURIComponent(term.slug)}`,
			...(term.mainImage ? { image: term.mainImage } : {})
		}),
		...(term.video
			? [JsonLd.createVideoObjectSchemaMarkup({
					name: term.video.title, description: term.video.description,
					thumbnailUrl: videoThumbnails(term.video), uploadDate: term.video.uploadDate,
					embedUrl: videoEmbedUrl(term.video), contentUrl: videoWatchUrl(term.video)
				})]
			: [])
	]);
</script>

<MetaHead
	title="{term.title} - 알콜위키 - 알콜미터"
	description={term.summary}
	path="/wiki/{encodeURIComponent(term.slug)}"
	image={term.mainImage ?? '/og/dictionary.png'}
	{schemas}
/>
<WikiDetailPage {term} {bodyHtml} {related} />
