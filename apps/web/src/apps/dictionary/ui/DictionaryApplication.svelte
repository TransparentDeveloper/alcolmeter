<script lang="ts">
	import { MetaHead } from '$shared/ui';
	import { JsonLd } from '$shared/lib';
	import { terms } from '$entities/dictionary/lib';
	import { DictionaryPage } from '$pages/dictionary/ui';

	const schema = JsonLd.createDefinedTermSetSchemaMarkup({
		name: '알콜미터 전통주 용어사전',
		description: '막걸리·전통주 양조 용어를 입문자 눈높이로 풀어 설명하는 용어사전.',
		url: 'https://alcolmeter.kr/dictionary',
		terms: terms.map((t) => ({
			name: t.title,
			description: t.summary,
			url: `https://alcolmeter.kr/dictionary/${encodeURIComponent(t.slug)}`
		}))
	});
</script>

<MetaHead
	title="전통주 용어사전 - 알콜미터"
	description="막걸리·전통주 양조 용어를 입문자 눈높이로 풀어 설명하는 용어사전. 고두밥, 밑술, 덧술, 누룩부터 양조 방식까지."
	path="/dictionary"
	image="/og/dictionary.png"
	schemas={[schema]}
/>

<DictionaryPage />
