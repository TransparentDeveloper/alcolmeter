<script lang="ts">
	import { ConfirmDialogState } from '$shared/ui';

	// 취소/확인 2버튼 확인 다이얼로그. 문구는 전부 호출처가 주입한다.
	let {
		title,
		description,
		confirmLabel
	}: { title: string; description: string; confirmLabel: string } = $props();

	const confirm = new ConfirmDialogState();

	// 페이지가 bind:this로 호출한다. 확인=true, 취소=false.
	export function open(): Promise<boolean> {
		return confirm.open(content);
	}

	// 버튼 정산 없이 콘텐츠가 unmount되면(ESC 닫힘) 취소로 정산한다.
	function trackDismiss(_node: HTMLElement) {
		return {
			destroy() {
				confirm.onDismiss();
			}
		};
	}
</script>

{#snippet content()}
	<div class="box" use:trackDismiss>
		<h3>{title}</h3>
		<p>{description}</p>
		<div class="actions">
			<button type="button" class="cancel" onclick={() => confirm.settle(false)}>취소</button>
			<button type="button" class="confirm" onclick={() => confirm.settle(true)}>{confirmLabel}</button>
		</div>
	</div>
{/snippet}

<style>
	/* 프레임·백드롭·중앙정렬은 shared/ui/Dialog의 DialogFrame이 담당 */
	.box h3 {
		font-family: var(--ds-font-display);
		font-size: var(--ds-text-lg);
		font-weight: var(--ds-weight-bold);
		color: var(--ds-color-ink-1);
		margin-bottom: var(--ds-space-sm);
	}

	.box p {
		font-size: var(--ds-text-sm);
		line-height: 1.7;
		margin: 0 0 var(--ds-space-lg);
	}

	.actions {
		display: flex;
		justify-content: flex-end;
		gap: var(--ds-space-sm);
	}

	.cancel,
	.confirm {
		font: inherit;
		font-size: var(--ds-text-sm);
		border-radius: var(--ds-radius-md);
		padding: var(--ds-space-sm) var(--ds-space-lg);
		cursor: pointer;
		transition:
			background-color var(--ds-duration-short) var(--ds-ease-out),
			border-color var(--ds-duration-short) var(--ds-ease-out),
			color var(--ds-duration-short) var(--ds-ease-out);
	}

	.cancel {
		color: var(--ds-color-ink-2);
		background: none;
		border: var(--ds-border-width) solid var(--ds-color-border-2);
	}
	.cancel:hover {
		border-color: var(--ds-color-border-3);
		color: var(--ds-color-ink-1);
	}

	.confirm {
		font-weight: var(--ds-weight-medium);
		color: var(--ds-color-on-action);
		background: var(--ds-color-action);
		border: var(--ds-border-width) solid transparent;
	}
	.confirm:hover {
		background: var(--ds-color-action-hover);
	}
	.confirm:active {
		background: var(--ds-color-action-active);
	}
</style>
