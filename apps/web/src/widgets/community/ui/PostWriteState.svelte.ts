import { PostAPI } from '$entities/post/api';
import { UserAPI } from '$entities/user/api';
import { Supabase } from '$shared/supabase/api';
import type { UserModel } from '$entities/user/model';
import { PostEditorState } from './PostEditorState.svelte';

// 새 글 작성 흐름: 편집 상태 + 저장(프로필 보장 → 생성). 페이지는 네비게이션만 맡는다.
class PostWriteState {
	editor = new PostEditorState();
	saving = $state(false);
	errorMessage = $state<string | null>(null);

	get canSubmit(): boolean {
		return this.editor.isValid && !this.saving;
	}

	// 저장 후 생성된 글 id를 반환한다. 저장 못 하거나 실패하면 null.
	async submit(user: UserModel): Promise<number | null> {
		if (!this.canSubmit) return null;
		this.saving = true;
		this.errorMessage = null;
		try {
			const client = Supabase.getClient();
			// author_id → profiles.id FK를 만족시키려 프로필을 먼저 보장한다.
			await UserAPI.upsertProfile(user);
			return await PostAPI.create(client, user.id, this.editor.toInput());
		} catch (e) {
			this.errorMessage = e instanceof Error ? e.message : '저장에 실패했어요.';
			this.saving = false;
			return null;
		}
	}
}

export { PostWriteState };
