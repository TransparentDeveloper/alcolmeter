<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
</script>

<Seo
	title="알콜미터 - 양조 계산기"
	description="전통주 양조를 위한 정밀 배합 계산기. 막걸리, 사이다, 와인의 최적 배합 비율을 자동으로 계산합니다."
	path="/"
	image="/og/home.png"
/>

<div class="landing">
	<!-- Hero -->
	<section class="hero ds-paper-grid">
		<div class="ds-fizz" aria-hidden="true">
			<span class="ds-fizz__bubble" style="left:9%;width:6px;height:6px;animation-delay:0s;animation-duration:4.4s"></span>
			<span class="ds-fizz__bubble" style="left:21%;width:9px;height:9px;animation-delay:1.6s;animation-duration:5.2s"></span>
			<span class="ds-fizz__bubble" style="left:34%;width:5px;height:5px;animation-delay:0.8s;animation-duration:3.8s"></span>
			<span class="ds-fizz__bubble" style="left:47%;width:8px;height:8px;animation-delay:2.4s;animation-duration:4.9s"></span>
			<span class="ds-fizz__bubble" style="left:58%;width:6px;height:6px;animation-delay:0.4s;animation-duration:4.2s"></span>
			<span class="ds-fizz__bubble" style="left:69%;width:10px;height:10px;animation-delay:3.1s;animation-duration:5.6s"></span>
			<span class="ds-fizz__bubble" style="left:80%;width:5px;height:5px;animation-delay:1.2s;animation-duration:3.6s"></span>
			<span class="ds-fizz__bubble" style="left:90%;width:7px;height:7px;animation-delay:2.0s;animation-duration:4.7s"></span>
		</div>
		<div class="hero-content">
			<p class="eyebrow">정밀 배합 · 양조 노트</p>
			<h1 class="hero-title">
				알콜미터
				<svg class="hero-underline" viewBox="0 0 220 12" preserveAspectRatio="none" aria-hidden="true">
					<path
						class="ds-underline-draw"
						pathLength="1"
						d="M3,8 C42,2 84,11 124,6 C156,2 192,10 217,5"
						fill="none"
						stroke="currentColor"
						stroke-width="3"
						stroke-linecap="round"
					/>
				</svg>
			</h1>
			<p class="hero-desc">
				전통주 양조를 위한 정밀 배합 계산기.<br />쌀의 양만 입력하면 최적의 비율을 알려드립니다.
			</p>
		</div>
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

	<!-- 학습 -->
	<section class="section">
		<h2 class="section-title">양조가 처음이신가요?</h2>
		<div class="learn-cards">
			<a href="/dictionary" class="faq-card">
				<span class="faq-body">
					<span class="faq-title">용어사전</span>
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
		position: relative;
		overflow: hidden;
		border: var(--ds-border-width) solid var(--ds-color-border-2);
		border-radius: var(--ds-radius-lg);
		box-shadow: var(--ds-shadow-paper);
		padding: var(--ds-space-2xl) var(--ds-space-xl);
	}

	.hero-content {
		position: relative;
		z-index: 1;
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

	.hero-title {
		position: relative;
		display: inline-block;
		font-family: var(--ds-font-display);
		font-size: var(--ds-text-3xl);
		font-weight: var(--ds-weight-bold);
		line-height: var(--ds-leading-tight);
		letter-spacing: var(--ds-tracking-tight);
		color: var(--ds-color-ink-1);
	}

	.hero-underline {
		position: absolute;
		left: 0;
		right: 0;
		bottom: -0.35em;
		width: 100%;
		height: 0.4em;
		color: var(--ds-color-spark);
		overflow: visible;
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
