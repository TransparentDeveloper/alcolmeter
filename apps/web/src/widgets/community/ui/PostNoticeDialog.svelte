<script lang="ts">
	import { NoticeDialogState, type NoticeContent } from '$shared/ui';

	// 제목+본문+확인 버튼 안내 다이얼로그 (저장·삭제 실패 안내 겸용).
	const notice = new NoticeDialogState();

	export function open(content: NoticeContent): void {
		notice.open(content, body);
	}
</script>

{#snippet body({ close }: { close: () => void })}
	<div class="box">
		<h3>{notice.data?.title}</h3>
		<p>{notice.data?.description}</p>
		<div class="actions">
			<button type="button" class="confirm" onclick={close}>확인</button>
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
	}

	.confirm {
		font: inherit;
		font-size: var(--ds-text-sm);
		font-weight: var(--ds-weight-medium);
		color: var(--ds-color-on-action);
		background: var(--ds-color-action);
		border: var(--ds-border-width) solid transparent;
		border-radius: var(--ds-radius-md);
		padding: var(--ds-space-sm) var(--ds-space-lg);
		cursor: pointer;
		transition: background-color var(--ds-duration-short) var(--ds-ease-out);
	}
	.confirm:hover {
		background: var(--ds-color-action-hover);
	}
	.confirm:active {
		background: var(--ds-color-action-active);
	}
</style>
