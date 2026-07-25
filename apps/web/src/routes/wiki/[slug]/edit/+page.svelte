<script lang="ts">
	import { page } from '$app/state';
	import { WikiEditApplication } from '$apps/wiki/ui';
</script>

<WikiEditApplication slug={page.params.slug ?? ''} />
