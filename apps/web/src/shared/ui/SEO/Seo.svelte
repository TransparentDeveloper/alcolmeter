<script lang="ts">
	// 페이지 공통 SEO·공유 메타를 한곳에서 주입한다.
	// title·description·canonical·Open Graph·Twitter Card를 함께 출력하므로,
	// 각 페이지는 이 컴포넌트 하나만 호출하면 된다 (app.html에는 전역 메타를 두지 않는다).
	let {
		title,
		description,
		path,
		image = '/og/home.png'
	}: {
		title: string;
		description: string;
		/** 사이트 루트 기준 경로 (예: '/makgeolli'). 한글은 호출부에서 encodeURIComponent 처리 */
		path: string;
		/** 사이트 루트 기준 OG 이미지 경로 (1200×630) */
		image?: string;
	} = $props();

	const SITE = 'https://alcolmeter.kr';
	const url = $derived(`${SITE}${path}`);
	const imageUrl = $derived(`${SITE}${image}`);
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={url} />

	<!-- Open Graph -->
	<meta property="og:type" content="website" />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={url} />
	<meta property="og:image" content={imageUrl} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />

	<!-- Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={imageUrl} />
</svelte:head>
