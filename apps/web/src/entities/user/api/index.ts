import { Supabase } from '$shared/supabase/api';
import type { UserModel } from '$entities/user/model';

// 로그인한 사용자의 공개 프로필(display_name)을 최신으로 맞춘다.
// 있으면 갱신, 없으면 생성 (RLS: 본인만 삽입·수정).
class UserAPI {
	static upsertProfile(user: UserModel) {
		return Supabase.getClient()
			.from('profiles')
			.upsert({ id: user.id, display_name: user.displayName }, { onConflict: 'id' });
	}

	// 관리자 판별용 role 조회. role 컬럼은 SELECT 공개, 쓰기만 잠겨 있다.
	static async getRole(userId: string): Promise<'admin' | 'user'> {
		const { data } = await Supabase.getClient().from('profiles').select('role').eq('id', userId).maybeSingle();
		return (data?.role as 'admin' | 'user') ?? 'user';
	}
}

export { UserAPI };
