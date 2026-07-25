<script lang="ts">
	import PrivacyToc from './PrivacyToc.svelte';
	import PrivacyPolicy from './PrivacyPolicy.svelte';
	import { PrivacyDocumentState } from './PrivacyDocumentState.svelte';

	const spy = new PrivacyDocumentState();
	let contentEl = $state<HTMLElement | null>(null);

	$effect(() => {
		if (!contentEl) return;
		return spy.attach(contentEl);
	});
</script>

<div class="privacy-doc">
	<PrivacyToc activeId={spy.activeId} />
	<div class="privacy-content" bind:this={contentEl}>
		<PrivacyPolicy />
	</div>
</div>

<style>
	.privacy-doc {
		display: grid;
		gap: var(--ds-space-xl);
	}

	/* 데스크탑: 좌측 고정 목차 + 우측 본문 2컬럼 (넓은 hub 폭을 가득 채운다) */
	@media (min-width: 56rem) {
		.privacy-doc {
			grid-template-columns: 14rem minmax(0, 1fr);
			gap: var(--ds-space-3xl);
			align-items: start;
		}
	}
</style>
