<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/state';
	import { tick } from 'svelte';

	type FaqItem = { id: string; q: string; a: string };
	type FaqSection = { id: string; title: string; items: FaqItem[] };

	const sections: FaqSection[] = [
		{
			id: 'principle',
			title: '계산 원리',
			items: [
				{
					id: 'brew-count',
					q: '같은 재료라도 나눠 담그면 도수가 왜 더 높아지나요?',
					a: '한 번에 많은 쌀을 넣으면 농도가 너무 높아 효모가 당을 다 발효시키지 못하고 일부가 잔당으로 남습니다. 나눠 담그면 단계 사이 발효가 당을 비워 더 많은 당이 알코올이 되므로, 담그는 횟수가 늘수록 도수를 높게 봅니다. 단양주보다 이양·삼양주의 예상 도수가 높은 까닭입니다.'
				},
				{
					id: 'rice-form-abv',
					q: '쌀 형태(고두밥·떡·범벅·죽)에 따라 도수가 달라지나요?',
					a: '거의 달라지지 않습니다. 쌀 형태는 물을 단계별로 어떻게 나눠 넣을지에만 작용하고, 총 물의 양은 급수율이 정하기 때문입니다. 그래서 같은 급수율이면 죽·범벅·떡은 도수가 사실상 같고, 고두밥(주로 마지막 덧술, 물을 거의 안 받음)만 조금 다릅니다.'
				},
				{
					id: 'staging',
					q: '물·쌀·누룩을 단계별로 어떻게 나누나요?',
					a: '밑술에는 쌀을 약 15%만 작게 넣어 효모를 키우고, 덧술로 갈수록 점점 많이, 마지막 덧술은 고두밥으로 안칩니다. 누룩은 전량 밑술에 넣습니다. 물은 총량을 급수율로 정한 뒤 형태별 묽기에 맞춰 각 단계에 나눕니다(밑술은 묽게, 고두밥 단계는 물이 거의 없습니다).'
				},
				{
					id: 'volume',
					q: '예상 생산량은 어떻게 계산되나요?',
					a: '예상 생산량은 대략 (총 쌀 × 0.3) + 총 물입니다. 쌀은 약 30%만 최종 액체에 기여하고 나머지는 술지게미로 걸러집니다. 양조 환경에 따라 달라지는 근사값입니다.'
				}
			]
		},
		{
			id: 'inputs',
			title: '입력값 안내',
			items: [
				{
					id: 'water-ratio',
					q: '물 비율(급수율)은 무엇이고 도수에 어떻게 작용하나요?',
					a: '가용 쌀 총량 대비 총 투입 물의 비율입니다(기본 100% = 쌀과 동량). 물이 많으면 묽어져 도수가 낮고, 적으면 진해져 높습니다(효모 내성 한도 안에서). 도수를 좌우하는 가장 큰 손잡이는 급수율과 담그는 횟수입니다.'
				},
				{
					id: 'nuruk-amount',
					q: '누룩은 얼마나 넣어야 하나요?',
					a: '전체 쌀 대비 비율(%)로 넣습니다. 단양주 20~25%, 이양주 15~20%, 삼양주 10~15%가 표준입니다. 단계가 많을수록 효모가 충분히 증식해, 삼양주는 적은 누룩으로도 됩니다.'
				},
				{
					id: 'nuruk-effect',
					q: '누룩을 많이 또는 적게 넣으면 어떻게 되나요?',
					a: '많이 넣으면 발효가 빨라지지만 누룩 향이 강해지고, 적게 넣으면 깔끔하지만 발효가 느려질 수 있습니다. 누룩 양 자체는 현재 예상 도수 계산에 직접 반영하지 않습니다.'
				}
			]
		},
		{
			id: 'coefficients',
			title: '계수와 그 근거',
			items: [
				{
					id: 'rice-yield',
					q: '쌀은 알코올로 얼마나 변하나요?',
					a: '이론적으로는 쌀 1kg의 전분이 모두 발효되면 약 0.42L의 알코올이 나옵니다. 알콜미터는 그보다 낮은 0.32L를 씁니다. 왜냐하면 거를 때 술지게미로 빠지고, 효모가 증식·이산화탄소·유기산에도 당을 쓰기 때문입니다. 전통 누룩 양조의 보수적 실수율로 잡았고, 더 정밀하게 조정하는 중입니다.'
				},
				{
					id: 'tolerance',
					q: '발효로 도수는 어디까지 오를 수 있나요?',
					a: '효모는 자기가 만든 알코올 농도가 일정 수준을 넘으면 사멸해, 발효만으로 오르는 도수에는 한계가 있습니다(균주에 따라 다르나 보통 15~18%대). 알콜미터는 그 상한을 18.5%로 봅니다. 그 이유는 전통 누룩 발효가 실제 도달하는 상한이 그 부근이기 때문입니다. 그 이상은 증류 같은 공정이 필요하며, 이 값도 더 정밀하게 조정하는 중입니다.'
				},
				{
					id: 'concentration',
					q: '효모가 한 번에 삭일 수 있는 당은 얼마인가요?',
					a: '한 번에 너무 진하게 안치면 효모가 삼투압 스트레스로 당을 다 삭이지 못합니다. 정확한 한계는 균주·온도에 따라 다르지만, 알콜미터는 알코올 환산 약 5%치(농도 0.05)로 봅니다. 이 값이 바로 나눠 담글수록 도수가 오르는 정도를 좌우합니다. 더 정밀하게 조정하는 중입니다.'
				},
				{
					id: 'loss',
					q: '한계를 넘긴 당은 다 사라지나요?',
					a: '전부 남는다고도, 전부 버려진다고도 볼 수 없습니다. 왜냐하면 전부 버린다고 하면 어떤 배합이든 도수가 한 값으로 고정되는 비현실적 결과가 나오기 때문입니다. 알콜미터는 초과분의 약 60%만 손실로 보고 나머지는 다음 단계에서 다시 발효된다고 봅니다. 실제 발효의 중간 거동에 맞춘 값이며, 더 정밀하게 조정하는 중입니다.'
				}
			]
		},
		{
			id: 'limits',
			title: '한계와 오차',
			items: [
				{
					id: 'accuracy',
					q: '예상 도수가 실제와 얼마나 다를 수 있나요?',
					a: '같은 배합이라도 누룩 역가, 발효 온도·기간, 효모 상태, 거르는 정도에 따라 실제 도수는 달라집니다. 알콜미터의 값은 평균적 조건을 가정한 추정치입니다.'
				},
				{
					id: 'not-modeled',
					q: '어떤 조건이 계산에 반영되지 않나요?',
					a: '온도·계절·발효 기간·효모 종류는 입력받지 않아 반영되지 않습니다. 재료 배합과 담그는 횟수만으로 추정하므로, 한여름 폭주 발효와 한겨울 더딘 발효의 차이 같은 건 담기지 않습니다.'
				},
				{
					id: 'material-variance',
					q: "같은 '쌀 1kg'이라도 결과가 다를 수 있나요?",
					a: '네. 쌀의 품종·도정·전분량이 다르고 누룩 역가도 제각각입니다. 계산은 대표값을 쓰므로 실제 재료가 가정과 다르면 결과도 그만큼 벗어납니다.'
				},
				{
					id: 'residual',
					q: '발효되지 못하고 남는 단맛(잔당)은 어떻게 되나요?',
					a: '당이 효모 내성이나 농도 한계에 막혀 다 발효되지 못하면 단맛으로 남습니다. 진하게(물 적게) 담글수록 도수는 상한에 가깝고 잔당은 늘어나므로, 도수와 단맛은 따로 보아야 합니다.'
				},
				{
					id: 'scope',
					q: '모든 술에 적용되나요?',
					a: '현재는 발효주(막걸리·청주 계열) 기준입니다. 증류(소주)나 침출(담금주)은 공정이 달라 이 추정이 그대로 적용되지 않습니다.'
				}
			]
		},
		{
			id: 'tips',
			title: '빚을 때 주의사항',
			items: [
				{
					id: 'hygiene',
					q: '위생이 왜 중요한가요?',
					a: '잡균 오염은 양조 실패의 가장 큰 원인입니다. 모든 도구와 용기를 열탕 소독한 뒤 사용하세요.'
				},
				{
					id: 'temperature',
					q: '적정 발효 온도는 어느 정도인가요?',
					a: '20~25°C가 적정입니다. 너무 높으면 신맛이 강해지고, 너무 낮으면 발효가 멈출 수 있습니다.'
				},
				{
					id: 'sealing',
					q: '용기를 밀봉해도 되나요?',
					a: '안 됩니다. 발효 중 이산화탄소가 발생하므로 완전히 밀봉하면 용기가 터질 수 있습니다. 면보나 에어락을 쓰세요.'
				},
				{
					id: 'no-fermentation',
					q: '발효가 안 되는 것 같아요.',
					a: '온도가 20°C 이하이거나 누룩이 오래되었을 수 있습니다. 떡이나 범벅은 초기 1~2일 느릴 수 있으니 3일까지 기다려 보세요.'
				}
			]
		}
	];

	const faqJsonLd = {
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: sections.flatMap((s) =>
			s.items.map((i) => ({
				'@type': 'Question',
				name: i.q,
				acceptedAnswer: { '@type': 'Answer', text: i.a }
			}))
		)
	};

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
	<meta
		name="description"
		content="막걸리 도수·생산량 예측, 배합기 계산에 대한 질문과 답변을 준비했습니다."
	/>
	<link rel="canonical" href="https://alcolmeter.kr/faq" />
	{@html `<script type="application/ld+json">${JSON.stringify(faqJsonLd)}</script>`}
