import { DialogState, type DialogContent } from './DialogState.svelte';

interface NoticeContent {
	title: string;
	description: string;
}

// 안내 다이얼로그 상태 로직 (중복 안내·에러 표시 겸용). 문구는 open()이 주입받는다.
// 마크업(snippet)은 이 로직을 쓰는 위젯의 컴포넌트가 정의해 open에 넘긴다.
class NoticeDialogState {
	private dialog = DialogState.use();
	data = $state<NoticeContent | null>(null);

	open(content: NoticeContent, body: DialogContent): void {
		this.data = content;
		this.dialog.open(body);
	}
}

export { NoticeDialogState };
export type { NoticeContent };
