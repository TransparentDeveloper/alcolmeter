import { error } from '@sveltejs/kit';
import { Supabase } from '$shared/supabase/api';
import { PostAPI } from '$entities/post/api';
import { WikiAPI } from '$entities/wiki/api';
import { renderWiki } from '$shared/lib/wiki-render';
import type { PageServerLoad } from './$types';

export const prerender = false;

export const load: PageServerLoad = async ({ params, cookies }) => {
	const id = Number(params.id);
	if (!Number.isInteger(id)) throw error(404, '글을 찾을 수 없습니다.');

	const client = Supabase.getServerClient(cookies);
	const post = await PostAPI.getById(client, id);
	if (!post) throw error(404, '글을 찾을 수 없습니다.');

	// 본문 안 [[용어]]를 실제 위키 문서로 잇는다 (없는 slug은 회색 표시로 렌더된다).
	const slugs = await WikiAPI.existingSlugs(client);

	return { post: post.toData(), bodyHtml: renderWiki(post.body, slugs) };
};
