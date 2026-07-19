<script lang="ts">
	import { Hero, DrinkSelection, Community, Wiki, Learn } from '$widgets/home/ui';
</script>

<div class="landing">
	<Hero />
	<Community />
	<Wiki />
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
