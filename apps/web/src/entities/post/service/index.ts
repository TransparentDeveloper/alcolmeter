interface PostDraft {
	title: string;
	body: string;
}

// 작성 중 글을 브라우저에 임시 보관한다. 새 글은 'new', 수정은 글 id를 키로 쓴다.
// 초안은 보조 수단이라 저장 실패(용량 초과·프라이빗 모드)는 조용히 넘긴다.
class PostDraftService {
	private static PREFIX = 'community-draft:';

	static save(key: string, draft: PostDraft): void {
		const storage = PostDraftService.storage();
		if (!storage) return;
		try {
			storage.setItem(PostDraftService.storageKey(key), JSON.stringify(draft));
		} catch {
			// 용량 초과 등은 무시한다
		}
	}

	static load(key: string): PostDraft | null {
		const storage = PostDraftService.storage();
		if (!storage) return null;
		const raw = storage.getItem(PostDraftService.storageKey(key));
		if (!raw) return null;
		try {
			const parsed: unknown = JSON.parse(raw);
			if (typeof parsed !== 'object' || parsed === null) return null;
			const { title, body } = parsed as Partial<PostDraft>;
			if (typeof title !== 'string' || typeof body !== 'string') return null;
			return { title, body };
		} catch {
			return null;
		}
	}

	static clear(key: string): void {
		PostDraftService.storage()?.removeItem(PostDraftService.storageKey(key));
	}

	private static storage(): Storage | null {
		return typeof localStorage === 'undefined' ? null : localStorage;
	}

	private static storageKey(key: string): string {
		return `${PostDraftService.PREFIX}${key}`;
	}
}

export { PostDraftService };
export type { PostDraft };
