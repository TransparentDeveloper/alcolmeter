interface PostBlock {
	id: string;
	heading: string;
	text: string;
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

function createBlock(): PostBlock {
	return { id: crypto.randomUUID(), heading: '', text: '' };
}

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
		const text = this.data.blocks[0]?.text ?? '';
		return text.length > SUMMARY_LIMIT ? `${text.slice(0, SUMMARY_LIMIT)}…` : text;
	}

	toData(): PostData {
		return {
			...this.data,
			blocks: this.data.blocks.map((b) => ({ ...b })),
			author: { ...this.data.author }
		};
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

export { PostModel, createBlock };
export type { PostBlock, PostAuthor, PostData, PostRow };
