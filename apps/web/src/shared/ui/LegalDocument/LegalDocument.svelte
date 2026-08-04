<script lang="ts" generics="Id extends string">
	// 약관·정책류 법적 문서의 공용 셸. 제목·시행일 머리말, 사이드 목차, 번호 붙은 섹션 골격,
	// 본문 타이포까지 여기서 정하고 실제 조문은 body 스니펫으로 받는다.
	// 개인정보처리방침·이용약관·운영정책이 같은 생김새를 유지하게 하는 단일 출처다.
	import type { Snippet } from 'svelte';
	import LegalToc from './LegalToc.svelte';
	import { LegalDocumentState } from './LegalDocumentState.svelte';

	let {
		title,
		effectiveDate,
		sections,
		body
	}: {
		title: string;
		effectiveDate: string;
		sections: readonly { id: Id; title: string }[];
		body: Snippet<[Id]>;
	} = $props();

	const spy = new LegalDocumentState();
	let contentEl = $state<HTMLElement | null>(null);

	$effect(() => {
		if (!contentEl) return;
		return spy.attach(contentEl);
	});
</script>

<article>
	<header class="doc-head">
		<h1>{title}</h1>
		<p class="effective">시행일: {effectiveDate}</p>
	</header>

	<div class="doc-body">
		<LegalToc label="{title} 목차" {sections} activeId={spy.activeId} />
		<div class="doc-content" bind:this={contentEl}>
			{#each sections as s, i (s.id)}
				<section id={s.id} class="doc-section">
					<div class="section-header">
						<span class="section-number">{String(i + 1).padStart(2, '0')}</span>
						<h2>{s.title}</h2>
					</div>
					<div class="section-body">
						{@render body(s.id)}
					</div>
				</section>
			{/each}
		</div>
	</div>
</article>

<style>
	.doc-head {
		margin-bottom: var(--ds-space-2xl);
	}

	h1 {
		font-family: var(--ds-font-display);
		font-size: var(--ds-type-title);
		font-weight: var(--ds-weight-bold);
		letter-spacing: var(--ds-tracking-tight);
		color: var(--ds-color-ink-1);
		margin-bottom: var(--ds-space-xs);
	}

	.effective {
		font-family: var(--ds-font-mono);
		font-size: var(--ds-type-caption);
		color: var(--ds-color-ink-3);
	}

	.doc-body {
		display: grid;
		gap: var(--ds-space-xl);
	}

	/* 데스크탑: 좌측 고정 목차 + 우측 본문 2컬럼 (넓은 hub 폭을 가득 채운다) */
	@media (min-width: 56rem) {
		.doc-body {
			grid-template-columns: 14rem minmax(0, 1fr);
			gap: var(--ds-space-3xl);
			align-items: start;
		}
	}

	.doc-section {
		scroll-margin-top: var(--ds-space-xl);
	}

	/* 조항 사이 간격은 읽기 편의만이 아니라 목차 강조의 정확도에도 걸린다.
	   간격이 좁으면 짧은 조항이 기준선을 지나는 순간 다음 조항도 함께 지나버려 건너뛰어진다. */
	.doc-section + .doc-section {
		margin-top: var(--ds-space-3xl);
	}

	/* 마지막 조항 뒤에 스크롤 여유를 둔다. 이게 없으면 문서 끝의 짧은 조항들이
	   목차 기준선(뷰포트 상단 25%)까지 밀려 올라오기 전에 스크롤이 바닥에 닿아,
	   끝에서 두세 번째 항목이 목차에서 영영 강조되지 않는다. */
	.doc-section:last-child {
		min-height: 60vh;
	}

	.section-header {
		display: flex;
		align-items: center;
		gap: var(--ds-space-sm);
		margin-bottom: var(--ds-space-md);
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
		flex-shrink: 0;
	}

	/* 문서 제목이 display가 아니라 title(한 칸 아래)이라 조항 제목도 그만큼 내려 h4를 쓴다.
	   본문 19.2 위의 24는 조판 계단에서 바로 윗칸이라 번호 칩과 함께 조항 머리로 읽힌다. */
	.section-header h2 {
		font-family: var(--ds-font-display);
		font-size: var(--ds-type-h4);
		font-weight: var(--ds-weight-bold);
		letter-spacing: var(--ds-tracking-tight);
		color: var(--ds-color-ink-1);
	}

	/* 조문은 호출부 스니펫이 그린다. 소비처 스코프라 타이포는 :global로 건다 */
	.section-body {
		display: flex;
		flex-direction: column;
		gap: var(--ds-space-md);
		font-size: var(--ds-type-body);
		line-height: 1.8;
		color: var(--ds-color-ink-2);
	}

	.section-body :global(p) {
		margin: 0;
	}

	.section-body :global(strong) {
		font-weight: var(--ds-weight-semibold);
		color: var(--ds-color-ink-1);
	}

	.section-body :global(a) {
		color: var(--ds-color-ink-1);
		text-decoration: underline;
		text-underline-offset: 2px;
	}

	.section-body :global(ul) {
		margin: 0;
		padding-left: var(--ds-space-lg);
		display: flex;
		flex-direction: column;
		gap: var(--ds-space-sm);
	}

	.section-body :global(li) {
		padding-left: var(--ds-space-2xs);
	}

	.section-body :global(li::marker) {
		color: var(--ds-color-ink-4);
	}
</style>
