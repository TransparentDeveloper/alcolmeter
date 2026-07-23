<script lang="ts">
	import type { WikiTermData } from '$entities/wiki/model';
	import { WikiIndexState } from './WikiIndexState.svelte';

	let { terms }: { terms: WikiTermData[] } = $props();

	const state = new WikiIndexState(terms);
</script>

<div class="wiki-index">
	<div class="hero">
		<h1>알콜위키</h1>
		<p class="tagline">막걸리·전통주 양조 용어를 검색하고, 함께 고쳐 쓰는 위키.</p>
		<input
			class="search"
			type="text"
			placeholder="용어 검색"
			aria-label="용어 검색"
			bind:value={state.query}
		/>
	</div>

	{#if state.hasQuery}
		{#if state.isEmpty}
			<p class="empty">검색 결과가 없어요</p>
		{:else}
			<ul class="results">
				{#each state.results as term (term.slug)}
					<li>
						<a href="/wiki/{encodeURIComponent(term.slug)}">
							<h2>{term.title}</h2>
							<p class="summary">{term.summary}</p>
						</a>
					</li>
				{/each}
			</ul>
		{/if}
	{/if}
</div>

<style>
	.wiki-index {
		display: grid;
		gap: var(--ds-space-xl);
	}

	.hero {
		display: grid;
		justify-items: center;
		gap: var(--ds-space-lg);
		text-align: center;
		padding: var(--ds-space-3xl) 0;
	}
	h1 {
		font-family: var(--ds-font-display);
	}
	.tagline {
		font-size: var(--ds-text-lg);
		color: var(--ds-color-ink-2);
		margin: 0;
	}

	.search {
		font: inherit;
		font-size: var(--ds-text-base);
		color: var(--ds-color-ink-1);
		background: var(--ds-color-surface);
		border: var(--ds-border-width) solid var(--ds-color-border-2);
		border-radius: var(--ds-radius-md);
		padding: var(--ds-space-sm) var(--ds-space-md);
		width: 100%;
		transition:
			border-color var(--ds-duration-short) var(--ds-ease-out),
			box-shadow var(--ds-duration-short) var(--ds-ease-out);
	}
	.search::placeholder {
		color: var(--ds-color-ink-4);
	}
	.search:focus {
		outline: none;
		border-color: var(--ds-color-focus);
		box-shadow: 0 0 0 3px color-mix(in srgb, var(--ds-color-focus) 18%, transparent);
	}

	.results {
		list-style: none;
		padding: 0;
		display: grid;
		gap: var(--ds-space-lg);
	}
	.results a {
		display: grid;
		gap: var(--ds-space-xs);
		text-decoration: none;
		color: inherit;
		padding-bottom: var(--ds-space-lg);
		border-bottom: var(--ds-border-width) solid var(--ds-color-border-1);
	}
	.results h2 {
		font-family: var(--ds-font-display);
		font-size: var(--ds-text-lg);
		color: var(--ds-color-ink-1);
		margin: 0;
	}
	.results .summary {
		color: var(--ds-color-ink-2);
		margin: 0;
	}

	.empty {
		color: var(--ds-color-ink-3);
	}
</style>
