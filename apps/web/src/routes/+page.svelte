<svelte:head>
	<title>알콜미터 - 양조 계산기</title>
	<meta name="description" content="전통주 양조를 위한 정밀 배합 계산기. 막걸리, 사이다, 와인의 최적 배합 비율을 자동으로 계산합니다." />
	<link rel="canonical" href="https://alcolmeter.kr/" />
</svelte:head>

<div class="landing">
	<!-- Hero -->
	<section class="hero ds-paper-grid">
		<p class="eyebrow">정밀 배합 · 양조 노트</p>
		<h1>알콜미터</h1>
		<p class="hero-desc">
			전통주 양조를 위한 정밀 배합 계산기.<br />쌀의 양만 입력하면 최적의 비율을 알려드립니다.
		</p>
	</section>

	<!-- Drink Selection -->
	<section class="section">
		<h2 class="section-title">어떤 술을 빚으시나요?</h2>
		<div class="entries">
			<a href="/makgeolli" class="entry entry--active">
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

	<!-- FAQ -->
	<section class="section">
		<h2 class="section-title">양조가 처음이신가요?</h2>
		<a href="/faq" class="faq-card">
			<span class="faq-body">
				<span class="faq-title">자주 묻는 질문</span>
				<span class="faq-desc">쌀 형태, 양조 방식, 비율 원리, 주의사항까지</span>
			</span>
			<span class="entry-arrow">→</span>
		</a>
	</section>
</div>

<style>
	.landing {
		display: flex;
		flex-direction: column;
		gap: var(--ds-space-3xl);
		padding-bottom: var(--ds-space-2xl);
	}

	/* Hero — measurement-notebook paper */
	.hero {
		border: var(--ds-border-width) solid var(--ds-color-border-2);
		border-radius: var(--ds-radius-lg);
		box-shadow: var(--ds-shadow-paper);
		padding: var(--ds-space-2xl) var(--ds-space-xl);
	}

	.eyebrow {
		font-family: var(--ds-font-mono);
		font-size: var(--ds-text-xs);
		font-weight: var(--ds-weight-medium);
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--ds-color-ink-3);
		margin-bottom: var(--ds-space-md);
	}

	.hero h1 {
		font-family: var(--ds-font-display);
		font-size: var(--ds-text-3xl);
		font-weight: var(--ds-weight-bold);
		line-height: var(--ds-leading-tight);
		letter-spacing: var(--ds-tracking-tight);
		color: var(--ds-color-ink-1);
	}

	.hero-desc {
		margin-top: var(--ds-space-md);
		font-size: var(--ds-text-base);
		color: var(--ds-color-ink-2);
		max-width: 42ch;
	}

	/* Section */
	.section-title {
		font-family: var(--ds-font-display);
		font-size: var(--ds-text-lg);
		font-weight: var(--ds-weight-bold);
		letter-spacing: var(--ds-tracking-tight);
		color: var(--ds-color-ink-1);
		margin-bottom: var(--ds-space-md);
	}

	/* Entries — numbered notebook rows */
	.entries {
		display: flex;
		flex-direction: column;
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

	/* FAQ card */
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
