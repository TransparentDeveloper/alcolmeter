import { PostModel } from '$entities/post/model';
import type { PostBlock } from '$entities/post/model';

// 문단 편집 상태. 한 위젯에 닫힌 지역 상태라 store가 아니라 ui의 class로 둔다.
// 문단(block) = 요소(element) 순서 리스트. 소제목(heading)은 문단당 1개이며 맨 앞에 온다.
class PostEditorState {
	title = $state('');
	blocks = $state<PostBlock[]>([PostModel.createBlock()]);

	constructor(initial?: { title: string; blocks: PostBlock[] }) {
		if (initial) {
			this.title = initial.title;
			this.blocks = initial.blocks.length
				? initial.blocks.map((b) => ({ ...b, elements: b.elements.map((e) => ({ ...e })) }))
				: [PostModel.createBlock()];
		}
	}

	get isValid(): boolean {
		return (
			this.title.trim().length > 0 &&
			this.blocks.some((b) => b.elements.some((e) => e.type === 'body' && e.value.trim().length > 0))
		);
	}

	hasHeading(blockId: string): boolean {
		const block = this.blocks.find((b) => b.id === blockId);
		return block?.elements.some((e) => e.type === 'heading') ?? false;
	}

	addBlock(): void {
		this.blocks = [...this.blocks, PostModel.createBlock()];
	}

	removeBlock(id: string): void {
		if (this.blocks.length <= 1) return;
		this.blocks = this.blocks.filter((b) => b.id !== id);
	}

	// 소제목은 문단 맨 앞(index 0)에 넣는다. 이미 있으면 무시한다 (문단당 1개).
	addHeading(blockId: string): void {
		this.blocks = this.blocks.map((b) =>
			b.id === blockId && !b.elements.some((e) => e.type === 'heading')
				? { ...b, elements: [PostModel.createElement('heading'), ...b.elements] }
				: b
		);
	}

	addBody(blockId: string): void {
		this.blocks = this.blocks.map((b) =>
			b.id === blockId ? { ...b, elements: [...b.elements, PostModel.createElement('body')] } : b
		);
	}

	removeElement(blockId: string, elementId: string): void {
		this.blocks = this.blocks.map((b) =>
			b.id === blockId ? { ...b, elements: b.elements.filter((e) => e.id !== elementId) } : b
		);
	}

	// 저장용 payload. 빈 텍스트 요소·빈 문단은 버리고 소제목은 트림한다.
	toInput(): { title: string; blocks: PostBlock[] } {
		return {
			title: this.title.trim(),
			blocks: this.blocks
				.map((b) => ({
					id: b.id,
					elements: b.elements
						.filter((e) => e.type === 'image' || e.value.trim().length > 0)
						.map((e) => (e.type === 'heading' ? { ...e, value: e.value.trim() } : { ...e }))
				}))
				.filter((b) => b.elements.length > 0)
		};
	}
}

export { PostEditorState };
