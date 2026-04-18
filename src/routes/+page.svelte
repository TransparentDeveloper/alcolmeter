<svelte:head>
	<title>알콜미터 - 양조 계산기</title>
</svelte:head>

<div class="landing">
	<p class="tagline">양조 계산기</p>
	<h1>어떤 술을 빚으시나요?</h1>

	<div class="drink-grid">
		<a href="/makgeolli" class="drink-card">
			<span class="name">막걸리</span>
			<span class="arrow">→</span>
		</a>

		<div class="drink-card disabled">
			<span class="name">사이다</span>
			<span class="badge">준비 중</span>
		</div>

		<div class="drink-card disabled">
			<span class="name">와인</span>
			<span class="badge">준비 중</span>
		</div>
	</div>
</div>

<style>
	.landing {
		padding: 4rem 0 2rem;
	}

	.tagline {
		font-size: 0.8rem;
		color: var(--color-muted);
		text-transform: uppercase;
		letter-spacing: 0.1em;
		margin-bottom: 0.5rem;
	}

	h1 {
		font-size: 1.5rem;
		font-weight: 800;
		margin-bottom: 3rem;
		color: var(--color-text);
		letter-spacing: -0.02em;
	}

	.drink-grid {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.drink-card {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1.25rem 1.5rem;
		border-radius: var(--radius);
		border: 2px solid #d1d5db;
		background: var(--color-card);
		text-decoration: none;
		color: var(--color-text);
		transition: all 0.15s ease;
	}

	.drink-card:not(.disabled):hover {
		background: var(--color-border);
	}

	.drink-card:not(.disabled):active {
		transform: scale(0.99);
	}

	.drink-card.disabled {
		opacity: 0.35;
		cursor: not-allowed;
	}

	.name {
		font-size: 1rem;
		font-weight: 700;
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
