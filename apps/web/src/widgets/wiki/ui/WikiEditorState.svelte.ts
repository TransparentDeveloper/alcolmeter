import type { WikiFields, WikiVideo } from '$entities/wiki/model';
import { toSlug } from '$entities/wiki/lib';

// 위키 편집 폼 상태. 작성(제목 편집 가능)·수정(제목 고정) 공용.
class WikiEditorState {
	readonly isNew: boolean;
	title = $state('');
	summary = $state('');
	category = $state('');
	relatedText = $state(''); // 콤마 구분 slug
	mainImage = $state('');
	video = $state<WikiVideo | null>(null);
	body = $state('');

	constructor(init?: Partial<WikiFields> & { isNew?: boolean }) {
		this.isNew = init?.isNew ?? false;
		if (init) {
			this.title = init.title ?? '';
			this.summary = init.summary ?? '';
			this.category = init.category ?? '';
			this.relatedText = (init.related ?? []).join(', ');
			this.mainImage = init.mainImage ?? '';
			this.video = init.video ?? null;
			this.body = init.body ?? '';
		}
	}

	get slug(): string {
		return toSlug(this.title);
	}
	get isValid(): boolean {
		return this.slug.length > 0 && this.body.trim().length > 0;
	}

	toFields(): WikiFields {
		return {
			slug: this.slug,
			title: this.title.trim(),
			summary: this.summary.trim(),
			category: this.category.trim(),
			related: this.relatedText
				.split(',')
				.map((s) => s.trim())
				.filter(Boolean),
			mainImage: this.mainImage.trim() || null,
			video: this.video,
			body: this.body
		};
	}
}

export { WikiEditorState };
