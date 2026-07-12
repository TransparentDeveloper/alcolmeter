import { error } from '@sveltejs/kit';
import { Supabase } from '$shared/supabase/api';
import { PostAPI } from '$entities/post/api';
import type { PageServerLoad } from './$types';

export const prerender = false;

export const load: PageServerLoad = async ({ params, cookies }) => {
	const id = Number(params.id);
	if (!Number.isInteger(id)) throw error(404, '글을 찾을 수 없습니다.');

	const client = Supabase.getServerClient(cookies);
	const post = await PostAPI.getById(client, id);
	if (!post) throw error(404, '글을 찾을 수 없습니다.');

	return { post: post.toData() };
};
