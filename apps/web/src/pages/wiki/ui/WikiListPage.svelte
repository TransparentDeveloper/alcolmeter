<script lang="ts">
	import type { WikiTermData } from '$entities/wiki/model';
	import { WikiList } from '$widgets/wiki/ui';
	let { terms }: { terms: WikiTermData[] } = $props();
</script>

<main>
	<div class="topbar">
		<a class="write" href="/wiki/new">새 용어</a>
	</div>
	<WikiList {terms} />
</main>

<style>
	main {
		max-width: 44rem;
		margin: 0 auto;
		display: grid;
		gap: var(--ds-space-2xl);
	}
	.topbar {
		display: flex;
		justify-content: flex-end;
	}
	.write {
		font-family: var(--ds-font-mono);
		font-size: var(--ds-text-sm);
		color: var(--ds-color-spark);
		text-decoration: none;
	}
</style>
