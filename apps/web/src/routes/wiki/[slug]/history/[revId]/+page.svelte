<script lang="ts">
	import { WikiRevisionApplication } from '$apps/wiki/ui';
	let { data } = $props();
</script>

<WikiRevisionApplication slug={data.slug} revision={data.revision} bodyHtml={data.bodyHtml} />
