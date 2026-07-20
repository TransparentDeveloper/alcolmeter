import { Supabase } from '$shared/supabase/api';
import { PostAPI } from '$entities/post/api';
import { WikiAPI } from '$entities/wiki/api';
import type { PostListItem } from '$entities/post/model';
import type { PageServerLoad } from './$types';

export const prerender = false;

const FEED_LIMIT = 5;

export const load: PageServerLoad = async ({ cookies }) => {
	const client = Supabase.getServerClient(cookies);
	const [posts, terms] = await Promise.all([
		PostAPI.list(client, FEED_LIMIT),
		WikiAPI.recent(client, FEED_LIMIT)
	]);
	return {
		posts: posts.map(
			(p): PostListItem => ({
				id: p.id,
				title: p.title,
				summary: p.summary,
				authorName: p.author.displayName,
				createdAt: p.createdAt
			})
		),
		terms: terms.map((t) => t.toData())
	};
};
