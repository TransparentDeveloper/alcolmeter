import { createBrowserClient, createServerClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Cookies } from '@sveltejs/kit';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY } from '$env/static/public';

// 세션을 쿠키에 저장하는 브라우저 클라이언트. 첫 getClient() 호출까지 생성을 지연한다.
// 서버 클라이언트는 요청마다 쿠키가 다르므로 메모이즈하지 않고 매번 만든다.
class Supabase {
	private static client: SupabaseClient | null = null;

	static getClient(): SupabaseClient {
		Supabase.client ??= createBrowserClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY);
		return Supabase.client;
	}

	static getServerClient(cookies: Cookies): SupabaseClient {
		return createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY, {
			cookies: {
				getAll: () => cookies.getAll(),
				setAll: (toSet) =>
					toSet.forEach(({ name, value, options }) =>
						cookies.set(name, value, { ...options, path: '/' })
					)
			}
		});
	}
}

export { Supabase };
