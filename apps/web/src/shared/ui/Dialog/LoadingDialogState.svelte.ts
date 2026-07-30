import { DialogState, type DialogContent } from './DialogState.svelte';

// 진행 표시 다이얼로그 상태 로직. dismissible=false로 열어 ESC로도 닫히지 않는다.
// 마크업(snippet)은 이 로직을 쓰는 위젯의 컴포넌트가 정의해 open에 넘긴다.
class LoadingDialogState {
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

export { LoadingDialogState };
