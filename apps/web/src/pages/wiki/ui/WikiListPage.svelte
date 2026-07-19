<script lang="ts">
	import type { WikiTermData } from '$entities/wiki/model';
	import { WikiList } from '$widgets/wiki/ui';
	let { terms }: { terms: WikiTermData[] } = $props();
</script>

<main>
	<div class="head-group">
		<div class="head">
			<h1>알콜위키</h1>
			<a class="write" href="/wiki/new">새 용어</a>
		</div>
		<p class="intro">고두밥, 밑술, 덧술… 전통주 양조 용어를 함께 채워가는 위키예요.</p>
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
	.head-group {
		display: grid;
		gap: var(--ds-space-sm);
	}
	.head {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
	}
	h1 {
		font-family: var(--ds-font-display);
	}
	.write {
		font-family: var(--ds-font-mono);
		font-size: var(--ds-text-sm);
		color: var(--ds-color-spark);
		text-decoration: none;
	}
	.intro {
		color: var(--ds-color-ink-3);
		font-size: var(--ds-text-sm);
	}
</style>
