<script lang="ts">
	import { FaqIntro, FaqToc, FaqSections } from '$widgets/faq/ui';
</script>

<div class="faq">
	<FaqIntro />
	<FaqToc />
	<FaqSections />
</div>

<style>
	.faq {
		display: flex;
		flex-direction: column;
		gap: 2rem;
		padding-bottom: 3rem;
	}
</style>
