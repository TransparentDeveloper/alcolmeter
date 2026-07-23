<script lang="ts">
	import type { WikiTermData } from '$entities/wiki/model';
	import { WikiDetail } from '$widgets/wiki/ui';
	let { term, bodyHtml }: { term: WikiTermData; bodyHtml: string } = $props();
</script>
<WikiDetail {term} {bodyHtml} />
