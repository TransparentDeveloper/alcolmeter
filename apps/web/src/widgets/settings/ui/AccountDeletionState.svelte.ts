import { goto } from '$app/navigation';
import { AuthAPI } from '$features/auth/api';
import { DialogState, type DialogContent } from '$shared/ui';

// 회원 탈퇴 다이얼로그의 상태·동작을 모두 소유한다.
// 뷰는 확인 UI snippet만 넘기고, 열기·닫기·확정은 이 class가 처리한다.
class AccountDeletionState {
	private dialog = DialogState.use();
	private handle: { close: () => void } | null = null;

	isDeleting = $state(false);
	error = $state<string | null>(null);

	// 뷰가 정의한 확인 snippet으로 다이얼로그를 연다.
	open(content: DialogContent): void {
		this.error = null;
		this.handle = this.dialog.open(content);
	}

	onClose(): void {
		if (this.isDeleting) return; // 삭제 중에는 닫지 않는다
		this.handle?.close();
		this.handle = null;
	}

	async onConfirm(): Promise<void> {
		if (this.isDeleting) return;
		this.isDeleting = true;
		this.error = null;

		const { error } = await AuthAPI.deleteAccount();
		if (error) {
			this.error = '탈퇴 처리 중 문제가 발생했어요. 잠시 후 다시 시도해 주세요.';
			this.isDeleting = false;
			return;
		}

		// 세션 정리 → 다이얼로그 닫기 → 홈 이동
		await AuthAPI.signOut();
		this.handle?.close();
		this.handle = null;
		await goto('/');
	}
}

export { AccountDeletionState };
