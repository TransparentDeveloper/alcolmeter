import { describe, it, expect } from 'vitest';
import { WikiTerm } from '$entities/wiki/model';
import type { WikiTermRow } from '$entities/wiki/model';

const row: WikiTermRow = {
	id: 1,
	slug: '고두밥',
	title: '고두밥',
	summary: '된밥',
	main_image: null,
	video: null,
	info_rows: [{ key: 'alternateName', label: '다른 이름', value: '지에밥' }],
	body: '**고두밥**',
	author_id: 'uid-1',
	created_at: 't1',
	updated_at: 't2',
	profiles: { display_name: '알콜미터' }
};

describe('WikiTerm.fromRow', () => {
	it('행을 도메인 모델로 변환한다', () => {
		const t = WikiTerm.fromRow(row);
		expect(t.slug).toBe('고두밥');
		expect(t.author.displayName).toBe('알콜미터');
		expect(t.infoRows).toEqual([{ key: 'alternateName', label: '다른 이름', value: '지에밥' }]);
	});
	it('info_rows가 null이면 빈 배열', () => {
		const t = WikiTerm.fromRow({ ...row, info_rows: null });
		expect(t.infoRows).toEqual([]);
	});
	it('profiles가 없으면 익명', () => {
		const t = WikiTerm.fromRow({ ...row, profiles: null });
		expect(t.author.displayName).toBe('익명');
	});
});
