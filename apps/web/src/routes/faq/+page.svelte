<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/state';
	import { tick } from 'svelte';

	const activeQ = $derived(browser ? page.url.searchParams.get('q') : null);

	$effect(() => {
		if (!activeQ) return;
		tick().then(() => {
			setTimeout(() => {
				const el = document.getElementById(activeQ);
				if (el) {
					el.setAttribute('open', '');
					el.scrollIntoView({ behavior: 'smooth', block: 'center' });
				}
			}, 100);
		});
	});
</script>

<svelte:head>
	<title>자주 묻는 질문 - 알콜미터</title>
	<meta name="description" content="막걸리 양조에 대한 자주 묻는 질문. 쌀 형태, 양조 방식, 누룩·물 비율, 알콜미터 계산 원리를 설명합니다." />
	{@html `<script type="application/ld+json">${JSON.stringify({
		"@context": "https://schema.org",
		"@type": "FAQPage",
		"mainEntity": [
			{ "@type": "Question", "name": "고두밥이란?", "acceptedAnswer": { "@type": "Answer", "text": "쌀을 쪄서 만든 밥입니다. 추가 물 없이 사용하며, 주로 덧술(후반 투입)에 씁니다." }},
			{ "@type": "Question", "name": "떡(설기)이란?", "acceptedAnswer": { "@type": "Answer", "text": "쌀가루를 쪄서 만든 떡입니다. 쌀 1 : 물 1 비율로 사용합니다. 발효가 느리고 단맛이 극단적으로 강해질 수 있어 초보자에게는 비추천합니다." }},
			{ "@type": "Question", "name": "범벅이란?", "acceptedAnswer": { "@type": "Answer", "text": "쌀가루에 물을 섞어 익힌 것입니다. 쌀 1 : 물 3 비율. 발효가 원활하며 가장 대중적인 밑술 형태입니다." }},
			{ "@type": "Question", "name": "죽이란?", "acceptedAnswer": { "@type": "Answer", "text": "쌀가루를 물에 풀어 끓인 것입니다. 쌀 1 : 물 5 비율. 발효가 가장 빠르고 깔끔한 맛을 냅니다." }},
			{ "@type": "Question", "name": "어떤 쌀 형태를 선택해야 하나요?", "acceptedAnswer": { "@type": "Answer", "text": "처음이라면 죽 또는 범벅을 추천합니다. 발효가 안정적이고 실패 확률이 낮습니다." }},
			{ "@type": "Question", "name": "단양주란?", "acceptedAnswer": { "@type": "Answer", "text": "한 번에 모든 재료를 투입하는 방식입니다. 가장 간단하고 발효 기간이 짧지만, 맛은 단순합니다." }},
			{ "@type": "Question", "name": "이양주란?", "acceptedAnswer": { "@type": "Answer", "text": "밑술 + 덧술, 두 번에 나눠 투입하는 방식입니다. 밑술로 발효 기반을 만들고, 덧술로 쌀을 추가해 단양주보다 깊은 맛을 냅니다." }},
			{ "@type": "Question", "name": "삼양주란?", "acceptedAnswer": { "@type": "Answer", "text": "밑술 + 덧술 + 덧술2, 세 번에 나눠 투입하는 방식입니다. 알코올 도수가 가장 높고 풍미가 복잡하지만, 시간과 관리가 더 필요합니다." }},
			{ "@type": "Question", "name": "초보자는 어떤 방식으로 시작하면 좋나요?", "acceptedAnswer": { "@type": "Answer", "text": "이양주 + 범벅 또는 죽 조합을 추천합니다. 단양주보다 맛이 좋으면서도 공정이 복잡하지 않습니다." }},
			{ "@type": "Question", "name": "누룩은 얼마나 넣어야 하나요?", "acceptedAnswer": { "@type": "Answer", "text": "전체 쌀 대비 비율(%)로 투입합니다. 단양주 20~25%, 이양주 15~20%, 삼양주 10~15%가 표준입니다." }},
			{ "@type": "Question", "name": "누룩을 많이 넣으면 어떻게 되나요?", "acceptedAnswer": { "@type": "Answer", "text": "발효가 빨라지지만 누룩 향이 강해집니다. 반대로 적게 넣으면 깔끔하지만 발효가 느려질 수 있습니다." }},
			{ "@type": "Question", "name": "양조 방식마다 누룩 비율이 다른 이유는?", "acceptedAnswer": { "@type": "Answer", "text": "단계가 많을수록 발효가 점진적으로 이루어져 효모가 충분히 증식합니다. 그래서 삼양주는 최소한의 누룩으로도 충분합니다." }},
			{ "@type": "Question", "name": "물 비율은 무엇을 의미하나요?", "acceptedAnswer": { "@type": "Answer", "text": "가용 쌀 총량 대비 총 투입 물의 비율입니다. 기본값은 100%(쌀과 동량)이며, 높이면 가벼운 술, 낮추면 진한 술이 됩니다." }},
			{ "@type": "Question", "name": "쌀 형태별로 물이 달라지는 이유는?", "acceptedAnswer": { "@type": "Answer", "text": "가공 과정에서 필요한 물의 양이 다르기 때문입니다. 죽은 쌀 1에 물 5가 필요하고, 고두밥은 추가 물이 필요 없습니다. 알콜미터가 이를 자동으로 계산합니다." }},
			{ "@type": "Question", "name": "밑술에 쌀을 적게 넣는 이유는?", "acceptedAnswer": { "@type": "Answer", "text": "밑술은 발효의 스타터 역할이라, 효모가 자리잡을 만큼만 넣으면 됩니다. 이양주는 약 20%, 삼양주는 약 15%를 밑술에 배분합니다." }},
			{ "@type": "Question", "name": "마지막 덧술에 고두밥을 쓰는 이유는?", "acceptedAnswer": { "@type": "Answer", "text": "앞 단계에서 이미 충분한 물이 들어갔기 때문입니다. 마지막에 쌀만 추가하면 발효액 농도가 높아져 도수를 끌어올릴 수 있습니다." }},
			{ "@type": "Question", "name": "알콜미터는 물을 어떻게 배분하나요?", "acceptedAnswer": { "@type": "Answer", "text": "총 쌀 × 물 비율 = 물 예산을 먼저 정한 뒤, 각 단계의 쌀 형태에 맞게 배분합니다. 가용 쌀 전량을 사용하면서도 형태별 물 비율을 정확히 유지합니다." }},
			{ "@type": "Question", "name": "예상 생산량은 어떻게 계산되나요?", "acceptedAnswer": { "@type": "Answer", "text": "예상 생산량 = (총 쌀 × 0.3) + 총 물. 쌀의 약 30%만 최종 액체에 기여하고 나머지는 술지게미로 걸러집니다." }},
			{ "@type": "Question", "name": "위생이 왜 중요한가요?", "acceptedAnswer": { "@type": "Answer", "text": "잡균 오염은 양조 실패의 가장 큰 원인입니다. 모든 도구와 용기를 열탕 소독한 뒤 사용하세요." }},
			{ "@type": "Question", "name": "적정 발효 온도는?", "acceptedAnswer": { "@type": "Answer", "text": "20~25°C가 적정입니다. 너무 높으면 신맛이 강해지고, 너무 낮으면 발효가 멈출 수 있습니다." }},
			{ "@type": "Question", "name": "용기를 밀봉해도 되나요?", "acceptedAnswer": { "@type": "Answer", "text": "안 됩니다. 발효 중 CO₂가 발생하므로 완전 밀봉하면 용기가 터질 수 있습니다. 면보나 에어락을 사용하세요." }},
			{ "@type": "Question", "name": "발효가 안 되는 것 같아요.", "acceptedAnswer": { "@type": "Answer", "text": "온도가 20°C 이하이거나, 누룩이 오래되었을 수 있습니다. 떡이나 범벅은 초기 1~2일 느릴 수 있으니 3일까지 기다려보세요." }}
		]
	})}</script>`}
