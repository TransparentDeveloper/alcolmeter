<section class="section">
	<a href="/wiki" class="wiki-card">
		<span class="body">
			<span class="title">알콜위키</span>
			<span class="desc">전통주 양조 용어를 함께 만드는 위키. 궁금한 용어를 찾아보세요.</span>
		</span>
		<span class="arrow">→</span>
	</a>
</section>

<style>
	.wiki-card {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--ds-space-md);
		padding: var(--ds-space-lg);
		border: var(--ds-border-width) solid var(--ds-color-border-2);
		border-radius: var(--ds-radius-md);
		background: var(--ds-color-surface);
		text-decoration: none;
		color: var(--ds-color-ink-1);
		transition:
			border-color var(--ds-duration-short) var(--ds-ease-out),
			transform var(--ds-duration-short) var(--ds-ease-out);
	}
	.wiki-card:hover {
		border-color: var(--ds-color-border-3);
		transform: translateY(-1px);
	}
	.body {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}
	.title {
		font-size: var(--ds-text-base);
		font-weight: var(--ds-weight-semibold);
	}
	.desc {
		font-size: var(--ds-text-sm);
		color: var(--ds-color-ink-3);
	}
	.arrow {
		font-size: var(--ds-text-lg);
		color: var(--ds-color-ink-3);
		flex: none;
		transition:
			transform var(--ds-duration-short) var(--ds-ease-out),
			color var(--ds-duration-short) var(--ds-ease-out);
	}
	.wiki-card:hover .arrow {
		transform: translateX(3px);
		color: var(--ds-color-spark);
	}
</style>
