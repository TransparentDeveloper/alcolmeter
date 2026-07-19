<script lang="ts">
	import type { WikiRevisionData } from '$entities/wiki/model';

	let {
		slug,
		history,
		canRevert = false,
		onrevert
	}: {
		slug: string;
		history: WikiRevisionData[];
		canRevert?: boolean;
		onrevert?: (revId: number) => void;
	} = $props();

	const label = { add: '작성', edit: '수정', revert: '되돌림' } as const;
</script>

<ul>
	{#each history as r (r.id)}
		<li>
			<a href="/wiki/{encodeURIComponent(slug)}/history/{r.id}">{r.createdAt.slice(0, 16).replace('T', ' ')}</a>
			· {label[r.type]} · {r.editor.displayName}
			{#if r.comment}
				· {r.comment}
			{/if}
			{#if canRevert && onrevert}
				<button type="button" onclick={() => onrevert(r.id)}>이 버전으로 되돌리기</button>
			{/if}
		</li>
	{/each}
</ul>

<style>
	ul {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: var(--ds-space-sm);
	}
	li {
		font-size: var(--ds-text-sm);
		color: var(--ds-color-ink-2);
	}
	a {
		color: var(--ds-color-action);
		text-decoration: none;
	}
	a:hover {
		text-decoration: underline;
	}
	button {
		font: inherit;
		font-size: var(--ds-text-xs);
		color: var(--ds-color-ink-3);
		background: none;
		border: none;
		padding: 0;
		margin-left: var(--ds-space-sm);
		cursor: pointer;
		text-decoration: underline;
	}
	button:hover {
		color: var(--ds-color-ink-1);
	}
</style>
