<script lang="ts">
	import { terms } from '$entities/dictionary/lib';
	import { DictionaryView } from './DictionaryView.svelte';

	const dict = new DictionaryView(terms);
</script>

<div class="dict">
	<header class="dict-header">
		<h1>용어사전</h1>
		<p>막걸리·전통주 양조 용어를 입문자 눈높이로 풀어 설명합니다.</p>
	</header>

	<div class="search">
		<input
			type="search"
			placeholder="용어 검색 (예: 고두밥, 덧술)"
			bind:value={dict.query}
			aria-label="용어 검색"
		/>
		<span class="count">{dict.count} / {dict.total}</span>
	</div>

	{#if dict.count === 0}
		<p class="empty">검색 결과가 없습니다.</p>
	{:else}
		{#each dict.groups as group (group.category)}
			<section class="group">
				<h2>{group.category}</h2>
				<ul>
					{#each group.items as term (term.slug)}
						<li>
							<a href="/dictionary/{term.slug}">
								<strong>{term.title}</strong>
								<span>{term.summary}</span>
							</a>
						</li>
					{/each}
				</ul>
			</section>
		{/each}
	{/if}
</div>

<style>
	.dict {
		display: flex;
		flex-direction: column;
		gap: var(--ds-space-xl);
		padding-bottom: 3rem;
	}

	.dict-header h1 {
		font-family: var(--ds-font-display);
		font-size: var(--ds-text-2xl);
		font-weight: var(--ds-weight-bold);
		letter-spacing: var(--ds-tracking-tight);
		color: var(--ds-color-ink-1);
		margin-bottom: var(--ds-space-sm);
	}

	.dict-header p {
		font-size: 0.85rem;
		color: var(--ds-color-ink-3);
		line-height: 1.5;
	}

	/* Search */
	.search {
		display: flex;
		align-items: center;
		gap: var(--ds-space-md);
	}

	.search input {
		flex: 1;
		padding: var(--ds-space-sm) var(--ds-space-md);
		font-size: var(--ds-text-sm);
		color: var(--ds-color-ink-1);
		background: var(--ds-color-surface);
		border: var(--ds-border-width) solid var(--ds-color-border-2);
		border-radius: var(--ds-radius-sm);
		transition: border-color var(--ds-duration-short) var(--ds-ease-out);
	}

	.search input:focus {
		outline: none;
		border-color: var(--ds-color-action);
	}

	.count {
		font-family: var(--ds-font-mono);
		font-size: var(--ds-text-xs);
		font-variant-numeric: tabular-nums;
		color: var(--ds-color-ink-3);
		flex-shrink: 0;
	}

	.empty {
		font-size: var(--ds-text-sm);
		color: var(--ds-color-ink-3);
		padding: var(--ds-space-xl) 0;
		text-align: center;
	}

	/* Group */
	.group {
		display: flex;
		flex-direction: column;
		gap: var(--ds-space-sm);
	}

	.group h2 {
		font-family: var(--ds-font-display);
		font-size: var(--ds-text-lg);
		font-weight: var(--ds-weight-bold);
		letter-spacing: var(--ds-tracking-tight);
		color: var(--ds-color-ink-1);
		margin-bottom: var(--ds-space-2xs);
	}

	.group ul {
		list-style: none;
		display: flex;
		flex-direction: column;
		gap: var(--ds-space-sm);
	}

	.group a {
		display: flex;
		flex-direction: column;
		gap: var(--ds-space-2xs);
		padding: var(--ds-space-md) var(--ds-space-lg);
		background: var(--ds-color-surface);
		border: var(--ds-border-width) solid var(--ds-color-border-2);
		border-radius: var(--ds-radius-md);
		box-shadow: var(--ds-shadow-paper);
		text-decoration: none;
		transition: border-color var(--ds-duration-short) var(--ds-ease-out);
	}

	.group a:hover {
		border-color: var(--ds-color-border-3);
	}

	.group a strong {
		font-size: var(--ds-text-sm);
		font-weight: var(--ds-weight-bold);
		color: var(--ds-color-ink-1);
	}

	.group a span {
		font-size: var(--ds-text-xs);
		color: var(--ds-color-ink-3);
		line-height: 1.6;
	}
</style>
