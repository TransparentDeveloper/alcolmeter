<script lang="ts">
	import type { WikiTermData } from '$entities/wiki/model';
	import { EntryCard } from '$shared/ui';
	import { WikiIndexState } from './WikiIndexState.svelte';

	let { terms }: { terms: WikiTermData[] } = $props();

	const state = new WikiIndexState(terms);
</script>

<div class="wiki-index">
	<input
		class="search"
		type="text"
		placeholder="용어 검색"
		aria-label="용어 검색"
		bind:value={state.query}
	/>

	<div class="chips" role="group" aria-label="카테고리 필터">
		<button
			type="button"
			class="chip"
			class:active={state.activeCategory === null}
			aria-pressed={state.activeCategory === null}
			onclick={() => state.clearCategory()}
		>
			전체
		</button>
		{#each state.categories as category (category)}
			<button
				type="button"
				class="chip"
				class:active={state.activeCategory === category}
				aria-pressed={state.activeCategory === category}
				onclick={() => state.selectCategory(category)}
			>
				{category}
			</button>
		{/each}
	</div>

	{#if state.isEmpty}
		<p class="empty">검색 결과가 없어요</p>
	{:else}
		<div class="grid">
			{#each state.displayed as term (term.slug)}
				{@const meta = term.category
					? `${term.category} · ${term.updatedAt.slice(0, 10)}`
					: term.updatedAt.slice(0, 10)}
				<EntryCard
					href="/wiki/{encodeURIComponent(term.slug)}"
					title={term.title}
					description={term.summary}
					{meta}
				/>
			{/each}
		</div>
	{/if}
</div>

<style>
	.wiki-index {
		display: grid;
		gap: var(--ds-space-xl);
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

	.chips {
		display: flex;
		gap: var(--ds-space-sm);
		flex-wrap: wrap;
	}
	.chip {
		font: inherit;
		font-size: var(--ds-text-xs);
		font-weight: var(--ds-weight-medium);
		color: var(--ds-color-ink-2);
		background: transparent;
		border: var(--ds-border-width) solid var(--ds-color-border-2);
		border-radius: var(--ds-radius-full);
		padding: var(--ds-space-2xs) var(--ds-space-md);
		cursor: pointer;
		transition:
			border-color var(--ds-duration-short) var(--ds-ease-out),
			color var(--ds-duration-short) var(--ds-ease-out);
	}
	.chip:hover {
		border-color: var(--ds-color-border-3);
		color: var(--ds-color-ink-1);
	}
	.chip.active {
		border-color: var(--ds-color-border-3);
		color: var(--ds-color-ink-1);
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr));
		gap: var(--ds-space-lg);
	}

	.empty {
		color: var(--ds-color-ink-3);
	}
</style>
