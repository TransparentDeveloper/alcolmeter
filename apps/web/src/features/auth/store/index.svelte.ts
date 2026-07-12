import type { UserModel } from '$entities/user/model';

type AuthStatusType = 'loading' | 'signedIn' | 'signedOut';

interface AuthState {
	user: UserModel | null;
	status: AuthStatusType;
	error: string | null;
}

class AuthStore {
	private state = $state<AuthState>({ user: null, status: 'loading', error: null });

	get value(): AuthState {
		return this.state;
	}

	set(next: AuthState): void {
		this.state = next;
	}
}

const authStore = new AuthStore();

export { authStore };
export type { AuthState, AuthStatusType };
