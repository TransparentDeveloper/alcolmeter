<script lang="ts">
	import type { WikiTermData } from '$entities/wiki/model';
	let { terms }: { terms: WikiTermData[] } = $props();
</script>

<ul>
	{#each terms as t (t.slug)}
		<li>
			<a href="/wiki/{encodeURIComponent(t.slug)}">{t.title}</a>
			<p>{t.summary}</p>
		</li>
	{/each}
</ul>
