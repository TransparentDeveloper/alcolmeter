<script lang="ts">
	import { Hero, DrinkSelection, Learn } from '$widgets/home/ui';
</script>

<div class="landing">
	<Hero />
	<DrinkSelection />
	<Learn />
</div>

<style>
	.landing {
		display: flex;
		flex-direction: column;
		gap: var(--ds-space-3xl);
		padding-bottom: var(--ds-space-2xl);
	}
</style>
