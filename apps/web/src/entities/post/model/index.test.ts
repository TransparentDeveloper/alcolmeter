import { describe, expect, it } from 'vitest';
import { PostModel } from '.';
import type { PostRow } from '.';

const row: PostRow = {
	id: 42,
	title: '첫 글',
	content: [
		{
			id: 'b1',
			elements: [
				{ id: 'e1', type: 'heading', value: '소제목' },
				{ id: 'e2', type: 'body', value: '본문 내용' }
			]
		},
		{ id: 'b2', elements: [{ id: 'e3', type: 'body', value: '두 번째 문단' }] }
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

	it('summary는 소제목을 건너뛰고 첫 본문 요소를 100자로 자른다', () => {
		const long = 'x'.repeat(150);
		const post = PostModel.fromRow({
			...row,
			content: [
				{
					id: 'b1',
					elements: [
						{ id: 'e1', type: 'heading', value: '제목만' },
						{ id: 'e2', type: 'body', value: long }
					]
				}
			]
		});
		expect(post.summary).toBe('x'.repeat(100) + '…');
	});

	it('shareImage는 본문 첫 이미지 요소를 쓰고 없으면 null이다', () => {
		expect(PostModel.fromRow(row).shareImage).toBeNull();

		const withImage = PostModel.fromRow({
			...row,
			content: [
				{ id: 'b1', elements: [{ id: 'e1', type: 'body', value: '본문' }] },
				{
					id: 'b2',
					elements: [
						{ id: 'e2', type: 'image', value: '   ' },
						{ id: 'e3', type: 'image', value: 'https://cdn.example.com/a.png' },
						{ id: 'e4', type: 'image', value: 'https://cdn.example.com/b.png' }
					]
				}
			]
		});
		expect(withImage.shareImage).toBe('https://cdn.example.com/a.png');
	});

	it('toData는 직렬화 가능한 평문 객체를 반환한다', () => {
		const post = PostModel.fromRow(row);
		const data = post.toData();
		expect(JSON.parse(JSON.stringify(data))).toEqual(data);
		expect(new PostModel(data).title).toBe('첫 글');
	});
});

describe('PostModel.createBlock', () => {
	it('새 문단은 고유 id + 빈 본문 요소 하나를 갖는다', () => {
		const a = PostModel.createBlock();
		const b = PostModel.createBlock();
		expect(a.id).not.toBe(b.id);
		expect(a.elements).toHaveLength(1);
		expect(a.elements[0].type).toBe('body');
		expect(a.elements[0].value).toBe('');
	});
});

describe('PostModel.createElement', () => {
	it('지정한 타입의 빈 요소를 만든다', () => {
		const h = PostModel.createElement('heading');
		expect(h.type).toBe('heading');
		expect(h.value).toBe('');
		expect(h.id).toBeTruthy();
	});
});
