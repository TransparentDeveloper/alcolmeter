<script lang="ts">
	import { BlogDetailApplication } from '$apps/blog/ui';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<BlogDetailApplication post={data.post} />
