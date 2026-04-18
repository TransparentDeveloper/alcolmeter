<svelte:head>
	<title>알콜미터 - 양조 계산기</title>
</svelte:head>

<div class="landing">
	<h1>어떤 술을 빚으시나요?</h1>

	<div class="drink-grid">
		<a href="/makgeolli" class="drink-card active">
			<span class="emoji">🍶</span>
			<span class="name">막걸리</span>
		</a>

		<div class="drink-card disabled">
			<span class="emoji">🍺</span>
			<span class="name">사이다</span>
			<span class="badge">준비 중</span>
		</div>

		<div class="drink-card disabled">
			<span class="emoji">🍷</span>
			<span class="name">와인</span>
			<span class="badge">준비 중</span>
		</div>
	</div>
</div>

<style>
	.landing {
		text-align: center;
		padding: 2rem 0;
	}

	h1 {
		font-size: 1.75rem;
		margin-bottom: 2rem;
		color: var(--color-text);
	}

	.drink-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
		gap: 1rem;
		max-width: 600px;
		margin: 0 auto;
	}

	.drink-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		padding: 2rem 1rem;
		border-radius: 12px;
		border: 2px solid var(--color-border);
		background: var(--color-card);
		text-decoration: none;
		color: var(--color-text);
		transition: all 0.2s;
		position: relative;
	}

	.drink-card.active:hover {
		border-color: var(--color-primary);
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	}

	.drink-card.disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.emoji {
		font-size: 2.5rem;
	}

	.name {
		font-size: 1.1rem;
		font-weight: 600;
	}

	.badge {
		font-size: 0.7rem;
		background: var(--color-muted);
		color: white;
		padding: 0.2rem 0.5rem;
		border-radius: 4px;
	}
</style>
