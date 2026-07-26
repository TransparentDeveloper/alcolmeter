import { DialogState, type DialogContent } from '$shared/ui';

// 확인 다이얼로그 뷰 상태: open()이 선택 결과를 Promise<boolean>으로 돌려준다.
// 마크업(snippet)은 WikiConfirmDialog.svelte가 정의해 open에 넘긴다.
class WikiConfirmDialogState {
	private dialog = DialogState.use();
	private resolver: ((confirmed: boolean) => void) | null = null;
	private handle: { close: () => void } | null = null;

	// 확인=true, 취소=false. ESC 등 버튼을 거치지 않은 닫힘도 false로 정산된다.
	open(content: DialogContent): Promise<boolean> {
		return new Promise((resolve) => {
			this.resolver = resolve;
			this.handle = this.dialog.open(content);
		});
	}

	// 버튼 선택을 정산하고 다이얼로그를 닫는다.
	settle(confirmed: boolean): void {
		this.resolver?.(confirmed);
		this.resolver = null;
		this.handle?.close();
		this.handle = null;
	}

	// 버튼 정산 없이 콘텐츠가 unmount되면(ESC 닫힘) 취소로 간주한다.
	onDismiss(): void {
		this.resolver?.(false);
		this.resolver = null;
		this.handle = null;
	}
}

export { WikiConfirmDialogState };
