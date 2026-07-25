<script lang="ts">
	import { MetaHead } from '$shared/ui';
	import { JsonLd } from '$shared/lib';
	import type { WikiTermData } from '$entities/wiki/model';
	import { WikiListPage } from '$pages/wiki/ui';

	let { terms }: { terms: WikiTermData[] } = $props();

	const schema = $derived(
		JsonLd.createDefinedTermSetSchemaMarkup({
			name: '알콜위키',
			description: '술과 양조의 용어를 입문자 눈높이로 함께 써 나가는 참여형 위키.',
			url: 'https://alcolmeter.kr/wiki',
			terms: terms.map((t) => ({ name: t.title, description: t.summary, url: `https://alcolmeter.kr/wiki/${encodeURIComponent(t.slug)}` }))
		})
	);
</script>

<MetaHead
	title="알콜위키 - 술과 양조 용어 위키 - 알콜미터"
	description="술과 양조의 용어를 입문자 눈높이로 함께 써 나가는 참여형 위키. 고두밥, 밑술, 덧술, 누룩부터 양조 방식과 술의 종류까지."
	path="/wiki"
	image="/og/wiki.png"
	schemas={[schema]}
/>
<WikiListPage {terms} />
