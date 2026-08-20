<script lang="ts">
	import { onNavigate } from '$app/navigation';
	import { PageTransitionState } from './PageTransitionState.svelte';

	// 라우트 전환을 가로채 커버를 덮었다 걷는다. 페이지·위젯은 아무것도 몰라도 된다.
	const transition = new PageTransitionState();
	onNavigate(transition.intercept);
</script>

{#if transition.phase !== 'idle'}
	<div
		class="ds-page-cover"
		data-phase={transition.phase}
		style={transition.styleVars}
		aria-hidden="true"
	>
		<span class="mark">알콜미터.</span>
	</div>
{/if}

<style>
	/* 색은 커버(.ds-page-cover)의 on-accent를 상속받는다. */
	.mark {
		font-family: var(--ds-font-display);
		font-size: var(--ds-type-title);
		font-weight: var(--ds-weight-bold);
		letter-spacing: var(--ds-tracking-tight);
	}
</style>
