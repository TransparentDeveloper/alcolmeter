<script lang="ts">
	// 사이트 전역 구조화 데이터(브랜드 엔티티). 페이지별 메타는 MetaHead가 맡고,
	// 이건 전 페이지에 한 번씩 깔려야 하므로 루트 레이아웃에서만 호출한다.
	import { JsonLd } from '$shared/lib';

	const SITE = 'https://alcolmeter.kr';
	const NAME = '알콜미터';
	const TAGLINE = '술을 빚는 사람과 즐기는 사람 모두의 커뮤니티';
	const DESCRIPTION = `${TAGLINE}. 양조 기록과 후기를 나누고, 알콜위키로 용어를 익히고, 계산기로 배합과 도수를 잡습니다.`;

	const organization = JsonLd.createOrganizationSchemaMarkup({
		name: NAME,
		url: SITE,
		logo: `${SITE}/favicon.svg`,
		description: DESCRIPTION
	});
	const website = JsonLd.createWebSiteSchemaMarkup({
		name: NAME,
		url: SITE,
		description: DESCRIPTION,
		publisherName: NAME
	});
</script>

<svelte:head>
	{@html organization}
	{@html website}
</svelte:head>
