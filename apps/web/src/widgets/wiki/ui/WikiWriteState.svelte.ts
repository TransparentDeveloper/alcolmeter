import { WikiAPI } from '$entities/wiki/api';
import { UserAPI } from '$entities/user/api';
import { Supabase } from '$shared/supabase/api';
import type { UserModel } from '$entities/user/model';
import { WikiFormState } from './WikiFormState.svelte';

// 새 용어 작성 흐름: 편집 상태 + 저장(프로필 보장 → 생성). 페이지는 네비게이션만 맡는다.
class WikiWriteState {
	form = new WikiFormState({ isNew: true });
	saving = $state(false);
	errorMessage = $state<string | null>(null);

	get canSubmit(): boolean {
		return this.form.isValid && !this.saving;
	}

	// 성공 시 slug 반환, 실패 시 null
	async submit(user: UserModel): Promise<string | null> {
		if (!this.canSubmit) return null;
		this.saving = true;
		this.errorMessage = null;
		try {
			const client = Supabase.getClient();
			await UserAPI.upsertProfile(user);
			await this.form.commitImage(client);
			return await WikiAPI.create(client, this.form.toFields(), null);
		} catch (e) {
			// slug unique 위반 = 이미 있는 용어
			const msg = e instanceof Error ? e.message : '';
			this.errorMessage = /duplicate|unique/i.test(msg)
				? '이미 있는 용어예요. 기존 문서를 수정해 주세요.'
				: msg || '저장에 실패했어요.';
			this.saving = false;
			return null;
		}
	}
}

export { WikiWriteState };
