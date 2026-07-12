import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY } from '$env/static/public';

// 세션을 쿠키에 저장하는 브라우저 클라이언트. 서버 클라이언트는 두지 않는다 (전체 프리렌더).
// 생성은 첫 getClient() 호출까지 지연한다. 프리렌더 중 모듈 로드가 브라우저 전제와 충돌하지 않게 하기 위함.
class Supabase {
	private static client: SupabaseClient | null = null;

	static getClient(): SupabaseClient {
		Supabase.client ??= createBrowserClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY);
		return Supabase.client;
	}
}

export { Supabase };
