<section class="section">
	<h2 class="section-title">양조가 처음이신가요?</h2>
	<div class="learn-cards">
		<a href="/wiki" class="faq-card">
			<span class="faq-body">
				<span class="faq-title">알콜위키</span>
				<span class="faq-desc">고두밥, 밑술, 덧술… 양조 용어를 한곳에서</span>
			</span>
			<span class="entry-arrow">→</span>
		</a>
		<a href="/faq" class="faq-card">
			<span class="faq-body">
				<span class="faq-title">자주 묻는 질문</span>
				<span class="faq-desc">쌀 형태, 양조 방식, 비율 원리, 주의사항까지</span>
			</span>
			<span class="entry-arrow">→</span>
		</a>
	</div>
</section>

<style>
	.section-title {
		font-family: var(--ds-font-display);
		font-size: var(--ds-text-lg);
		font-weight: var(--ds-weight-bold);
		letter-spacing: var(--ds-tracking-tight);
		color: var(--ds-color-ink-1);
		margin-bottom: var(--ds-space-md);
	}

	.entry-arrow {
		font-size: var(--ds-text-lg);
		color: var(--ds-color-ink-3);
		flex: none;
		transition: transform var(--ds-duration-short) var(--ds-ease-out),
			color var(--ds-duration-short) var(--ds-ease-out);
	}

	/* 학습 카드 */
	.learn-cards {
		display: flex;
		flex-direction: column;
		gap: var(--ds-space-sm);
	}

	.faq-card {
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
		transition: border-color var(--ds-duration-short) var(--ds-ease-out),
			transform var(--ds-duration-short) var(--ds-ease-out);
	}

	.faq-body {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.faq-title {
		font-size: var(--ds-text-base);
		font-weight: var(--ds-weight-semibold);
	}

	.faq-desc {
		font-size: var(--ds-text-sm);
		color: var(--ds-color-ink-3);
	}

	.faq-card:hover {
		border-color: var(--ds-color-border-3);
		transform: translateY(-1px);
	}

	.faq-card:hover .entry-arrow {
		transform: translateX(3px);
		color: var(--ds-color-spark);
	}
</style>
