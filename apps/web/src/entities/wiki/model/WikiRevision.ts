import { WikiTerm } from './WikiTerm';
import type { WikiFields, WikiRevisionData, WikiRevisionRow } from './type';

class WikiRevision {
	private data: WikiRevisionData;
	constructor(data: WikiRevisionData) {
		this.data = data;
	}
	get id() {
		return this.data.id;
	}
	get termId() {
		return this.data.termId;
	}
	get type() {
		return this.data.type;
	}
	get editor() {
		return this.data.editor;
	}
	get comment() {
		return this.data.comment;
	}
	get revertedFrom() {
		return this.data.revertedFrom;
	}
	get createdAt() {
		return this.data.createdAt;
	}
	get title() {
		return this.data.title;
	}
	get body() {
		return this.data.body;
	}

	toData(): WikiRevisionData {
		return {
			...this.data,
			mainImage: WikiTerm.cloneImage(this.data.mainImage),
			video: WikiTerm.cloneVideo(this.data.video),
			infoRows: WikiTerm.cloneRows(this.data.infoRows),
			editor: { ...this.data.editor }
		};
	}
	toFields(): WikiFields {
		const { slug, title, summary, mainImage, video, infoRows, body } = this.data;
		return {
			slug,
			title,
			summary,
			mainImage: WikiTerm.cloneImage(mainImage),
			video: WikiTerm.cloneVideo(video),
			infoRows: WikiTerm.cloneRows(infoRows),
			body
		};
	}

	static fromRow(row: WikiRevisionRow): WikiRevision {
		return new WikiRevision({
			id: row.id,
			termId: row.term_id,
			type: row.type,
			slug: '',
			title: row.title,
			summary: row.summary,
			mainImage: row.main_image,
			video: row.video,
			infoRows: row.info_rows ?? [],
			body: row.body,
			editor: { id: row.editor_id, displayName: row.profiles?.display_name ?? '익명' },
			comment: row.comment,
			revertedFrom: row.reverted_from_revision_id,
			createdAt: row.created_at
		});
	}
}

export { WikiRevision };
