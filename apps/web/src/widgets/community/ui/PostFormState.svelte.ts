// 커뮤니티 글 편집 폼 상태. 작성·수정 공용. 본문은 마크다운 문자열 하나다.
class PostFormState {
	title = $state('');
	body = $state('');
	// 저장에 성공하면 true. 이탈 경고·초안 저장이 이 값을 본다.
	saved = $state(false);

	private initial: { title: string; body: string };

	constructor(init?: { title: string; body: string }) {
		this.title = init?.title ?? '';
		this.body = init?.body ?? '';
		this.initial = { title: this.title, body: this.body };
	}

	get hasTitle(): boolean {
		return this.title.trim().length > 0;
	}

	get hasBody(): boolean {
		return this.body.trim().length > 0;
	}

	get isValid(): boolean {
		return this.hasTitle && this.hasBody;
	}

	// 처음 열었을 때와 달라졌는지. 작성 화면에선 한 글자라도 쓰면 true.
	get isDirty(): boolean {
		return this.title !== this.initial.title || this.body !== this.initial.body;
	}

	toInput(): { title: string; body: string } {
		return { title: this.title.trim(), body: this.body.trim() };
	}
}

export { PostFormState };
