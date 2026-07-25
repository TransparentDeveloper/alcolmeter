<script lang="ts">
	// 페이지 공통 head 메타를 한곳에서 주입한다.
	// title·description·canonical·Open Graph·Twitter Card·JSON-LD를 함께 출력하므로,
	// 각 페이지는 이 컴포넌트 하나만 호출하면 된다 (app.html에는 전역 메타를 두지 않는다).
	let {
		title,
		ogTitle,
		description,
		path,
		image = '/og/home.png',
		imageAlt,
		type = 'website',
		publishedTime,
		modifiedTime,
		authorName,
		noindex = false,
		schemas = []
	}: {
		title: string;
		/** 공유용 제목(og:title·twitter:title). 비우면 title을 쓴다. */
		ogTitle?: string;
		description: string;
		/** 사이트 루트 기준 경로 (예: '/wiki'). 한글은 호출부에서 encodeURIComponent 처리 */
		path: string;
		/** 사이트 루트 기준 OG 이미지 경로(`/og/*`는 1200×630) 또는 절대 URL */
		image?: string;
		/** 공유 이미지 대체 텍스트 */
		imageAlt?: string;
		/** 문서 성격. 커뮤니티 글·위키 용어처럼 시점이 있는 콘텐츠는 'article' */
		type?: 'website' | 'article';
		/** 발행 시각(ISO). type='article'일 때만 방출한다 */
		publishedTime?: string;
		/** 수정 시각(ISO). type='article'일 때만 방출한다 */
		modifiedTime?: string;
		/** 작성자 이름. type='article'일 때만 방출한다 */
		authorName?: string;
		/** 색인 제외. 로그인·작성·수정·이력처럼 공유 대상이 아닌 화면에 쓴다 */
		noindex?: boolean;
		/** JSON-LD 구조화 데이터. 각 요소는 완결된 ld+json 스크립트 태그 마크업 문자열 (JsonLd.create…() 반환값) */
		schemas?: string[];
	} = $props();

	const SITE = 'https://alcolmeter.kr';
	const SITE_NAME = '알콜미터';
	const url = $derived(`${SITE}${path}`);
	const socialTitle = $derived(ogTitle ?? title);
	// image가 절대 URL(대표이미지 등)이면 그대로 쓰고, 사이트 루트 기준 경로면 SITE를 붙인다.
	const imageUrl = $derived(image.startsWith('http') ? image : `${SITE}${image}`);
	// 크기를 아는 이미지는 우리가 만든 /og/*.png(1200×630)뿐이다. 업로드·외부 이미지에까지
	// 1200×630을 붙이면 크기를 거짓 신고해 카카오·슬랙 카드가 어긋난다.
	const hasKnownSize = $derived(image.startsWith('/og/'));
	const isArticle = $derived(type === 'article');
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={url} />
	{#if noindex}
		<meta name="robots" content="noindex, nofollow" />
	{/if}

	<!-- Open Graph -->
	<meta property="og:type" content={type} />
	<meta property="og:site_name" content={SITE_NAME} />
	<meta property="og:locale" content="ko_KR" />
	<meta property="og:title" content={socialTitle} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={url} />
	<meta property="og:image" content={imageUrl} />
	{#if hasKnownSize}
		<meta property="og:image:width" content="1200" />
		<meta property="og:image:height" content="630" />
	{/if}
	{#if imageAlt}
		<meta property="og:image:alt" content={imageAlt} />
	{/if}
	{#if isArticle && publishedTime}
		<meta property="article:published_time" content={publishedTime} />
	{/if}
	{#if isArticle && modifiedTime}
		<meta property="article:modified_time" content={modifiedTime} />
	{/if}
	{#if isArticle && authorName}
		<meta property="article:author" content={authorName} />
	{/if}

	<!-- Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={socialTitle} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={imageUrl} />
	{#if imageAlt}
		<meta name="twitter:image:alt" content={imageAlt} />
	{/if}

	<!-- 구조화 데이터 (JSON-LD) -->
	{#each schemas as schema}
		{@html schema}
	{/each}
</svelte:head>
