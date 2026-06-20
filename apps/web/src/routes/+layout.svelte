<script>
	import '@alcolmeter/design-system/tokens.css';
	import '../app.css';
	import { afterNavigate } from '$app/navigation';
	let { children } = $props();
	const version = __APP_VERSION__;

	afterNavigate(({ from, to }) => {
		if (from && typeof gtag !== 'undefined' && to) {
			gtag('event', 'page_view', {
				page_path: to.url.pathname
			});
		}
	});
</script>

<div class="app">
	<header>
		<a href="/" class="logo">
			<span class="logo-text">알콜미터<span class="logo-dot">.</span></span>
		</a>
		<span class="logo-meta">BREWING CALCULATOR</span>
	</header>
	<main>
		{@render children()}
	</main>
	<footer>
		<span class="version">v{version}</span>
	</footer>
</div>

<style>
	.app {
		max-width: var(--ds-container);
		margin: 0 auto;
		padding: var(--ds-space-xl);
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}

	header {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: var(--ds-space-md);
		padding-bottom: var(--ds-space-lg);
		margin-bottom: var(--ds-space-2xl);
		border-bottom: var(--ds-border-width) solid var(--ds-color-border-1);
	}

	.logo {
		text-decoration: none;
	}

	.logo-text {
		font-family: var(--ds-font-display);
		font-size: var(--ds-text-lg);
		font-weight: var(--ds-weight-bold);
		color: var(--ds-color-ink-1);
		letter-spacing: var(--ds-tracking-tight);
	}

	.logo-dot {
		color: var(--ds-color-spark);
	}

	.logo-meta {
		font-family: var(--ds-font-mono);
		font-size: var(--ds-text-xs);
		letter-spacing: 0.08em;
		color: var(--ds-color-ink-3);
	}

	main {
		flex: 1;
	}

	footer {
		text-align: center;
		padding: var(--ds-space-2xl) 0 var(--ds-space-sm);
		margin-top: var(--ds-space-3xl);
	}

	.version {
		font-family: var(--ds-font-mono);
		font-size: var(--ds-text-xs);
		color: var(--ds-color-ink-4);
	}
</style>
