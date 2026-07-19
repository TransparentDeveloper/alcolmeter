<script lang="ts">
	import { page } from '$app/state';
	import { WikiEditPage } from '$pages/wiki/ui';
</script>

<WikiEditPage slug={page.params.slug ?? ''} />
