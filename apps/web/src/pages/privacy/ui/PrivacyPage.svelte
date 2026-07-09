<script lang="ts">
	import { PrivacyPolicy } from '$widgets/privacy/ui';
</script>

<article>
	<h1>개인정보처리방침</h1>
	<p class="updated">최종 수정일: 2026년 5월 9일</p>
	<PrivacyPolicy />
</article>

<style>
	article {
		max-width: var(--ds-container);
	}

	h1 {
		font-family: var(--ds-font-display);
		font-size: var(--ds-text-2xl);
		font-weight: var(--ds-weight-bold);
		letter-spacing: var(--ds-tracking-tight);
		color: var(--ds-color-ink-1);
		margin-bottom: var(--ds-space-xs);
	}

	.updated {
		font-family: var(--ds-font-mono);
		font-size: var(--ds-text-xs);
		color: var(--ds-color-ink-3);
		margin-bottom: var(--ds-space-3xl);
	}
</style>
