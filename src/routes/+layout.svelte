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
		padding: 1.5rem;
		min-height: 100vh;
	}

	header {
		display: flex;
		align-items: baseline;
		gap: 0.75rem;
		padding-bottom: 1.5rem;
		margin-bottom: 2.5rem;
	}

	.logo {
		font-size: 1.25rem;
		font-weight: 800;
		color: var(--color-text);
		text-decoration: none;
		letter-spacing: -0.02em;
	}

	.version {
		font-size: 0.7rem;
		color: var(--color-muted);
		font-weight: 400;
	}
</style>
