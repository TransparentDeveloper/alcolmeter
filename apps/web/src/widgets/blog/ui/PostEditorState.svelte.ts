import { PostModel } from '$entities/post/model';
import type { PostBlock } from '$entities/post/model';

// 문단 배열 편집 상태. 한 위젯에 닫힌 지역 상태라 store가 아니라 ui의 class로 둔다.
class PostEditorState {
	title = $state('');
	blocks = $state<PostBlock[]>([PostModel.createBlock()]);

	constructor(initial?: { title: string; blocks: PostBlock[] }) {
		if (initial) {
			this.title = initial.title;
			this.blocks = initial.blocks.length ? initial.blocks.map((b) => ({ ...b })) : [PostModel.createBlock()];
		}
	}

	get isValid(): boolean {
		return this.title.trim().length > 0 && this.blocks.some((b) => b.text.trim().length > 0);
	}

	addBlock(): void {
		this.blocks = [...this.blocks, PostModel.createBlock()];
	}

	removeBlock(id: string): void {
		if (this.blocks.length <= 1) return;
		this.blocks = this.blocks.filter((b) => b.id !== id);
	}

	// 저장용 payload. 본문이 빈 문단은 버린다.
	toInput(): { title: string; blocks: PostBlock[] } {
		return {
			title: this.title.trim(),
			blocks: this.blocks
				.filter((b) => b.text.trim().length > 0)
				.map((b) => ({ id: b.id, heading: b.heading.trim(), text: b.text }))
		};
	}
}

export { PostEditorState };
