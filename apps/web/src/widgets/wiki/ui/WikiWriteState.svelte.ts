import { WikiAPI } from '$entities/wiki/api';
import { UserAPI } from '$entities/user/api';
import { Supabase } from '$shared/supabase/api';
import type { UserModel } from '$entities/user/model';
import { WikiFormState } from './WikiFormState.svelte';

// 새 용어 작성 흐름: 편집 상태 + 저장(프로필 보장 → 생성). 페이지는 네비게이션만 맡는다.
// 실패는 throw로 알린다 — 에러 표시는 다이얼로그 플로우(WikiSubmitFlow)의 몫.
class WikiWriteState {
	form = new WikiFormState({ isNew: true });
	saving = $state(false);

	get canSubmit(): boolean {
		return this.form.isValid && !this.saving;
	}

	// 같은 slug 문서가 이미 있는지. 게시 확인 다이얼로그 전에 조회한다.
	async checkDuplicate(): Promise<boolean> {
		return (await WikiAPI.getBySlug(Supabase.getClient(), this.form.slug)) !== null;
	}

	// 성공 시 slug 반환, 실패 시 throw
	async submit(user: UserModel): Promise<string> {
		if (!this.canSubmit) throw new Error('저장할 수 없는 상태예요.');
		this.saving = true;
		try {
			const client = Supabase.getClient();
			await UserAPI.upsertProfile(user);
			await this.form.commitImage(client);
			return await WikiAPI.create(client, this.form.toFields(), null);
		} catch (e) {
			// slug unique 위반 = 이미 있는 용어 (사전조회를 비껴간 동시 등록 레이스의 백업)
			const msg = e instanceof Error ? e.message : '';
			throw new Error(
				/duplicate|unique/i.test(msg)
					? '이미 있는 용어예요. 기존 문서를 수정해 주세요.'
					: msg || '저장에 실패했어요.'
			);
		} finally {
			this.saving = false;
		}
	}
}

export { WikiWriteState };
