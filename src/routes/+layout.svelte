<script>
	import '../app.css';
	let { children } = $props();
</script>

<div class="app">
	<header>
		<a href="/" class="logo">알콜미터</a>
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
		font-size: 1.1rem;
		font-weight: 800;
		color: var(--color-text);
		text-decoration: none;
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