</svelte:head>

<div class="faq">
	<header class="faq-header">
		<h1>자주 묻는 질문</h1>
		<p>막걸리 양조의 기본 개념과 알콜미터의 계산 원리를 설명합니다.</p>
	</header>

	<nav class="toc">
		<a href="#rice-form" class="toc-item">쌀 형태</a>
		<a href="#brew-method" class="toc-item">양조 방식</a>
		<a href="#nuruk" class="toc-item">누룩</a>
		<a href="#water" class="toc-item">물 비율</a>
		<a href="#calculator" class="toc-item">계산 원리</a>
		<a href="#tips" class="toc-item">주의사항</a>
	</nav>

	<section id="rice-form" class="faq-section">
		<div class="section-header">
			<span class="section-number">01</span>
			<h2>쌀 형태</h2>
		</div>

		<details class="faq-item" id="godubap" open={activeQ === 'godubap'}>
			<summary>고두밥이란?</summary>
			<div class="answer">
				<p>쌀을 쪄서 만든 밥입니다. 추가 물 없이 사용하며, 주로 덧술(후반 투입)에 씁니다.</p>
			</div>
		</details>

		<details class="faq-item" id="tteok">
			<summary>떡(설기)이란?</summary>
			<div class="answer">
				<p>쌀가루를 쪄서 만든 떡입니다. 쌀 1 : 물 1 비율로 사용합니다. 발효가 느리고 단맛이 극단적으로 강해질 수 있어 초보자에게는 비추천합니다.</p>
			</div>
		</details>

		<details class="faq-item" id="beombuk">
			<summary>범벅이란?</summary>
			<div class="answer">
				<p>쌀가루에 물을 섞어 익힌 것입니다. 쌀 1 : 물 3 비율. 발효가 원활하며 가장 대중적인 밑술 형태입니다.</p>
			</div>
		</details>

		<details class="faq-item" id="juk">
			<summary>죽이란?</summary>
			<div class="answer">
				<p>쌀가루를 물에 풀어 끓인 것입니다. 쌀 1 : 물 5 비율. 발효가 가장 빠르고 깔끔한 맛을 냅니다.</p>
			</div>
		</details>

		<details class="faq-item" id="rice-recommend">
			<summary>어떤 쌀 형태를 선택해야 하나요?</summary>
			<div class="answer">
				<div class="callout">
					처음이라면 <strong>죽 또는 범벅</strong>을 추천합니다. 발효가 안정적이고 실패 확률이 낮습니다.
				</div>
			</div>
		</details>
	</section>

	<section id="brew-method" class="faq-section">
		<div class="section-header">
			<span class="section-number">02</span>
			<h2>양조 방식</h2>
		</div>

		<details class="faq-item" id="danyang">
			<summary>단양주란?</summary>
			<div class="answer">
				<p>한 번에 모든 재료를 투입하는 방식입니다. 가장 간단하고 발효 기간이 짧지만, 맛은 단순합니다.</p>
			</div>
		</details>

		<details class="faq-item" id="iyang">
			<summary>이양주란?</summary>
			<div class="answer">
				<p>밑술 + 덧술, 두 번에 나눠 투입하는 방식입니다. 밑술로 발효 기반을 만들고, 덧술로 쌀을 추가해 단양주보다 깊은 맛을 냅니다.</p>
			</div>
		</details>

		<details class="faq-item" id="samyang">
			<summary>삼양주란?</summary>
			<div class="answer">
				<p>밑술 + 덧술 + 덧술2, 세 번에 나눠 투입하는 방식입니다. 알코올 도수가 가장 높고 풍미가 복잡하지만, 시간과 관리가 더 필요합니다.</p>
			</div>
		</details>

		<details class="faq-item" id="beginner">
			<summary>초보자는 어떤 방식으로 시작하면 좋나요?</summary>
			<div class="answer">
				<div class="callout">
					<strong>이양주 + 범벅 또는 죽</strong> 조합을 추천합니다. 단양주보다 맛이 좋으면서도 공정이 복잡하지 않습니다.
				</div>
			</div>
		</details>
	</section>

	<section id="nuruk" class="faq-section">
		<div class="section-header">
			<span class="section-number">03</span>
			<h2>누룩</h2>
		</div>

		<details class="faq-item" id="nuruk-amount">
			<summary>누룩은 얼마나 넣어야 하나요?</summary>
			<div class="answer">
				<p>전체 쌀 대비 비율(%)로 투입합니다. 단양주 20~25%, 이양주 15~20%, 삼양주 10~15%가 표준입니다.</p>
			</div>
		</details>

		<details class="faq-item" id="nuruk-excess">
			<summary>누룩을 많이 넣으면 어떻게 되나요?</summary>
			<div class="answer">
				<p>발효가 빨라지지만 누룩 향이 강해집니다. 반대로 적게 넣으면 깔끔하지만 발효가 느려질 수 있습니다.</p>
			</div>
		</details>

		<details class="faq-item" id="nuruk-ratio">
			<summary>양조 방식마다 누룩 비율이 다른 이유는?</summary>
			<div class="answer">
				<p>단계가 많을수록 발효가 점진적으로 이루어져 효모가 충분히 증식합니다. 그래서 삼양주는 최소한의 누룩으로도 충분합니다.</p>
			</div>
		</details>
	</section>

	<section id="water" class="faq-section">
		<div class="section-header">
			<span class="section-number">04</span>
			<h2>물 비율</h2>
		</div>

		<details class="faq-item" id="water-ratio">
			<summary>물 비율은 무엇을 의미하나요?</summary>
			<div class="answer">
				<p>가용 쌀 총량 대비 총 투입 물의 비율입니다. 기본값은 100%(쌀과 동량)이며, 높이면 가벼운 술, 낮추면 진한 술이 됩니다.</p>
			</div>
		</details>

		<details class="faq-item" id="water-by-form">
			<summary>쌀 형태별로 물이 달라지는 이유는?</summary>
			<div class="answer">
				<p>가공 과정에서 필요한 물의 양이 다르기 때문입니다. 죽은 쌀 1에 물 5가 필요하고, 고두밥은 추가 물이 필요 없습니다. 알콜미터가 이를 자동으로 계산합니다.</p>
			</div>
		</details>
	</section>

	<section id="calculator" class="faq-section">
		<div class="section-header">
			<span class="section-number">05</span>
			<h2>알콜미터의 계산 원리</h2>
		</div>

		<details class="faq-item" id="milsul-ratio">
			<summary>밑술에 쌀을 적게 넣는 이유는?</summary>
			<div class="answer">
				<p>밑술은 발효의 스타터 역할이라, 효모가 자리잡을 만큼만 넣으면 됩니다. 이양주는 약 20%, 삼양주는 약 15%를 밑술에 배분합니다.</p>
			</div>
		</details>

		<details class="faq-item" id="last-godubap">
			<summary>마지막 덧술에 고두밥을 쓰는 이유는?</summary>
			<div class="answer">
				<p>앞 단계에서 이미 충분한 물이 들어갔기 때문입니다. 마지막에 쌀만 추가하면 발효액 농도가 높아져 도수를 끌어올릴 수 있습니다.</p>
			</div>
		</details>

		<details class="faq-item" id="water-budget">
			<summary>알콜미터는 물을 어떻게 배분하나요?</summary>
			<div class="answer">
				<p>"총 쌀 × 물 비율 = 물 예산"을 먼저 정한 뒤, 각 단계의 쌀 형태에 맞게 배분합니다. 가용 쌀 전량을 사용하면서도 형태별 물 비율을 정확히 유지합니다.</p>
			</div>
		</details>

		<details class="faq-item" id="estimated-volume">
			<summary>예상 생산량은 어떻게 계산되나요?</summary>
			<div class="answer">
				<div class="callout">
					예상 생산량 = (총 쌀 × 0.3) + 총 물
				</div>
				<p>쌀의 약 30%만 최종 액체에 기여하고 나머지는 술지게미로 걸러집니다. 양조 환경에 따라 달라질 수 있는 근사값입니다.</p>
			</div>
		</details>
	</section>

	<section id="tips" class="faq-section">
		<div class="section-header">
			<span class="section-number">06</span>
			<h2>주의사항</h2>
		</div>

		<details class="faq-item" id="hygiene">
			<summary>위생이 왜 중요한가요?</summary>
			<div class="answer">
				<p>잡균 오염은 양조 실패의 가장 큰 원인입니다. 모든 도구와 용기를 열탕 소독한 뒤 사용하세요.</p>
			</div>
		</details>

		<details class="faq-item" id="temperature">
			<summary>적정 발효 온도는?</summary>
			<div class="answer">
				<p>20~25°C가 적정입니다. 너무 높으면 신맛이 강해지고, 너무 낮으면 발효가 멈출 수 있습니다.</p>
			</div>
		</details>

		<details class="faq-item" id="sealing">
			<summary>용기를 밀봉해도 되나요?</summary>
			<div class="answer">
				<p>안 됩니다. 발효 중 CO₂가 발생하므로 완전 밀봉하면 용기가 터질 수 있습니다. 면보나 에어락을 사용하세요.</p>
			</div>
		</details>

		<details class="faq-item" id="no-fermentation">
			<summary>발효가 안 되는 것 같아요.</summary>
			<div class="answer">
				<p>온도가 20°C 이하이거나, 누룩이 오래되었을 수 있습니다. 떡이나 범벅은 초기 1~2일 느릴 수 있으니 3일까지 기다려보세요.</p>
			</div>
		</details>
	</section>
