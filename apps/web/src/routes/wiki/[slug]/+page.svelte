<script lang="ts">
	import { WikiTermApplication } from '$apps/wiki/ui';
	let { data } = $props();
</script>
<WikiTermApplication term={data.term} bodyHtml={data.bodyHtml} related={data.related} />
