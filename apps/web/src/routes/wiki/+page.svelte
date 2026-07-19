<script lang="ts">
	import { WikiListApplication } from '$apps/wiki/ui';
	let { data } = $props();
</script>
<WikiListApplication terms={data.terms} />
