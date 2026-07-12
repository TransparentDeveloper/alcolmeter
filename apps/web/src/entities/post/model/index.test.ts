import { describe, expect, it } from 'vitest';
import { PostModel, createBlock } from '.';
import type { PostRow } from '.';

const row: PostRow = {
	id: 42,
	title: '첫 글',
	content: [
		{ id: 'b1', heading: '소제목', text: '본문 내용' },
		{ id: 'b2', heading: '', text: '두 번째 문단' }
	],
	author_id: 'uuid-1',
	created_at: '2026-07-12T00:00:00Z',
	updated_at: '2026-07-12T00:00:00Z',
	profiles: { display_name: '제프' }
};

describe('PostModel.fromRow', () => {
	it('행을 모델로 변환한다', () => {
		const post = PostModel.fromRow(row);
		expect(post.id).toBe(42);
		expect(post.title).toBe('첫 글');
		expect(post.blocks).toHaveLength(2);
		expect(post.author).toEqual({ id: 'uuid-1', displayName: '제프' });
	});

	it('profiles가 없으면 작성자 이름을 익명으로 채운다', () => {
		const post = PostModel.fromRow({ ...row, profiles: null });
		expect(post.author.displayName).toBe('익명');
	});

	it('summary는 첫 문단 본문을 100자로 자른다', () => {
		const long = 'x'.repeat(150);
		const post = PostModel.fromRow({ ...row, content: [{ id: 'b1', heading: '', text: long }] });
		expect(post.summary).toBe('x'.repeat(100) + '…');
	});

	it('toData는 직렬화 가능한 평문 객체를 반환한다', () => {
		const post = PostModel.fromRow(row);
		const data = post.toData();
		expect(JSON.parse(JSON.stringify(data))).toEqual(data);
		expect(new PostModel(data).title).toBe('첫 글');
	});
});

describe('createBlock', () => {
	it('빈 문단은 고유 id + 빈 heading/text를 갖는다', () => {
		const a = createBlock();
		const b = createBlock();
		expect(a.id).not.toBe(b.id);
		expect(a.heading).toBe('');
		expect(a.text).toBe('');
	});
});
