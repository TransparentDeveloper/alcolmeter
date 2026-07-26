import { DialogState, type DialogContent } from '$shared/ui';

interface NoticeContent {
	title: string;
	description: string;
}

// 안내 다이얼로그 뷰 상태 (중복 안내·에러 표시 겸용). 문구는 open()이 주입받는다.
// 마크업(snippet)은 WikiNoticeDialog.svelte가 정의해 open에 넘긴다.
class WikiNoticeDialogState {
	private dialog = DialogState.use();
	data = $state<NoticeContent | null>(null);

	open(content: NoticeContent, body: DialogContent): void {
		this.data = content;
		this.dialog.open(body);
	}
}

export { WikiNoticeDialogState };
export type { NoticeContent };
