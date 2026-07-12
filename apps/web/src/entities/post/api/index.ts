import type { SupabaseClient } from '@supabase/supabase-js';
import { PostModel } from '$entities/post/model';
import type { PostBlock, PostRow } from '$entities/post/model';

// posts + profiles 조인. author_id → profiles.id FK가 있어야 이 임베드가 동작한다.
const SELECT = 'id, title, content, author_id, created_at, updated_at, profiles(display_name)';

interface PostInput {
	title: string;
	blocks: PostBlock[];
}

// 읽기는 서버/브라우저 클라이언트를 인자로 받아 SSR·CSR 공용. 쓰기는 인증된 브라우저 클라이언트로 호출한다.
class PostAPI {
	static async list(client: SupabaseClient, limit = 20): Promise<PostModel[]> {
		const { data, error } = await client
			.from('posts')
			.select(SELECT)
			.order('created_at', { ascending: false })
			.limit(limit);
		if (error) throw error;
		return (data ?? []).map((row) => PostModel.fromRow(row as unknown as PostRow));
	}

	static async getById(client: SupabaseClient, id: number): Promise<PostModel | null> {
		const { data, error } = await client.from('posts').select(SELECT).eq('id', id).maybeSingle();
		if (error) throw error;
		return data ? PostModel.fromRow(data as unknown as PostRow) : null;
	}

	static async create(client: SupabaseClient, authorId: string, input: PostInput): Promise<number> {
		const { data, error } = await client
			.from('posts')
			.insert({ author_id: authorId, title: input.title, content: input.blocks })
			.select('id')
			.single();
		if (error) throw error;
		return data.id as number;
	}

	static async update(client: SupabaseClient, id: number, input: PostInput): Promise<void> {
		const { error } = await client
			.from('posts')
			.update({ title: input.title, content: input.blocks, updated_at: new Date().toISOString() })
			.eq('id', id);
		if (error) throw error;
	}

	static async remove(client: SupabaseClient, id: number): Promise<void> {
		const { error } = await client.from('posts').delete().eq('id', id);
		if (error) throw error;
	}
}

export { PostAPI };
export type { PostInput };
