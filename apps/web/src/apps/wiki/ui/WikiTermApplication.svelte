<script lang="ts">
	import { MetaHead } from '$shared/ui';
	import { buildWikiSchemas } from '$entities/wiki/lib';
	import type { WikiTermData } from '$entities/wiki/model';
	import { WikiDetailPage } from '$pages/wiki/ui';

	let { term, bodyHtml }: { term: WikiTermData; bodyHtml: string } = $props();

	const schemas = $derived(buildWikiSchemas(term));
</script>

<MetaHead
	title="{term.title} - 알콜위키 - 알콜미터"
	ogTitle="{term.title} - 알콜위키"
	description={term.summary}
	path="/wiki/{encodeURIComponent(term.slug)}"
	image={term.mainImage?.url ?? '/og/wiki.png'}
	{schemas}
/>
<WikiDetailPage {term} {bodyHtml} />
