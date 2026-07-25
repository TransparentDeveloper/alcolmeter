<script lang="ts">
	import { ThemeSection, AccountSection } from '$widgets/settings/ui';
</script>

<article>
	<h1>설정</h1>
	<p class="updated">화면 환경을 취향에 맞게 조정합니다.</p>
	<ThemeSection />
	<AccountSection />
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
