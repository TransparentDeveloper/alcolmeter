import { describe, expect, it } from 'vitest';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { UserModel } from '.';

function supabaseUser(overrides: Partial<SupabaseUser>): SupabaseUser {
	return {
		id: 'uuid-1',
		aud: 'authenticated',
		created_at: '2026-07-11T00:00:00Z',
		app_metadata: {},
		user_metadata: {},
		...overrides
	};
}

describe('UserModel.fromSupabaseUser', () => {
	it('Google 유저 메타데이터를 User로 변환한다', () => {
		const user = UserModel.fromSupabaseUser(
			supabaseUser({
				email: 'jeff@example.com',
				app_metadata: { provider: 'google', providers: ['google'] },
				user_metadata: {
					full_name: '제프',
					avatar_url: 'https://lh3.googleusercontent.com/a/primary.jpg',
					picture: 'https://lh3.googleusercontent.com/a/fallback.jpg'
				}
			})
		);

		expect(user.id).toBe('uuid-1');
		expect(user.email).toBe('jeff@example.com');
		expect(user.name).toBe('제프');
		expect(user.avatarUrl).toBe('https://lh3.googleusercontent.com/a/primary.jpg');
		expect(user.provider).toBe('google');
	});

	it('avatar_url이 없으면 picture로 폴백한다', () => {
		const user = UserModel.fromSupabaseUser(
			supabaseUser({
				user_metadata: { picture: 'https://lh3.googleusercontent.com/a/fallback.jpg' }
			})
		);

		expect(user.avatarUrl).toBe('https://lh3.googleusercontent.com/a/fallback.jpg');
	});

	it('full_name이 없으면 name으로 폴백한다', () => {
		const user = UserModel.fromSupabaseUser(supabaseUser({ user_metadata: { name: '제프' } }));

		expect(user.name).toBe('제프');
	});

	it('full_name과 name이 둘 다 있으면 full_name이 우선한다', () => {
		const user = UserModel.fromSupabaseUser(
			supabaseUser({ user_metadata: { full_name: '풀네임 제프', name: '그냥 제프' } })
		);

		expect(user.name).toBe('풀네임 제프');
	});

	it('이메일 가입 유저를 변환한다', () => {
		const user = UserModel.fromSupabaseUser(
			supabaseUser({
				email: 'jeff@example.com',
				app_metadata: { provider: 'email', providers: ['email'] },
				user_metadata: {}
			})
		);

		expect(user.email).toBe('jeff@example.com');
		expect(user.name).toBeNull();
		expect(user.avatarUrl).toBeNull();
		expect(user.provider).toBe('email');
	});

	it('메타데이터가 비어 있으면 null로 채운다', () => {
		const user = UserModel.fromSupabaseUser(supabaseUser({}));

		expect(user.id).toBe('uuid-1');
		expect(user.email).toBeNull();
		expect(user.name).toBeNull();
		expect(user.avatarUrl).toBeNull();
		expect(user.provider).toBeNull();
	});

	it('알 수 없는 provider는 null로 정규화한다', () => {
		const user = UserModel.fromSupabaseUser(supabaseUser({ app_metadata: { provider: 'apple' } }));

		expect(user.provider).toBeNull();
	});
});
