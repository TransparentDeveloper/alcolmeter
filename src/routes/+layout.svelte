<script>
	import '../app.css';
	let { children } = $props();
</script>

<div class="app">
	<header>
		<a href="/" class="logo">알콜미터</a>
		<span class="version">v0.1.0</span>
	</header>
	<main>
		{@render children()}
	</main>
</div>

<style>
	.app {
		max-width: var(--max-width);
		margin: 0 auto;
		padding: 1rem;
	}

	header {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 1rem 0;
		border-bottom: 1px solid var(--color-border);
		margin-bottom: 2rem;
	}

	.logo {
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--color-primary);
		text-decoration: none;
	}

	.version {
		font-size: 0.75rem;
		color: var(--color-muted);
	}
</style>
