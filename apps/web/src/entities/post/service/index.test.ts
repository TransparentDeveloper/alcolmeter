import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PostDraftService } from '.';

function fakeStorage() {
	const map = new Map<string, string>();
	return {
		getItem: (k: string) => map.get(k) ?? null,
		setItem: (k: string, v: string) => void map.set(k, v),
		removeItem: (k: string) => void map.delete(k)
	};
}

beforeEach(() => {
	vi.stubGlobal('localStorage', fakeStorage());
});

describe('PostDraftService', () => {
	it('저장한 초안을 같은 키로 되읽는다', () => {
		PostDraftService.save('new', { title: '제목', body: '본문' });
		expect(PostDraftService.load('new')).toEqual({ title: '제목', body: '본문' });
	});

	it('키가 다르면 서로 섞이지 않는다', () => {
		PostDraftService.save('new', { title: '새 글', body: 'a' });
		PostDraftService.save('42', { title: '수정 중', body: 'b' });
		expect(PostDraftService.load('new')?.title).toBe('새 글');
		expect(PostDraftService.load('42')?.title).toBe('수정 중');
	});

	it('없는 초안은 null이다', () => {
		expect(PostDraftService.load('new')).toBeNull();
	});

	it('clear는 해당 키만 지운다', () => {
		PostDraftService.save('new', { title: 'a', body: 'a' });
		PostDraftService.save('42', { title: 'b', body: 'b' });
		PostDraftService.clear('new');
		expect(PostDraftService.load('new')).toBeNull();
		expect(PostDraftService.load('42')).not.toBeNull();
	});

	it('깨진 JSON은 null로 흘린다', () => {
		localStorage.setItem('community-draft:new', '{ not json');
		expect(PostDraftService.load('new')).toBeNull();
	});

	it('형태가 다른 값은 null로 흘린다', () => {
		localStorage.setItem('community-draft:new', JSON.stringify({ title: 1, body: null }));
		expect(PostDraftService.load('new')).toBeNull();
	});

	it('localStorage가 없는 환경에서도 던지지 않는다', () => {
		vi.stubGlobal('localStorage', undefined);
		expect(() => PostDraftService.save('new', { title: 'a', body: 'a' })).not.toThrow();
		expect(PostDraftService.load('new')).toBeNull();
		expect(() => PostDraftService.clear('new')).not.toThrow();
	});
});
