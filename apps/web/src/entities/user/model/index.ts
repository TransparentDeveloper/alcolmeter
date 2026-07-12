import type { User as SupabaseUser } from '@supabase/supabase-js';

type AuthProviderType = 'email' | 'google';

const AUTH_PROVIDERS: readonly AuthProviderType[] = ['email', 'google'];

function toAuthProvider(value: unknown): AuthProviderType | null {
	return AUTH_PROVIDERS.includes(value as AuthProviderType) ? (value as AuthProviderType) : null;
}

interface UserData {
	id: string;
	email: string | null;
	name: string | null;
	avatarUrl: string | null;
	provider: AuthProviderType | null;
}

class UserModel {
	private data: UserData;

	constructor(data: UserData) {
		this.data = data;
	}

	get id(): string {
		return this.data.id;
	}

	get email(): string | null {
		return this.data.email;
	}

	get name(): string | null {
		return this.data.name;
	}

	get avatarUrl(): string | null {
		return this.data.avatarUrl;
	}

	get provider(): AuthProviderType | null {
		return this.data.provider;
	}

	get displayName(): string {
		if (this.data.name) return this.data.name;
		if (this.data.email) {
			const local = this.data.email.split('@')[0];
			return `${local.slice(0, 3)}***`;
		}
		return '익명';
	}

	// 소셜(Google)은 full_name·name으로 이름이 온다. 이메일 가입은 메타데이터가 비어 null이 된다.
	static fromSupabaseUser(supabaseUser: SupabaseUser): UserModel {
		const meta = supabaseUser.user_metadata ?? {};
		return new UserModel({
			id: supabaseUser.id,
			email: supabaseUser.email ?? null,
			name: meta.full_name ?? meta.name ?? null,
			avatarUrl: meta.avatar_url ?? meta.picture ?? null,
			provider: toAuthProvider(supabaseUser.app_metadata?.provider)
		});
	}
}

export { UserModel };
export type { AuthProviderType, UserData };
