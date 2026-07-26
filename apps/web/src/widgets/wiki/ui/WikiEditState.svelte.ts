import { WikiAPI } from '$entities/wiki/api';
import { UserAPI } from '$entities/user/api';
import { Supabase } from '$shared/supabase/api';
import type { UserModel } from '$entities/user/model';
import { WikiFormState } from './WikiFormState.svelte';

type WikiLoadResultType = 'ok' | 'notfound';

// 기존 용어 수정 흐름: 로딩 + 편집 상태 + 저장(편집=이력 INSERT). 페이지는 네비게이션만 맡는다.
// 실패는 throw로 알린다 — 에러 표시는 다이얼로그 플로우(WikiSubmitFlow)의 몫.
class WikiEditState {
	readonly slug: string;
	termId = $state<number | null>(null);
	form = $state<WikiFormState | null>(null);
	saving = $state(false);
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

	// 실패 시 throw
	async submit(user: UserModel): Promise<void> {
		if (this.form === null || this.termId === null || !this.canSubmit)
			throw new Error('저장할 수 없는 상태예요.');
		this.saving = true;
		try {
			const client = Supabase.getClient();
			await UserAPI.upsertProfile(user);
			await this.form.commitImage(client);
			await WikiAPI.edit(client, this.termId, this.form.toFields(), user.id, null);
		} finally {
			this.saving = false;
		}
	}
}

export { WikiEditState };
export type { WikiLoadResultType };
