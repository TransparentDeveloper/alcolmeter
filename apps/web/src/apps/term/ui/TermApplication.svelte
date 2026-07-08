<script lang="ts">
	import type { TermMeta } from '$entities/dictionary/model';
	import type { Component } from 'svelte';
	import { MetaHead } from '$shared/ui';
	import { JsonLd } from '$shared/lib';
	import { videoThumbnails, videoWatchUrl, videoEmbedUrl } from '$entities/dictionary/lib';
	import { TermPage } from '$pages/term/ui';

	let { meta, content, related }: { meta: TermMeta; content: Component; related: TermMeta[] } =
		$props();

	const schemas = $derived([
		JsonLd.createDefinedTermSchemaMarkup({
			name: meta.title,
			description: meta.summary,
			inDefinedTermSet: 'https://alcolmeter.kr/dictionary',
			url: `https://alcolmeter.kr/dictionary/${encodeURIComponent(meta.slug)}`
		}),
		...(meta.video
			? [
					JsonLd.createVideoObjectSchemaMarkup({
						name: meta.video.title,
						description: meta.video.description,
						thumbnailUrl: videoThumbnails(meta.video),
						uploadDate: meta.video.uploadDate,
						embedUrl: videoEmbedUrl(meta.video),
						contentUrl: videoWatchUrl(meta.video)
					})
				]
			: [])
	]);
</script>

<MetaHead
	title="{meta.title} - 전통주 용어사전 - 알콜미터"
	description={meta.summary}
	path="/dictionary/{encodeURIComponent(meta.slug)}"
	image="/og/dictionary.png"
	{schemas}
/>

<TermPage {meta} {content} {related} />
