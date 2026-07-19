import { WikiAPI } from '$entities/wiki/api';
import { UserAPI } from '$entities/user/api';
import { Supabase } from '$shared/supabase/api';
import type { UserModel } from '$entities/user/model';

// 되돌리기 권한: 해당 문서 최초작성자 또는 관리자. UI 게이팅 + RLS 이중 방어.
class WikiRevertState {
	readonly termId: number;
	readonly authorId: string;
	canRevert = $state(false);
	reverting = $state(false);
	errorMessage = $state<string | null>(null);

	constructor(termId: number, authorId: string) {
		this.termId = termId;
		this.authorId = authorId;
	}

	async resolvePermission(user: UserModel | null): Promise<void> {
		if (!user) {
			this.canRevert = false;
			return;
		}
		if (user.id === this.authorId) {
			this.canRevert = true;
			return;
		}
		this.canRevert = (await UserAPI.getRole(user.id)) === 'admin';
	}

	// 성공 시 true. revisionId는 되돌릴 대상 이력.
	async revert(user: UserModel, revisionId: number): Promise<boolean> {
		if (!this.canRevert || this.reverting) return false;
		this.reverting = true;
		this.errorMessage = null;
		try {
			const client = Supabase.getClient();
			const source = await WikiAPI.getRevision(client, revisionId);
			if (!source) throw new Error('이력을 찾을 수 없어요.');
			await WikiAPI.revert(client, this.termId, source, user.id, null);
			return true;
		} catch (e) {
			this.errorMessage = e instanceof Error ? e.message : '되돌리기에 실패했어요.';
			this.reverting = false;
			return false;
		}
	}
}

export { WikiRevertState };
