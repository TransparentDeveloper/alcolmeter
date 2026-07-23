import { WikiAPI } from '$entities/wiki/api';
import { UserAPI } from '$entities/user/api';
import { Supabase } from '$shared/supabase/api';
import type { UserModel } from '$entities/user/model';
import { WikiFormState } from './WikiFormState.svelte';

type WikiLoadResultType = 'ok' | 'notfound';

// 기존 용어 수정 흐름: 로딩 + 편집 상태 + 저장(편집=이력 INSERT). 페이지는 네비게이션만 맡는다.
class WikiEditState {
	readonly slug: string;
	termId = $state<number | null>(null);
	form = $state<WikiFormState | null>(null);
	saving = $state(false);
	errorMessage = $state<string | null>(null);
	loaded = $state(false);

	constructor(slug: string) {
		this.slug = slug;
	}

	get canSubmit(): boolean {
		return this.form !== null && this.form.isValid && !this.saving;
	}

	async load(): Promise<WikiLoadResultType> {
		if (this.loaded) return 'ok';
		this.loaded = true;
		const term = await WikiAPI.getBySlug(Supabase.getClient(), this.slug);
		if (!term) return 'notfound';
		this.termId = term.id;
		this.form = new WikiFormState({ ...term.toFields(), isNew: false }); // 제목 고정은 UI에서 readonly
		return 'ok';
	}

	async submit(user: UserModel): Promise<boolean> {
		if (this.form === null || this.termId === null || !this.canSubmit) return false;
		this.saving = true;
		this.errorMessage = null;
		try {
			const client = Supabase.getClient();
			await UserAPI.upsertProfile(user);
			await this.form.commitImage(client);
			await WikiAPI.edit(client, this.termId, this.form.toFields(), user.id, null);
			return true;
		} catch (e) {
			this.errorMessage = e instanceof Error ? e.message : '저장에 실패했어요.';
			this.saving = false;
			return false;
		}
	}
}

export { WikiEditState };
export type { WikiLoadResultType };
