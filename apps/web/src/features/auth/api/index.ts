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

	static onAuthStateChange(callback: (event: AuthChangeEvent, session: Session | null) => void) {
		return Supabase.getClient().auth.onAuthStateChange(callback);
	}
}

export { AuthAPI };
