import type { AuthChangeEvent, Provider, Session } from '@supabase/supabase-js';
import { Supabase } from '$shared/supabase/api';

class AuthAPI {
	static signUp(email: string, password: string) {
		return Supabase.getClient().auth.signUp({ email, password });
	}

	static signInWithPassword(email: string, password: string) {
		return Supabase.getClient().auth.signInWithPassword({ email, password });
	}

	static signInWithOAuth(provider: Provider, redirectTo: string) {
		return Supabase.getClient().auth.signInWithOAuth({ provider, options: { redirectTo } });
	}

	static signOut() {
		return Supabase.getClient().auth.signOut();
	}

	// 본인 계정 삭제(회원 탈퇴). definer RPC가 저작 익명화 + profiles·auth.users 삭제를 트랜잭션으로 처리한다.
	static deleteAccount() {
		return Supabase.getClient().rpc('delete_own_account');
	}

	static onAuthStateChange(callback: (event: AuthChangeEvent, session: Session | null) => void) {
		return Supabase.getClient().auth.onAuthStateChange(callback);
	}
}

export { AuthAPI };
