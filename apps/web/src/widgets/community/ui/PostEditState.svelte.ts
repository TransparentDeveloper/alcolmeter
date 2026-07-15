import { PostAPI } from '$entities/post/api';
import { Supabase } from '$shared/supabase/api';
import { PostEditorState } from './PostEditorState.svelte';

type LoadResultType = 'ok' | 'notfound' | 'forbidden';

// 기존 글 수정 흐름: 로딩·소유권 확인 + 편집 상태 + 저장. 페이지는 네비게이션만 맡는다.
class PostEditState {
	readonly id: number;
	editor = $state<PostEditorState | null>(null);
	saving = $state(false);
	errorMessage = $state<string | null>(null);
	loaded = $state(false);

	constructor(id: number) {
		this.id = id;
	}

	get canSubmit(): boolean {
		return this.editor !== null && this.editor.isValid && !this.saving;
	}

	// 글을 불러와 소유권을 확인한다. 한 번만 수행한다.
	async load(userId: string): Promise<LoadResultType> {
		if (this.loaded) return 'ok';
		this.loaded = true;
		const post = await PostAPI.getById(Supabase.getClient(), this.id);
		if (!post) return 'notfound';
		if (post.author.id !== userId) return 'forbidden';
		this.editor = new PostEditorState({ title: post.title, blocks: post.blocks });
		return 'ok';
	}

	// 저장 성공 시 true.
	async submit(): Promise<boolean> {
		if (this.editor === null || !this.canSubmit) return false;
		this.saving = true;
		this.errorMessage = null;
		try {
			await PostAPI.update(Supabase.getClient(), this.id, this.editor.toInput());
			return true;
		} catch (e) {
			this.errorMessage = e instanceof Error ? e.message : '저장에 실패했어요.';
			this.saving = false;
			return false;
		}
	}
}

export { PostEditState };
export type { LoadResultType };
