<script lang="ts">
	import { MetaHead } from '$shared/ui';
	import { JsonLd } from '$shared/lib';
	import { sections } from '$entities/faq/lib';
	import { FaqPage } from '$pages/faq/ui';

	const questions = sections.flatMap((s) => s.items.map((i) => ({ question: i.q, answer: i.a })));
</script>

<MetaHead
	title="자주 묻는 질문 - 알콜미터"
	description="막걸리 도수·생산량 예측과 배합 계산, 알콜위키 편집과 커뮤니티 이용에 대한 질문과 답변을 준비했습니다."
	path="/faq"
	image="/og/faq.png"
	schemas={[JsonLd.createFAQPageSchemaMarkup(questions)]}
/>

<FaqPage />
