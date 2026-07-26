import { DialogState, type DialogContent } from '$shared/ui';

// 진행 표시 다이얼로그 뷰 상태. dismissible=false로 열어 ESC로도 닫히지 않는다.
// 마크업(snippet)은 WikiLoadingDialog.svelte가 정의해 open에 넘긴다.
class WikiLoadingDialogState {
	private dialog = DialogState.use();
	private handle: { close: () => void } | null = null;

	open(content: DialogContent): void {
		if (this.handle) return;
		this.handle = this.dialog.open(content, { dismissible: false });
	}

	close(): void {
		this.handle?.close();
		this.handle = null;
	}
}

export { WikiLoadingDialogState };
