<script>
	import '@alcolmeter/design-system/tokens.css';
	import '@alcolmeter/design-system/motion.css';
	import '../app.css';
	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import { HeaderAuth } from '$widgets/auth/ui';
	import { ThemeToggle } from '$features/theme/ui';
	import { SiteMeta } from '$shared/ui';
	import { DialogProvider } from '$apps/root/ui';
	let { children } = $props();
	const version = __APP_VERSION__;
	const faviconVersion = __FAVICON_VERSION__;

	// 홈·계산기·위키 목록·커뮤니티 목록·이용 안내는 hub 폭(1280).
	const HUB_ROUTES = [
		'/',
		'/calculate-makgeolli',
		'/calculate-cider',
		'/privacy',
		'/wiki',
		'/wiki/guidelines',
		'/community'
	];
	// 위키·커뮤니티의 상세·작성·수정은 넓은 데스크탑 폭(정보 테이블·본문). 위키 이력은 기본 폭.
	const WIDE_ROUTES = [
		'/wiki/[slug]',
		'/wiki/new',
		'/wiki/[slug]/edit',
		'/community/[id]',
		'/community/new',
		'/community/[id]/edit'
	];

	afterNavigate(({ from, to }) => {
		if (from && typeof gtag !== 'undefined' && to) {
			gtag('event', 'page_view', {
				page_path: to.url.pathname
			});
		}
	});
</script>

<svelte:head>
	<link rel="icon" type="image/svg+xml" href={`/favicon.svg?v=${faviconVersion}`} />
</svelte:head>

<SiteMeta />

<DialogProvider>
<div
	class="app"
	class:app--hub={HUB_ROUTES.includes(page.url.pathname)}
	class:app--wide={WIDE_ROUTES.includes(page.route.id ?? '')}
>
	<header>
		<a href="/" class="logo">
			<span class="logo-text">알콜미터<span class="logo-dot">.</span></span>
		</a>
		<div class="header-right">
			<ThemeToggle />
			<HeaderAuth />
		</div>
	</header>
	<main>
		{@render children()}
	</main>
	{#if page.url.pathname !== '/login'}
		<footer>
			<nav class="footer-links">
				<div class="footer-col">
					<a href="/community">커뮤니티</a>
					<a href="/wiki">알콜위키</a>
				</div>
				<div class="footer-col">
					<a href="/calculate-makgeolli">막걸리 계산기</a>
					<a href="/calculate-cider">사이다 계산기</a>
				</div>
				<div class="footer-col">
					{#if page.url.pathname === '/wiki' || page.url.pathname.startsWith('/wiki/')}
						<a href="/wiki/guidelines">이용 안내</a>
					{/if}
					<a href="/faq">자주 묻는 질문</a>
					<a href="/privacy">개인정보처리방침</a>
					<a href="/settings">설정</a>
				</div>
			</nav>
			<span class="version">v{version}</span>
		</footer>
	{/if}
</div>
</DialogProvider>

<style>
	.app {
		max-width: var(--ds-container);
		margin: 0 auto;
		padding: var(--ds-space-xl);
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}

	/* 홈(커뮤니티 허브)·계산기는 넓은 데스크탑 폭 */
	.app--hub {
		max-width: var(--ds-container-hub);
	}

	/* 위키 상세는 읽는 문서라 중간 폭(정보 테이블·본문이 모바일 폭에 갇히지 않게) */
	.app--wide {
		max-width: var(--ds-container-wide);
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

	.header-right {
		display: flex;
		align-items: center;
		gap: var(--ds-space-md);
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

	main {
		flex: 1;
	}

	footer {
		text-align: center;
		padding: var(--ds-space-2xl) 0 var(--ds-space-sm);
		margin-top: var(--ds-space-3xl);
	}

	.footer-links {
		display: flex;
		flex-wrap: wrap;
		gap: var(--ds-space-2xl);
		justify-content: start;
		margin-bottom: var(--ds-space-md);
	}

	.footer-col {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: var(--ds-space-xs);
	}

	.footer-links a {
		font-family: var(--ds-font-mono);
		font-size: var(--ds-text-xs);
		color: var(--ds-color-ink-3);
		text-decoration: none;
		transition: color var(--ds-duration-short) var(--ds-ease-out);
	}

	.footer-links a:hover {
		color: var(--ds-color-spark);
	}

	.version {
		display: block;
		text-align: right;
		font-family: var(--ds-font-mono);
		font-size: var(--ds-text-xs);
		color: var(--ds-color-ink-4);
	}
</style>
