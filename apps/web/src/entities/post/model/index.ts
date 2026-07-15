type BlockElementType = 'heading' | 'body' | 'image';

interface BlockElement {
	id: string;
	type: BlockElementType;
	value: string; // heading·body: 텍스트, image: URL (todo)
}

interface PostBlock {
	id: string;
	elements: BlockElement[]; // 소제목(heading)은 문단당 1개이며 맨 앞에 온다
}

interface PostAuthor {
	id: string;
	displayName: string;
}

interface PostData {
	id: number;
	title: string;
	blocks: PostBlock[];
	author: PostAuthor;
	createdAt: string;
	updatedAt: string;
}

// Supabase select 결과 형태 (posts + profiles 조인)
interface PostRow {
	id: number;
	title: string;
	content: PostBlock[] | null;
	author_id: string;
	created_at: string;
	updated_at: string;
	profiles: { display_name: string } | null;
}

const SUMMARY_LIMIT = 100;

class PostModel {
	private data: PostData;

	constructor(data: PostData) {
		this.data = data;
	}

	get id(): number {
		return this.data.id;
	}

	get title(): string {
		return this.data.title;
	}

	get blocks(): PostBlock[] {
		return this.data.blocks;
	}

	get author(): PostAuthor {
		return this.data.author;
	}

	get createdAt(): string {
		return this.data.createdAt;
	}

	get updatedAt(): string {
		return this.data.updatedAt;
	}

	get summary(): string {
		const body = this.data.blocks
			.flatMap((b) => b.elements)
			.find((e) => e.type === 'body' && e.value.trim().length > 0);
		const text = body?.value ?? '';
		return text.length > SUMMARY_LIMIT ? `${text.slice(0, SUMMARY_LIMIT)}…` : text;
	}

	toData(): PostData {
		return {
			...this.data,
			blocks: this.data.blocks.map((b) => ({
				...b,
				elements: b.elements.map((e) => ({ ...e }))
			})),
			author: { ...this.data.author }
		};
	}

	static createBlock(): PostBlock {
		return { id: crypto.randomUUID(), elements: [PostModel.createElement('body')] };
	}

	static createElement(type: BlockElementType): BlockElement {
		return { id: crypto.randomUUID(), type, value: '' };
	}

	static fromRow(row: PostRow): PostModel {
		return new PostModel({
			id: row.id,
			title: row.title,
			blocks: row.content ?? [],
			author: { id: row.author_id, displayName: row.profiles?.display_name ?? '익명' },
			createdAt: row.created_at,
			updatedAt: row.updated_at
		});
	}
}

export { PostModel };
export type { BlockElement, BlockElementType, PostBlock, PostAuthor, PostData, PostRow };
