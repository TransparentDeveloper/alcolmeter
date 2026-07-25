<script lang="ts">
	import { WikiGuidelines } from '$widgets/wiki/ui';
</script>

<article class="doc">
	<header class="doc-head">
		<h1>알콜위키 이용 안내</h1>
		<p class="updated">최종 수정일: 2026년 7월 25일</p>
	</header>
	<div class="doc-body">
		<WikiGuidelines />
	</div>
</article>

<style>
	.doc {
		display: flex;
		flex-direction: column;
		gap: var(--ds-space-2xl);
	}

	h1 {
		font-family: var(--ds-font-display);
		font-size: var(--ds-text-2xl);
		font-weight: var(--ds-weight-bold);
		letter-spacing: var(--ds-tracking-tight);
		color: var(--ds-color-ink-1);
		margin-bottom: var(--ds-space-xs);
		text-wrap: balance;
	}

	.updated {
		font-family: var(--ds-font-mono);
		font-size: var(--ds-text-xs);
		color: var(--ds-color-ink-3);
	}

	/* 데스크탑: 제목·수정일 사이드 + 본문 2단 (lg 1024). 본문은 사이드 옆 전체 폭을 쓴다. */
	@media (min-width: 1024px) {
		.doc {
			display: grid;
			grid-template-columns: minmax(200px, 260px) minmax(0, 1fr);
			gap: var(--ds-space-3xl);
			align-items: start;
		}

		.doc-head {
			position: sticky;
			top: var(--ds-space-xl);
		}
	}
</style>
