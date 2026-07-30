import { Supabase } from '$shared/supabase/api';
import { PostAPI } from '$entities/post/api';
import type { PageServerLoad } from './$types';

export const prerender = false;

const PAGE_SIZE = 20;

export const load: PageServerLoad = async ({ url, cookies }) => {
	// 잘못된 page 값(0·음수·문자)은 1페이지로 흘린다.
	const requested = Number(url.searchParams.get('page') ?? '1');
	const page = Number.isInteger(requested) && requested > 0 ? requested : 1;

	const client = Supabase.getServerClient(cookies);
	const { posts, total } = await PostAPI.listPage(client, page, PAGE_SIZE);

	return {
		posts: posts.map((p) => p.toData()),
		page,
		hasPrev: page > 1,
		hasNext: page * PAGE_SIZE < total
	};
};
