import type { SupabaseClient } from '@supabase/supabase-js';
import { PostModel } from '$entities/post/model';
import type { PostRow } from '$entities/post/model';

// posts + profiles 조인. author_id → profiles.id FK가 있어야 이 임베드가 동작한다.
const SELECT = 'id, title, body, author_id, created_at, updated_at, profiles(display_name)';

interface PostInput {
	title: string;
	body: string;
}

interface PostIndexEntry {
	id: number;
	updatedAt: string;
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

	// 사이트맵처럼 주소와 갱신 시각만 필요한 곳을 위한 경량 조회 (본문 JSON을 끌어오지 않는다).
	static async listIndex(client: SupabaseClient, limit = 500): Promise<PostIndexEntry[]> {
		const { data, error } = await client
			.from('posts')
			.select('id, updated_at')
			.order('updated_at', { ascending: false })
			.limit(limit);
		if (error) throw error;
		return (data ?? []).map((row) => ({ id: row.id as number, updatedAt: row.updated_at as string }));
	}

	static async getById(client: SupabaseClient, id: number): Promise<PostModel | null> {
		const { data, error } = await client.from('posts').select(SELECT).eq('id', id).maybeSingle();
		if (error) throw error;
		return data ? PostModel.fromRow(data as unknown as PostRow) : null;
	}

	static async create(client: SupabaseClient, authorId: string, input: PostInput): Promise<number> {
		const { data, error } = await client
			.from('posts')
			.insert({ author_id: authorId, title: input.title, body: input.body })
			.select('id')
			.single();
		if (error) throw error;
		return data.id as number;
	}

	static async update(client: SupabaseClient, id: number, input: PostInput): Promise<void> {
		const { error } = await client
			.from('posts')
			.update({ title: input.title, body: input.body, updated_at: new Date().toISOString() })
			.eq('id', id);
		if (error) throw error;
	}

	static async remove(client: SupabaseClient, id: number): Promise<void> {
		const { error } = await client.from('posts').delete().eq('id', id);
		if (error) throw error;
	}
}

export { PostAPI };
export type { PostInput, PostIndexEntry };
