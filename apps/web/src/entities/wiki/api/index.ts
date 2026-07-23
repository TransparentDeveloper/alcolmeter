import type { SupabaseClient } from '@supabase/supabase-js';
import { WikiTerm, WikiRevision } from '$entities/wiki/model';
import type { WikiFields, WikiTermRow, WikiRevisionRow } from '$entities/wiki/model';

const TERM_SELECT =
	'id, slug, title, summary, main_image, video, info_rows, body, author_id, created_at, updated_at, profiles(display_name)';
const REV_SELECT =
	'id, term_id, type, title, summary, main_image, video, info_rows, body, editor_id, comment, reverted_from_revision_id, created_at, profiles(display_name)';

// 이력 삽입 payload (edit·revert 공용)
function revisionPayload(
	termId: number,
	type: 'edit' | 'revert',
	f: WikiFields,
	editorId: string,
	comment: string | null,
	revertedFrom: number | null
) {
	return {
		term_id: termId,
		type,
		title: f.title,
		summary: f.summary,
		main_image: f.mainImage,
		video: f.video,
		info_rows: f.infoRows,
		body: f.body,
		editor_id: editorId,
		comment,
		reverted_from_revision_id: revertedFrom
	};
}

class WikiAPI {
	static async list(client: SupabaseClient): Promise<WikiTerm[]> {
		const { data, error } = await client.from('wiki_terms').select(TERM_SELECT).order('title', { ascending: true });
		if (error) throw error;
		return (data ?? []).map((r) => WikiTerm.fromRow(r as unknown as WikiTermRow));
	}

	// 최근 수정순 N개 (홈 하이라이트용)
	static async recent(client: SupabaseClient, limit = 5): Promise<WikiTerm[]> {
		const { data, error } = await client
			.from('wiki_terms')
			.select(TERM_SELECT)
			.order('updated_at', { ascending: false })
			.limit(limit);
		if (error) throw error;
		return (data ?? []).map((r) => WikiTerm.fromRow(r as unknown as WikiTermRow));
	}

	static async getBySlug(client: SupabaseClient, slug: string): Promise<WikiTerm | null> {
		const { data, error } = await client.from('wiki_terms').select(TERM_SELECT).eq('slug', slug).maybeSingle();
		if (error) throw error;
		return data ? WikiTerm.fromRow(data as unknown as WikiTermRow) : null;
	}

	// 위키링크 존재확인용 slug 집합
	static async existingSlugs(client: SupabaseClient): Promise<Set<string>> {
		const { data, error } = await client.from('wiki_terms').select('slug');
		if (error) throw error;
		return new Set((data ?? []).map((r) => (r as { slug: string }).slug));
	}

	static async getHistory(client: SupabaseClient, termId: number): Promise<WikiRevision[]> {
		const { data, error } = await client
			.from('wiki_revisions')
			.select(REV_SELECT)
			.eq('term_id', termId)
			.order('created_at', { ascending: false });
		if (error) throw error;
		return (data ?? []).map((r) => WikiRevision.fromRow(r as unknown as WikiRevisionRow));
	}

	static async getRevision(client: SupabaseClient, revId: number): Promise<WikiRevision | null> {
		const { data, error } = await client.from('wiki_revisions').select(REV_SELECT).eq('id', revId).maybeSingle();
		if (error) throw error;
		return data ? WikiRevision.fromRow(data as unknown as WikiRevisionRow) : null;
	}

	// 새 용어 생성(RPC). 반환 = slug.
	static async create(client: SupabaseClient, f: WikiFields, comment: string | null): Promise<string> {
		const { data, error } = await client.rpc('create_wiki_term', {
			p_slug: f.slug,
			p_title: f.title,
			p_summary: f.summary,
			p_main_image: f.mainImage,
			p_video: f.video,
			p_info_rows: f.infoRows,
			p_body: f.body,
			p_comment: comment
		});
		if (error) throw error;
		return data as string;
	}

	// 대표이미지 업로드(스토리지 wiki-media). 공개 URL 반환. 제출 시 클라이언트에서 호출한다.
	static async uploadImage(client: SupabaseClient, file: File): Promise<string> {
		const ext = (file.name.split('.').pop() ?? 'bin').toLowerCase();
		const path = `terms/${crypto.randomUUID()}.${ext}`;
		const { error } = await client.storage
			.from('wiki-media')
			.upload(path, file, { cacheControl: '3600', contentType: file.type, upsert: false });
		if (error) throw error;
		return client.storage.from('wiki-media').getPublicUrl(path).data.publicUrl;
	}

	static async edit(
		client: SupabaseClient,
		termId: number,
		f: WikiFields,
		editorId: string,
		comment: string | null
	): Promise<void> {
		const { error } = await client.from('wiki_revisions').insert(revisionPayload(termId, 'edit', f, editorId, comment, null));
		if (error) throw error;
	}

	static async revert(
		client: SupabaseClient,
		termId: number,
		source: WikiRevision,
		editorId: string,
		comment: string | null
	): Promise<void> {
		const { error } = await client
			.from('wiki_revisions')
			.insert(revisionPayload(termId, 'revert', source.toFields(), editorId, comment, source.id));
		if (error) throw error;
	}

	static async remove(client: SupabaseClient, termId: number): Promise<void> {
		const { error } = await client.from('wiki_terms').delete().eq('id', termId);
		if (error) throw error;
	}
}

export { WikiAPI };
