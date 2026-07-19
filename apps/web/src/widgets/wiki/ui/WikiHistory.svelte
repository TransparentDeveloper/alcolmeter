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
			<a class="timestamp" href="/wiki/{encodeURIComponent(slug)}/history/{r.id}"
				>{r.createdAt.slice(0, 16).replace('T', ' ')}</a
			>
			· {label[r.type]} · {r.editor.displayName}
			{#if r.comment}
				· {r.comment}
			{/if}
			{#if canRevert && onrevert}
				<button type="button" class="revert" onclick={() => onrevert(r.id)}>
					이 버전으로 되돌리기
				</button>
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
	.timestamp {
		font-family: var(--ds-font-mono);
		font-size: var(--ds-text-xs);
		color: var(--ds-color-ink-3);
		text-decoration: none;
		transition: color var(--ds-duration-short) var(--ds-ease-out);
	}
	.timestamp:hover {
		color: var(--ds-color-ink-1);
	}
	.revert {
		font: inherit;
		font-size: var(--ds-text-xs);
		font-weight: var(--ds-weight-medium);
		color: var(--ds-color-ink-2);
		background: transparent;
		border: var(--ds-border-width) solid var(--ds-color-border-2);
		border-radius: var(--ds-radius-full);
		padding: var(--ds-space-2xs) var(--ds-space-md);
		margin-left: var(--ds-space-sm);
		cursor: pointer;
		transition:
			border-color var(--ds-duration-short) var(--ds-ease-out),
			color var(--ds-duration-short) var(--ds-ease-out);
	}
	.revert:hover {
		border-color: var(--ds-color-border-3);
		color: var(--ds-color-ink-1);
	}
</style>
