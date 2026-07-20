<script lang="ts">
	import { HomeApplication } from '$apps/home/ui';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<HomeApplication posts={data.posts} terms={data.terms} />
