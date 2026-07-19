<script lang="ts">
	import type { WikiTermData } from '$entities/wiki/model';
	import { WikiDetail } from '$widgets/wiki/ui';
	let { term, bodyHtml, related }: { term: WikiTermData; bodyHtml: string; related: { slug: string; title: string }[] } = $props();
</script>
<WikiDetail {term} {bodyHtml} {related} />
