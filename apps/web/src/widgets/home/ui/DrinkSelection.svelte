<section class="section">
	<h2 class="section-title">양조 계산기</h2>
	<p class="section-desc">재료만 넣으면 배합 비율을 계산해 드려요.</p>
	<div class="entries">
		<a href="/calculate-makgeolli" class="entry entry--active">
			<span class="entry-no">01</span>
			<span class="entry-body">
				<span class="entry-name">막걸리</span>
				<span class="entry-desc">쌀 + 누룩 + 물</span>
			</span>
			<span class="entry-arrow">→</span>
		</a>

		<div class="entry entry--disabled">
			<span class="entry-no">02</span>
			<span class="entry-body">
				<span class="entry-name">사이다</span>
				<span class="entry-desc">사과 + 효모 + 설탕</span>
			</span>
			<span class="entry-badge">준비 중</span>
		</div>

		<div class="entry entry--disabled">
			<span class="entry-no">03</span>
			<span class="entry-body">
				<span class="entry-name">와인</span>
				<span class="entry-desc">포도 + 효모</span>
			</span>
			<span class="entry-badge">준비 중</span>
		</div>
	</div>
</section>

<style>
	.section-title {
		font-family: var(--ds-font-display);
		font-size: var(--ds-text-lg);
		font-weight: var(--ds-weight-bold);
		letter-spacing: var(--ds-tracking-tight);
		color: var(--ds-color-ink-1);
	}

	.section-desc {
		font-size: var(--ds-text-sm);
		color: var(--ds-color-ink-3);
		margin-bottom: var(--ds-space-md);
	}

	/* Entries — numbered notebook rows, md 이상 3열 (design-system 브레이크포인트 md 768px) */
	.entries {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--ds-space-sm);
	}

	.entry {
		display: flex;
		align-items: center;
		gap: var(--ds-space-md);
		padding: var(--ds-space-md) var(--ds-space-lg);
		border: var(--ds-border-width) solid var(--ds-color-border-2);
		border-radius: var(--ds-radius-md);
		background: var(--ds-color-surface);
		text-decoration: none;
		color: var(--ds-color-ink-1);
		transition: border-color var(--ds-duration-short) var(--ds-ease-out),
			transform var(--ds-duration-short) var(--ds-ease-out),
			box-shadow var(--ds-duration-short) var(--ds-ease-out);
	}

	.entry-no {
		font-family: var(--ds-font-mono);
		font-size: var(--ds-text-sm);
		color: var(--ds-color-ink-3);
		font-variant-numeric: tabular-nums;
		flex: none;
	}

	.entry-body {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.entry-name {
		font-size: var(--ds-text-base);
		font-weight: var(--ds-weight-semibold);
	}

	.entry-desc {
		font-family: var(--ds-font-mono);
		font-size: var(--ds-text-xs);
		color: var(--ds-color-ink-3);
	}

	.entry-arrow {
		font-size: var(--ds-text-lg);
		color: var(--ds-color-ink-3);
		flex: none;
		transition: transform var(--ds-duration-short) var(--ds-ease-out),
			color var(--ds-duration-short) var(--ds-ease-out);
	}

	.entry--active:hover {
		border-color: var(--ds-color-border-3);
		box-shadow: var(--ds-shadow-paper);
		transform: translateY(-1px);
	}

	.entry--active:hover .entry-arrow {
		transform: translateX(3px);
		color: var(--ds-color-spark);
	}

	.entry--active:hover .entry-no {
		color: var(--ds-color-spark);
	}

	.entry--disabled {
		opacity: 0.55;
		cursor: not-allowed;
		border-style: dashed;
		border-color: var(--ds-color-border-1);
	}

	.entry-badge {
		font-family: var(--ds-font-mono);
		font-size: var(--ds-text-xs);
		color: var(--ds-color-ink-4);
		flex: none;
	}

	@media (min-width: 768px) {
		.entries {
			grid-template-columns: repeat(3, 1fr);
		}
	}
</style>
