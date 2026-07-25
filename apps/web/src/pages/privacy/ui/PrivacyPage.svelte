<script lang="ts">
	import { PrivacyDocument } from '$widgets/privacy/ui';
</script>

<article>
	<header class="doc-head">
		<h1>개인정보처리방침</h1>
		<p class="effective">시행일: 2026년 7월 26일</p>
	</header>
	<PrivacyDocument />
</article>

<style>
	.doc-head {
		margin-bottom: var(--ds-space-2xl);
	}

	h1 {
		font-family: var(--ds-font-display);
		font-size: var(--ds-text-2xl);
		font-weight: var(--ds-weight-bold);
		letter-spacing: var(--ds-tracking-tight);
		color: var(--ds-color-ink-1);
		margin-bottom: var(--ds-space-xs);
	}

	.effective {
		font-family: var(--ds-font-mono);
		font-size: var(--ds-text-xs);
		color: var(--ds-color-ink-3);
	}
</style>