</svelte:head>

<div class="faq">
	<header class="faq-header">
		<h1>자주 묻는 질문</h1>
		<p>막걸리 도수·생산량 예측, 배합기 계산에 대한 질문과 답변을 준비했습니다.</p>
		<a class="dict-link" href="/dictionary">용어가 낯설다면 용어사전에서 찾아보세요 →</a>
	</header>

	<nav class="toc">
		{#each sections as s}
			<a href="#{s.id}" class="toc-item">{s.title}</a>
		{/each}
	</nav>

	{#each sections as s, si}
		<section id={s.id} class="faq-section">
			<div class="section-header">
				<span class="section-number">{String(si + 1).padStart(2, '0')}</span>
				<h2>{s.title}</h2>
			</div>
			{#each s.items as item}
				<details class="faq-item" id={item.id} open={activeQ === item.id}>
					<summary>{item.q}</summary>
					<div class="answer"><p>{item.a}</p></div>
				</details>
			{/each}
		</section>
	{/each}
</div>

<style>
	.faq {
		display: flex;
		flex-direction: column;
		gap: 2rem;
		padding-bottom: 3rem;
	}

	.faq-header {
		padding-bottom: 0.5rem;
		display: flex;
		flex-direction: column;
		gap: var(--ds-space-sm);
	}

	.faq-header h1 {
		font-family: var(--ds-font-display);
		font-size: var(--ds-text-2xl);
		font-weight: var(--ds-weight-bold);
		letter-spacing: var(--ds-tracking-tight);
		color: var(--ds-color-ink-1);
	}

	.faq-header p {
		font-size: 0.85rem;
		color: var(--ds-color-ink-3);
		line-height: 1.5;
	}

	.dict-link {
		font-family: var(--ds-font-mono);
		font-size: var(--ds-text-xs);
		color: var(--ds-color-spark);
		text-decoration: none;
		width: fit-content;
	}

	.dict-link:hover {
		text-decoration: underline;
	}

	/* TOC */
	.toc {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.toc-item {
		padding: var(--ds-space-xs) var(--ds-space-md);
		font-family: var(--ds-font-mono);
		font-size: var(--ds-text-xs);
		color: var(--ds-color-ink-2);
		background: var(--ds-color-surface);
		border: var(--ds-border-width) solid var(--ds-color-border-2);
		border-radius: var(--ds-radius-sm);
		text-decoration: none;
		transition: border-color var(--ds-duration-short) var(--ds-ease-out),
			background-color var(--ds-duration-short) var(--ds-ease-out);
	}

	.toc-item:hover {
		border-color: var(--ds-color-border-3);
		background: var(--ds-color-hover);
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
		font-family: var(--ds-font-mono);
		font-size: var(--ds-text-xs);
		font-variant-numeric: tabular-nums;
		color: var(--ds-color-ink-3);
		background: var(--ds-color-surface);
		border: var(--ds-border-width) solid var(--ds-color-border-2);
		padding: var(--ds-space-2xs) var(--ds-space-sm);
		border-radius: var(--ds-radius-sm);
	}

	.section-header h2 {
		font-family: var(--ds-font-display);
		font-size: var(--ds-text-lg);
		font-weight: var(--ds-weight-bold);
		letter-spacing: var(--ds-tracking-tight);
		color: var(--ds-color-ink-1);
	}

	/* FAQ Item */
	.faq-item {
		background: var(--ds-color-surface);
		border-radius: var(--ds-radius-md);
		overflow: hidden;
		box-shadow: var(--ds-shadow-paper);
		border: var(--ds-border-width) solid var(--ds-color-border-2);
		transition: border-color var(--ds-duration-short) var(--ds-ease-out);
	}

	.faq-item[open] {
		border-color: var(--ds-color-border-3);
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
		color: var(--ds-color-ink-1);
	}

	.faq-item summary::-webkit-details-marker {
		display: none;
	}

	.faq-item summary::after {
		content: '+';
		font-size: 1.1rem;
		font-weight: 400;
		color: var(--ds-color-ink-3);
		flex-shrink: 0;
		width: 1.5rem;
		height: 1.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		background: var(--ds-color-border-1);
		transition: all 0.15s ease;
	}

	.faq-item[open] summary::after {
		content: '−';
		color: var(--ds-color-on-action);
		background: var(--ds-color-action);
	}

	/* Answer */
	.answer {
		padding: 0 1.25rem 1.25rem;
		font-size: var(--ds-text-sm);
		line-height: 1.8;
		color: var(--ds-color-ink-2);
	}

	.answer p {
		margin: 0;
	}
</style>
