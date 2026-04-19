<script>
	import '../app.css';
	let { children } = $props();
</script>

<div class="app">
	<main>
		{@render children()}
	</main>
	<footer>
		<a href="/" class="logo">알콜미터</a>
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

	main {
		flex: 1;
	}

	footer {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		padding: 2rem 0 1rem;
		margin-top: 3rem;
	}

	.logo {
		font-size: 0.8rem;
		font-weight: 700;
		color: var(--color-muted);
		text-decoration: none;
	}

	.version {
		font-size: 0.65rem;
		color: var(--color-muted);
		font-weight: 400;
		opacity: 0.6;
	}
</style>