</div>

<style>
	.faq {
		display: flex;
		flex-direction: column;
		gap: 2rem;
		padding-bottom: 3rem;
	}

	/* Header */
	.faq-header {
		padding-bottom: 0.5rem;
	}

	.faq-header h1 {
		font-size: 1.5rem;
		font-weight: 800;
		letter-spacing: -0.03em;
		margin-bottom: 0.5rem;
	}

	.faq-header p {
		font-size: 0.85rem;
		color: var(--color-muted);
		line-height: 1.5;
	}

	/* TOC */
	.toc {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.toc-item {
		padding: 0.4rem 0.85rem;
		font-size: 0.78rem;
		font-weight: 700;
		color: var(--color-primary);
		background: #eff6ff;
		border-radius: var(--radius-sm);
		text-decoration: none;
		transition: all 0.15s ease;
	}

	.toc-item:hover {
		background: #dbeafe;
	}

	/* Section */
	.faq-section {
		display: flex;
		flex-direction: column;
		gap: 0.625rem;
	}

	.section-header {
		display: flex;
		align-items: center;
		gap: 0.625rem;
		margin-bottom: 0.25rem;
	}

	.section-number {
		font-size: 0.7rem;
		font-weight: 800;
		color: var(--color-primary);
		background: #eff6ff;
		padding: 0.2rem 0.5rem;
		border-radius: var(--radius-xs);
	}

	.section-header h2 {
		font-size: 1.05rem;
		font-weight: 800;
		letter-spacing: -0.02em;
	}

	/* FAQ Item */
	.faq-item {
		background: #ffffff;
		border-radius: var(--radius-md);
		overflow: hidden;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
		border: 1.5px solid #e5e7eb;
		transition: all 0.2s ease;
	}

	.faq-item[open] {
		border-color: var(--color-primary);
		box-shadow: 0 2px 8px rgba(37, 99, 235, 0.08);
	}

	.faq-item summary {
		padding: 1rem 1.25rem;
		font-size: 0.88rem;
		font-weight: 700;
		cursor: pointer;
		list-style: none;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem;
		user-select: none;
	}

	.faq-item summary::-webkit-details-marker {
		display: none;
	}

	.faq-item summary::after {
		content: '+';
		font-size: 1.1rem;
		font-weight: 400;
		color: var(--color-muted);
		flex-shrink: 0;
		width: 1.5rem;
		height: 1.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		background: var(--color-border);
		transition: all 0.15s ease;
	}

	.faq-item[open] summary::after {
		content: '−';
		color: #ffffff;
		background: var(--color-primary);
	}

	/* Answer */
	.answer {
		padding: 0 1.25rem 1.25rem;
		font-size: 0.84rem;
		line-height: 1.8;
		color: #4b5563;
	}

	.answer p {
		margin-bottom: 0.75rem;
	}

	.answer p:last-child {
		margin-bottom: 0;
	}

	.answer strong {
		font-weight: 800;
		color: var(--color-text);
	}

	.note {
		font-size: 0.8rem;
		color: var(--color-muted);
		font-style: italic;
	}

	/* Info Cards */
	.info-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.5rem;
		margin-bottom: 0.75rem;
	}

	.info-card {
		padding: 0.75rem;
		background: var(--color-card);
		border-radius: var(--radius-sm);
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.info-card strong {
		font-size: 0.82rem;
	}

	.info-card span {
		font-size: 0.76rem;
		color: #6b7280;
		line-height: 1.5;
	}

	/* Tip List */
	.tip-list {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		margin-bottom: 0.75rem;
	}

	.tip-list:last-child {
		margin-bottom: 0;
	}

	.tip {
		padding: 0.625rem 0.85rem;
		background: var(--color-card);
		border-radius: var(--radius-sm);
		font-size: 0.82rem;
		line-height: 1.6;
		border-left: 3px solid #e5e7eb;
	}

	/* Callout */
	.callout {
		padding: 1rem 1.25rem;
		background: #eff6ff;
		border-radius: var(--radius-sm);
		font-size: 0.85rem;
		font-weight: 700;
		color: var(--color-primary);
		line-height: 1.6;
		margin-bottom: 0.75rem;
	}

	.callout:last-child {
		margin-bottom: 0;
	}

	/* Step List */
	.step-list {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		margin-bottom: 0.75rem;
	}

	.step {
		display: flex;
		align-items: flex-start;
		gap: 0.625rem;
		font-size: 0.82rem;
		line-height: 1.6;
	}

	.step-num {
		flex-shrink: 0;
		width: 1.4rem;
		height: 1.4rem;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--color-primary);
		color: #ffffff;
		font-size: 0.72rem;
		font-weight: 800;
		border-radius: 50%;
		margin-top: 0.15rem;
	}

	/* Ratio Table */
	.ratio-table {
		display: flex;
		flex-direction: column;
		gap: 0.625rem;
		margin-bottom: 0.75rem;
	}

	.ratio-row {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.ratio-label {
		font-size: 0.8rem;
		font-weight: 700;
		width: 3.5rem;
		flex-shrink: 0;
	}

	.ratio-bar {
		height: 6px;
		background: linear-gradient(90deg, var(--color-primary), #60a5fa);
		border-radius: var(--radius-xs);
		flex-shrink: 0;
	}

	.ratio-value {
		font-size: 0.78rem;
		font-weight: 700;
		color: var(--color-primary);
		flex-shrink: 0;
	}
</style>
