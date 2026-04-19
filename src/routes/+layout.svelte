<script>
	import '../app.css';
	let { children } = $props();
</script>

<div class="app">
	<header>
		<a href="/" class="logo">
			<svg class="logo-icon" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
				<rect width="32" height="32" rx="8" fill="#2563eb"/>
				<circle cx="11" cy="13" r="4.5" fill="#facc15"/>
				<circle cx="21" cy="13" r="3.5" fill="#fb923c"/>
				<circle cx="16" cy="22" r="4" fill="#fbbf24"/>
			</svg>
			<span class="logo-text">알콜미터</span>
		</a>
	</header>
	<main>
		{@render children()}
	</main>
	<footer>
		<span class="version">v0.1.0</span>
	</footer>
</div>

<style>
	.app {
		max-width: var(--max-width);
		margin: 0 auto;
		padding: 1.5rem;
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}

	header {
		padding-bottom: 1.5rem;
		margin-bottom: 1.5rem;
	}

	.logo {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		text-decoration: none;
	}

	.logo-icon {
		width: 1.75rem;
		height: 1.75rem;
	}

	.logo-text {
		font-size: 1.1rem;
		font-weight: 800;
		color: var(--color-text);
		letter-spacing: -0.02em;
	}

	main {
		flex: 1;
	}

	footer {
		text-align: center;
		padding: 2rem 0 0.5rem;
		margin-top: 3rem;
	}

	.version {
		font-size: 0.6rem;
		color: var(--color-muted);
		font-weight: 400;
		opacity: 0.5;
	}
</style>
