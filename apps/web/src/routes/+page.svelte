<svelte:head>
	<title>알콜미터 - 양조 계산기</title>
	<meta name="description" content="전통주 양조를 위한 정밀 배합 계산기. 막걸리, 사이다, 와인의 최적 배합 비율을 자동으로 계산합니다." />
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
	<section class="section">
		<h2 class="section-title">어떤 술을 빚으시나요?</h2>
		<div class="card-grid">
			<a href="/makgeolli" class="card card--active">
				<div class="card-icon">🍶</div>
				<div class="card-body">
					<span class="card-name">막걸리</span>
					<span class="card-desc">쌀 + 누룩 + 물</span>
				</div>
				<span class="card-arrow">→</span>
			</a>

			<div class="card card--disabled">
				<div class="card-icon">🍺</div>
				<div class="card-body">
					<span class="card-name">사이다</span>
					<span class="card-desc">사과 + 효모 + 설탕</span>
				</div>
				<span class="card-badge">준비 중</span>
			</div>

			<div class="card card--disabled">
				<div class="card-icon">🍷</div>
				<div class="card-body">
					<span class="card-name">와인</span>
					<span class="card-desc">포도 + 효모</span>
				</div>
				<span class="card-badge">준비 중</span>
			</div>
		</div>
	</section>

	<!-- FAQ -->
	<section class="section">
		<h2 class="section-title">양조가 처음이신가요?</h2>
		<a href="/faq" class="banner">
			<div class="banner-content">
				<span class="banner-title">자주 묻는 질문</span>
				<span class="banner-desc">쌀 형태, 양조 방식, 비율 원리, 주의사항까지</span>
			</div>
			<span class="card-arrow">→</span>
		</a>
	</section>
</div>

<style>
	.landing {
		display: flex;
		flex-direction: column;
		gap: 2.5rem;
		padding-bottom: 3rem;
	}

	/* Hero */
	.hero {
		position: relative;
		border-radius: var(--radius-lg);
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

	/* Section */
	.section-title {
		font-size: 1.1rem;
		font-weight: 800;
		margin-bottom: 0.75rem;
		letter-spacing: -0.02em;
	}

	/* Card Grid */
	.card-grid {
		display: flex;
		flex-direction: column;
		gap: 0.625rem;
	}

	.card {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 1rem 1.25rem;
		border-radius: var(--radius-lg);
		background: var(--color-card);
		text-decoration: none;
		color: var(--color-text);
		transition: all 0.2s ease;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
	}

	.card--active {
		background: #ffffff;
		box-shadow: 0 2px 8px rgba(37, 99, 235, 0.08), 0 1px 3px rgba(0, 0, 0, 0.04);
		border: 1.5px solid #e5e7eb;
	}

	.card--active:hover {
		border-color: var(--color-primary);
		box-shadow: 0 4px 12px rgba(37, 99, 235, 0.12), 0 1px 3px rgba(0, 0, 0, 0.04);
		transform: translateY(-1px);
	}

	.card--active:active {
		transform: translateY(0);
	}

	.card--disabled {
		opacity: 0.4;
		cursor: not-allowed;
		border: 1.5px solid transparent;
	}

	.card-icon {
		font-size: 1.5rem;
		flex-shrink: 0;
		width: 2.5rem;
		height: 2.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--color-border);
		border-radius: var(--radius-sm);
	}

	.card-body {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 0.125rem;
	}

	.card-name {
		font-size: 0.95rem;
		font-weight: 800;
	}

	.card-desc {
		font-size: 0.75rem;
		color: var(--color-muted);
	}

	.card-arrow {
		font-size: 1rem;
		color: var(--color-muted);
		flex-shrink: 0;
		transition: transform 0.15s ease;
	}

	.card--active:hover .card-arrow {
		transform: translateX(2px);
		color: var(--color-primary);
	}

	.card-badge {
		font-size: 0.7rem;
		color: var(--color-muted);
		flex-shrink: 0;
	}

	/* FAQ Banner */
	.banner {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1.25rem 1.5rem;
		border-radius: var(--radius-lg);
		background: linear-gradient(135deg, #eff6ff 0%, #f0f4ff 100%);
		border: 1.5px solid #dbeafe;
		text-decoration: none;
		color: var(--color-text);
		transition: all 0.2s ease;
	}

	.banner:hover {
		border-color: var(--color-primary);
		box-shadow: 0 4px 12px rgba(37, 99, 235, 0.1);
		transform: translateY(-1px);
	}

	.banner:active {
		transform: translateY(0);
	}

	.banner-content {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
	}

	.banner-title {
		font-size: 0.95rem;
		font-weight: 800;
		color: var(--color-primary);
	}

	.banner-desc {
		font-size: 0.75rem;
		color: #6b7280;
	}

	.banner:hover .card-arrow {
		transform: translateX(2px);
		color: var(--color-primary);
	}
</style>
