<svelte:head>
	<title>알콜미터 - 양조 계산기</title>
</svelte:head>

<div class="landing">
	<!-- Hero -->
	<section class="hero">
		<div class="hero-visual">
			<img
				src="https://images.unsplash.com/photo-1584225064785-c62a8b43d148?w=800&h=400&fit=crop&crop=center"
				alt="전통주 양조"
				class="hero-img"
			/>
			<div class="hero-overlay"></div>
		</div>
		<div class="hero-content">
			<p class="tagline">Brewing Calculator</p>
			<h1>알콜미터</h1>
			<p class="hero-desc">전통주 양조를 위한 정밀 배합 계산기.<br/>쌀의 양만 입력하면 최적의 비율을 알려드립니다.</p>
		</div>
	</section>

	<!-- Drink Selection -->
	<section class="selection">
		<h2>어떤 술을 빚으시나요?</h2>
		<div class="drink-grid">
			<a href="/makgeolli" class="drink-card">
				<div class="drink-info">
					<span class="drink-name">막걸리</span>
					<span class="drink-desc">쌀 + 누룩 + 물</span>
				</div>
				<span class="arrow">→</span>
			</a>

			<div class="drink-card disabled">
				<div class="drink-info">
					<span class="drink-name">사이다</span>
					<span class="drink-desc">사과 + 효모 + 설탕</span>
				</div>
				<span class="badge">준비 중</span>
			</div>

			<div class="drink-card disabled">
				<div class="drink-info">
					<span class="drink-name">와인</span>
					<span class="drink-desc">포도 + 효모</span>
				</div>
				<span class="badge">준비 중</span>
			</div>
		</div>
	</section>
</div>

<style>
	.landing {
		display: flex;
		flex-direction: column;
		gap: 3rem;
		padding-bottom: 3rem;
	}

	/* Hero */
	.hero {
		position: relative;
		border-radius: var(--radius);
		overflow: hidden;
		min-height: 240px;
		display: flex;
		align-items: flex-end;
	}

	.hero-visual {
		position: absolute;
		inset: 0;
	}

	.hero-img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.hero-overlay {
		position: absolute;
		inset: 0;
		background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 100%);
	}

	.hero-content {
		position: relative;
		padding: 2rem 1.5rem;
		color: #ffffff;
	}

	.tagline {
		font-size: 0.7rem;
		text-transform: uppercase;
		letter-spacing: 0.15em;
		opacity: 0.7;
		margin-bottom: 0.5rem;
		font-weight: 700;
	}

	.hero h1 {
		font-size: 2rem;
		font-weight: 800;
		letter-spacing: -0.03em;
		margin-bottom: 0.75rem;
	}

	.hero-desc {
		font-size: 0.85rem;
		line-height: 1.6;
		opacity: 0.85;
		font-weight: 400;
	}

	/* Features */
	/* Selection */
	.selection h2 {
		font-size: 1.1rem;
		font-weight: 800;
		margin-bottom: 1rem;
		letter-spacing: -0.02em;
	}

	.drink-grid {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.drink-card {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1.1rem 1.25rem;
		border-radius: 12px;
		border: 2.5px solid #d1d5db;
		background: #ffffff;
		text-decoration: none;
		color: var(--color-text);
		transition: all 0.15s ease;
	}

	.drink-card:not(.disabled):hover {
		border-color: var(--color-primary);
		background: rgba(37, 99, 235, 0.03);
	}

	.drink-card:not(.disabled):active {
		transform: scale(0.99);
	}

	.drink-card.disabled {
		opacity: 0.35;
		cursor: not-allowed;
	}

	.drink-info {
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
	}

	.drink-name {
		font-size: 0.95rem;
		font-weight: 800;
	}

	.drink-desc {
		font-size: 0.75rem;
		color: var(--color-muted);
		font-weight: 400;
	}

	.arrow {
		font-size: 1.1rem;
		color: var(--color-muted);
	}

	.badge {
		font-size: 0.7rem;
		color: var(--color-muted);
		font-weight: 400;
	}
</style>
