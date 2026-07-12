<script lang="ts">
	import { BlogListApplication } from '$apps/blog/ui';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<BlogListApplication posts={data.posts} />
