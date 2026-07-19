<script lang="ts">
	import { WikiRevisionPage } from '$pages/wiki/ui';
	let { data } = $props();
</script>
<WikiRevisionPage slug={data.slug} revision={data.revision} bodyHtml={data.bodyHtml} />
