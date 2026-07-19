<script lang="ts">
	import { EntryCard } from '$shared/ui';
</script>

<section class="section">
	<h2 class="section-title">양조가 처음이신가요?</h2>
	<div class="learn-cards">
		<EntryCard href="/wiki" title="알콜위키" description="고두밥, 밑술, 덧술… 양조 용어를 한곳에서" />
		<EntryCard
			href="/faq"
			title="자주 묻는 질문"
			description="쌀 형태, 양조 방식, 비율 원리, 주의사항까지"
		/>
	</div>
</section>

<style>
	.section-title {
		font-family: var(--ds-font-display);
		font-size: var(--ds-text-lg);
		font-weight: var(--ds-weight-bold);
		letter-spacing: var(--ds-tracking-tight);
		color: var(--ds-color-ink-1);
		margin-bottom: var(--ds-space-md);
	}

	.learn-cards {
		display: flex;
		flex-direction: column;
		gap: var(--ds-space-sm);
	}
</style>
