<script lang="ts">
	import { sections } from '$entities/faq/lib';
</script>

<nav class="toc">
	{#each sections as s}
		<a href="#{s.id}" class="toc-item">{s.title}</a>
	{/each}
</nav>

<style>
	.toc {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.toc-item {
		padding: var(--ds-space-xs) var(--ds-space-md);
		font-family: var(--ds-font-mono);
		font-size: var(--ds-text-xs);
		color: var(--ds-color-ink-2);
		background: var(--ds-color-surface);
		border: var(--ds-border-width) solid var(--ds-color-border-2);
		border-radius: var(--ds-radius-sm);
		text-decoration: none;
		transition: border-color var(--ds-duration-short) var(--ds-ease-out),
			background-color var(--ds-duration-short) var(--ds-ease-out);
	}

	.toc-item:hover {
		border-color: var(--ds-color-border-3);
		background: var(--ds-color-hover);
	}
</style>
