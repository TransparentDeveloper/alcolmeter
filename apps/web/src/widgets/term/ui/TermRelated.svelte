<script lang="ts">
	import type { TermMeta } from '$entities/dictionary/model';

	let { related }: { related: TermMeta[] } = $props();
</script>

<aside class="related">
	<h2>관련 용어</h2>
	<ul>
		{#each related as term (term.slug)}
			<li>
				<a href="/dictionary/{term.slug}">
					<strong>{term.title}</strong>
					<span>{term.summary}</span>
				</a>
			</li>
		{/each}
	</ul>
</aside>

<style>
	.related {
		border-top: var(--ds-border-width) solid var(--ds-color-border-1);
		padding-top: var(--ds-space-lg);
	}

	.related h2 {
		font-family: var(--ds-font-display);
		font-size: var(--ds-text-md);
		font-weight: var(--ds-weight-bold);
		color: var(--ds-color-ink-1);
		margin-bottom: var(--ds-space-md);
	}

	.related ul {
		list-style: none;
		display: flex;
		flex-direction: column;
		gap: var(--ds-space-sm);
	}

	.related a {
		display: flex;
		flex-direction: column;
		gap: var(--ds-space-2xs);
		padding: var(--ds-space-md);
		background: var(--ds-color-surface);
		border: var(--ds-border-width) solid var(--ds-color-border-2);
		border-radius: var(--ds-radius-md);
		text-decoration: none;
		transition: border-color var(--ds-duration-short) var(--ds-ease-out);
	}

	.related a:hover {
		border-color: var(--ds-color-border-3);
	}

	.related a strong {
		font-size: var(--ds-text-sm);
		font-weight: var(--ds-weight-bold);
		color: var(--ds-color-ink-1);
	}

	.related a span {
		font-size: var(--ds-text-xs);
		color: var(--ds-color-ink-3);
		line-height: 1.5;
	}
</style>
