import { Supabase } from '$shared/supabase/api';
import { PostAPI } from '$entities/post/api';
import type { PageServerLoad } from './$types';

export const prerender = false;

export const load: PageServerLoad = async ({ cookies }) => {
	const client = Supabase.getServerClient(cookies);
	const posts = await PostAPI.list(client);
	return { posts: posts.map((p) => p.toData()) };
};
