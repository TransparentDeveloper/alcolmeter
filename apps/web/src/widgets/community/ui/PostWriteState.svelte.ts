import { PostAPI } from '$entities/post/api';
import { UserAPI } from '$entities/user/api';
import { Supabase } from '$shared/supabase/api';
import type { UserModel } from '$entities/user/model';
import { PostFormState } from './PostFormState.svelte';

// 새 글 작성 흐름: 편집 상태 + 저장(프로필 보장 → 생성). 페이지가 네비게이션·안내를 맡는다.
class PostWriteState {
	form = new PostFormState();
	saving = $state(false);

	get canSubmit(): boolean {
		return this.form.isValid && !this.saving;
	}

	// 생성된 글 id를 반환한다. 저장할 수 없는 상태면 null. 실패는 그대로 던진다.
	async submit(user: UserModel): Promise<number | null> {
		if (!this.canSubmit) return null;
		this.saving = true;
		try {
			const client = Supabase.getClient();
			// author_id → profiles.id FK를 만족시키려 프로필을 먼저 보장한다.
			await UserAPI.upsertProfile(user);
			const id = await PostAPI.create(client, user.id, this.form.toInput());
			this.form.saved = true;
			return id;
		} finally {
			this.saving = false;
		}
	}
}

export { PostWriteState };
