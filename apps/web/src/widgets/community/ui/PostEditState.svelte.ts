import { PostAPI } from '$entities/post/api';
import { Supabase } from '$shared/supabase/api';
import { PostFormState } from './PostFormState.svelte';

type LoadResultType = 'ok' | 'notfound' | 'forbidden';

// 기존 글 수정 흐름: 로딩·소유권 확인 + 편집 상태 + 저장. 페이지가 네비게이션·안내를 맡는다.
class PostEditState {
	readonly id: number;
	form = $state<PostFormState | null>(null);
	saving = $state(false);
	loaded = $state(false);

	constructor(id: number) {
		this.id = id;
	}

	get canSubmit(): boolean {
		return this.form !== null && this.form.isValid && !this.saving;
	}

	// 글을 불러와 소유권을 확인한다. 한 번만 수행한다.
	async load(userId: string): Promise<LoadResultType> {
		if (this.loaded) return 'ok';
		this.loaded = true;
		const post = await PostAPI.getById(Supabase.getClient(), this.id);
		if (!post) return 'notfound';
		if (post.author.id !== userId) return 'forbidden';
		this.form = new PostFormState({ title: post.title, body: post.body });
		return 'ok';
	}

	// 저장 성공 시 true. 저장할 수 없는 상태면 false. 실패는 그대로 던진다.
	async submit(): Promise<boolean> {
		if (this.form === null || !this.canSubmit) return false;
		this.saving = true;
		try {
			await PostAPI.update(Supabase.getClient(), this.id, this.form.toInput());
			this.form.saved = true;
			return true;
		} finally {
			this.saving = false;
		}
	}
}

export { PostEditState };
export type { LoadResultType };
