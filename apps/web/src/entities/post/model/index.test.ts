import { describe, expect, it } from 'vitest';
import { PostModel } from '.';
import type { PostRow } from '.';

const row: PostRow = {
	id: 42,
	title: '첫 글',
	body: '## 소제목\n\n본문 내용\n\n두 번째 문단',
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
		expect(post.body).toBe('## 소제목\n\n본문 내용\n\n두 번째 문단');
		expect(post.author).toEqual({ id: 'uuid-1', displayName: '제프' });
	});

	it('profiles가 없으면 작성자 이름을 익명으로 채운다', () => {
		const post = PostModel.fromRow({ ...row, profiles: null });
		expect(post.author.displayName).toBe('익명');
	});

	it('body가 null이면 빈 문자열로 채운다', () => {
		const post = PostModel.fromRow({ ...row, body: null });
		expect(post.body).toBe('');
		expect(post.summary).toBe('');
	});
});

describe('PostModel.summary', () => {
	it('마크다운 표시 기호를 걷어낸 평문을 만든다', () => {
		const post = PostModel.fromRow({
			...row,
			body: '## 소제목\n\n**굵게** 그리고 *기울임*\n\n- 첫째\n- 둘째\n\n> 인용'
		});
		expect(post.summary).toBe('소제목 굵게 그리고 기울임 첫째 둘째 인용');
	});

	it('에디터가 쓰는 밑줄 기울임과 겹친 강조를 걷어낸다', () => {
		const post = PostModel.fromRow({
			...row,
			body: '_기울임_ 과 _**굵은 기울임**_ 과 ~~취소~~'
		});
		expect(post.summary).toBe('기울임 과 굵은 기울임 과 취소');
	});

	it('링크는 표시 문구만 남긴다', () => {
		const post = PostModel.fromRow({
			...row,
			body: '자세히는 [알콜미터](https://alcolmeter.kr)를 보세요'
		});
		expect(post.summary).toBe('자세히는 알콜미터를 보세요');
	});

	it('위키링크는 표시 문구를, 없으면 slug을 남긴다', () => {
		expect(PostModel.fromRow({ ...row, body: '[[막걸리]] 이야기' }).summary).toBe('막걸리 이야기');
		expect(PostModel.fromRow({ ...row, body: '[[막걸리|탁주]] 이야기' }).summary).toBe(
			'탁주 이야기'
		);
	});

	it('이미지는 요약에서 지운다', () => {
		const post = PostModel.fromRow({
			...row,
			body: '![술 사진](https://cdn.example.com/a.png)\n\n오늘 빚은 술'
		});
		expect(post.summary).toBe('오늘 빚은 술');
	});

	it('구분선은 요약에서 지운다', () => {
		const post = PostModel.fromRow({ ...row, body: '앞 문단\n\n---\n\n뒤 문단' });
		expect(post.summary).toBe('앞 문단 뒤 문단');
	});

	it('번호 목록의 마커를 지운다', () => {
		const post = PostModel.fromRow({ ...row, body: '1. 쌀 씻기\n2. 고두밥 찌기' });
		expect(post.summary).toBe('쌀 씻기 고두밥 찌기');
	});

	it('100자를 넘으면 자르고 줄임표를 붙인다', () => {
		const post = PostModel.fromRow({ ...row, body: 'x'.repeat(150) });
		expect(post.summary).toBe('x'.repeat(100) + '…');
	});
});

describe('PostModel.shareImage', () => {
	it('본문 첫 이미지 URL을 쓴다', () => {
		const post = PostModel.fromRow({
			...row,
			body: '머리말\n\n![a](https://cdn.example.com/a.png)\n\n![b](https://cdn.example.com/b.png)'
		});
		expect(post.shareImage).toBe('https://cdn.example.com/a.png');
	});

	it('이미지가 없으면 null이다', () => {
		expect(PostModel.fromRow(row).shareImage).toBeNull();
	});
});

describe('PostModel.toData', () => {
	it('직렬화 가능한 평문 객체를 반환한다', () => {
		const post = PostModel.fromRow(row);
		const data = post.toData();
		expect(JSON.parse(JSON.stringify(data))).toEqual(data);
		expect(new PostModel(data).title).toBe('첫 글');
	});
});
