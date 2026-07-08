<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/state';
	import { tick } from 'svelte';
	import { sections } from '$entities/faq/lib';

	const activeQ = $derived(browser ? page.url.searchParams.get('q') : null);

	$effect(() => {
		if (!activeQ) return;
		tick().then(() => {
			setTimeout(() => {
				const el = document.getElementById(activeQ);
				if (el) {
					el.setAttribute('open', '');
					el.scrollIntoView({ behavior: 'smooth', block: 'center' });
				}
			}, 100);
		});
	});
</script>

{#each sections as s, si}
	<section id={s.id} class="faq-section">
		<div class="section-header">
			<span class="section-number">{String(si + 1).padStart(2, '0')}</span>
			<h2>{s.title}</h2>
		</div>
		{#each s.items as item}
			<details class="faq-item" id={item.id} open={activeQ === item.id}>
				<summary>{item.q}</summary>
				<div class="answer"><p>{item.a}</p></div>
			</details>
		{/each}
	</section>
{/each}

<style>
	.faq-section {
		display: flex;
		flex-direction: column;
		gap: 0.625rem;
	}

	.section-header {
		display: flex;
		align-items: center;
		gap: 0.625rem;
		margin-bottom: 0.25rem;
	}

	.section-number {
		font-family: var(--ds-font-mono);
		font-size: var(--ds-text-xs);
		font-variant-numeric: tabular-nums;
		color: var(--ds-color-ink-3);
		background: var(--ds-color-surface);
		border: var(--ds-border-width) solid var(--ds-color-border-2);
		padding: var(--ds-space-2xs) var(--ds-space-sm);
		border-radius: var(--ds-radius-sm);
	}

	.section-header h2 {
		font-family: var(--ds-font-display);
		font-size: var(--ds-text-lg);
		font-weight: var(--ds-weight-bold);
		letter-spacing: var(--ds-tracking-tight);
		color: var(--ds-color-ink-1);
	}

	.faq-item {
		background: var(--ds-color-surface);
		border-radius: var(--ds-radius-md);
		overflow: hidden;
		box-shadow: var(--ds-shadow-paper);
		border: var(--ds-border-width) solid var(--ds-color-border-2);
		transition: border-color var(--ds-duration-short) var(--ds-ease-out);
	}

	.faq-item[open] {
		border-color: var(--ds-color-border-3);
	}

	.faq-item::details-content {
		block-size: 0;
		overflow: hidden;
		transition:
			block-size var(--ds-duration-medium) var(--ds-ease-out),
			content-visibility var(--ds-duration-medium) var(--ds-ease-out) allow-discrete;
	}

	.faq-item[open]::details-content {
		block-size: auto;
	}

	@media (prefers-reduced-motion: reduce) {
		.faq-item::details-content {
			transition: none;
		}
	}

	.faq-item summary {
		padding: 1rem 1.25rem;
		font-size: 0.88rem;
		font-weight: 700;
		cursor: pointer;
		list-style: none;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem;
		user-select: none;
		color: var(--ds-color-ink-1);
	}

	.faq-item summary::-webkit-details-marker {
		display: none;
	}

	.faq-item summary::after {
		content: '+';
		font-size: 1.1rem;
		font-weight: 400;
		color: var(--ds-color-ink-3);
		flex-shrink: 0;
		width: 1.5rem;
		height: 1.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		background: var(--ds-color-border-1);
		transition: all 0.15s ease;
	}

	.faq-item[open] summary::after {
		content: '−';
		color: var(--ds-color-on-action);
		background: var(--ds-color-action);
	}

	.answer {
		padding: 0 1.25rem 1.25rem;
		font-size: var(--ds-text-sm);
		line-height: 1.8;
		color: var(--ds-color-ink-2);
	}

	.answer p {
		margin: 0;
	}
</style>
