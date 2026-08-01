<script lang="ts">
	let {
		label,
		sections,
		activeId
	}: {
		label: string;
		sections: readonly { id: string; title: string }[];
		activeId: string;
	} = $props();
</script>

<nav class="toc" aria-label={label}>
	<ol class="toc-list">
		{#each sections as s, i (s.id)}
			<li>
				<a
					href="#{s.id}"
					class="toc-item"
					class:active={activeId === s.id}
					aria-current={activeId === s.id ? 'true' : undefined}
				>
					<span class="toc-num">{String(i + 1).padStart(2, '0')}</span>
					<span class="toc-title">{s.title}</span>
				</a>
			</li>
		{/each}
	</ol>
</nav>

<style>
	.toc {
		font-family: var(--ds-font-mono);
	}

	.toc-list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-wrap: wrap;
		gap: var(--ds-space-xs);
	}

	/* 모바일 기본: 상단 pill 묶음 */
	.toc-item {
		display: inline-flex;
		align-items: center;
		gap: var(--ds-space-xs);
		padding: var(--ds-space-2xs) var(--ds-space-sm);
		font-size: var(--ds-text-xs);
		color: var(--ds-color-ink-2);
		background: var(--ds-color-surface);
		border: var(--ds-border-width) solid var(--ds-color-border-2);
		border-radius: var(--ds-radius-sm);
		text-decoration: none;
		transition:
			color var(--ds-duration-short) var(--ds-ease-out),
			border-color var(--ds-duration-short) var(--ds-ease-out),
			background-color var(--ds-duration-short) var(--ds-ease-out);
	}

	.toc-item:hover {
		border-color: var(--ds-color-border-3);
		background: var(--ds-color-hover);
		color: var(--ds-color-ink-1);
	}

	.toc-num {
		font-variant-numeric: tabular-nums;
		color: var(--ds-color-ink-4);
	}

	.toc-item.active {
		color: var(--ds-color-on-action);
		background: var(--ds-color-action);
		border-color: var(--ds-color-action);
	}

	.toc-item.active .toc-num {
		color: var(--ds-color-on-action);
	}

	/* 데스크탑: 세로 고정 사이드 목차 (좌측 액센트 바) */
	@media (min-width: 56rem) {
		.toc {
			position: sticky;
			top: var(--ds-space-xl);
		}

		.toc-list {
			flex-direction: column;
			flex-wrap: nowrap;
			gap: 0;
		}

		.toc-item {
			width: 100%;
			background: transparent;
			border: none;
			border-left: 2px solid transparent;
			border-radius: 0;
			padding: var(--ds-space-xs) var(--ds-space-md);
			color: var(--ds-color-ink-3);
		}

		.toc-item:hover {
			background: transparent;
			border-left-color: var(--ds-color-border-3);
			color: var(--ds-color-ink-1);
		}

		.toc-item.active {
			background: transparent;
			border-left-color: var(--ds-color-action);
			color: var(--ds-color-ink-1);
			font-weight: var(--ds-weight-semibold);
		}

		.toc-item.active .toc-num {
			color: var(--ds-color-action);
		}
	}
</style>
