const SCHEMA_CONTEXT = 'https://schema.org';

export type QuestionAnswer = { question: string; answer: string };

export type DefinedTermInput = {
	name: string;
	description: string;
	url: string;
	/** 소속 용어집 URL (DefinedTermSet.url) */
	inDefinedTermSet?: string;
	image?: string;
	/** 동의어·별칭·외국어·한자 표기 */
	alternateName?: string[];
	/** 동일 대상을 가리키는 권위 있는 외부 문서 URL */
	sameAs?: string[];
};

export type DefinedTermSetInput = {
	name: string;
	description: string;
	url: string;
	terms: { name: string; description: string; url: string }[];
};

export type VideoObjectInput = {
	name: string;
	description: string;
	thumbnailUrl: string | string[];
	uploadDate: string;
	embedUrl: string;
	contentUrl: string;
};

export type OrganizationInput = {
	name: string;
	url: string;
	logo: string;
	description: string;
	/** 같은 주체를 가리키는 외부 계정·문서 URL */
	sameAs?: string[];
};

export type WebSiteInput = {
	name: string;
	url: string;
	description: string;
	/** 발행 주체 이름 (Organization.name과 같게 둔다) */
	publisherName: string;
};

export type ForumPostingInput = {
	headline: string;
	description: string;
	url: string;
	datePublished: string;
	dateModified: string;
	authorName: string;
	image?: string;
};

export class JsonLd {
	// 사이트 전역(브랜드) 스키마. 개별 페이지 스키마와 달리 전 페이지에 한 번씩 깔린다.
	static createOrganizationSchemaMarkup(org: OrganizationInput): string {
		return JsonLd.toMarkup({
			'@context': SCHEMA_CONTEXT,
			'@type': 'Organization',
			name: org.name,
			url: org.url,
			logo: org.logo,
			description: org.description,
			...(org.sameAs?.length ? { sameAs: org.sameAs } : {})
		});
	}

	static createWebSiteSchemaMarkup(site: WebSiteInput): string {
		return JsonLd.toMarkup({
			'@context': SCHEMA_CONTEXT,
			'@type': 'WebSite',
			name: site.name,
			url: site.url,
			description: site.description,
			inLanguage: 'ko-KR',
			publisher: { '@type': 'Organization', name: site.publisherName }
		});
	}

	static createDiscussionForumPostingSchemaMarkup(post: ForumPostingInput): string {
		return JsonLd.toMarkup({
			'@context': SCHEMA_CONTEXT,
			'@type': 'DiscussionForumPosting',
			headline: post.headline,
			description: post.description,
			url: post.url,
			datePublished: post.datePublished,
			dateModified: post.dateModified,
			author: { '@type': 'Person', name: post.authorName },
			...(post.image ? { image: post.image } : {})
		});
	}

	static createFAQPageSchemaMarkup(questions: QuestionAnswer[]): string {
		return JsonLd.toMarkup({
			'@context': SCHEMA_CONTEXT,
			'@type': 'FAQPage',
			mainEntity: questions.map(({ question, answer }) => ({
				'@type': 'Question',
				name: question,
				acceptedAnswer: { '@type': 'Answer', text: answer }
			}))
		});
	}

	static createDefinedTermSetSchemaMarkup(set: DefinedTermSetInput): string {
		return JsonLd.toMarkup({
			'@context': SCHEMA_CONTEXT,
			'@type': 'DefinedTermSet',
			name: set.name,
			description: set.description,
			url: set.url,
			hasDefinedTerm: set.terms.map((t) => ({
				'@type': 'DefinedTerm',
				name: t.name,
				description: t.description,
				url: t.url
			}))
		});
	}

	static createDefinedTermSchemaMarkup(term: DefinedTermInput): string {
		return JsonLd.toMarkup({
			'@context': SCHEMA_CONTEXT,
			'@type': 'DefinedTerm',
			name: term.name,
			description: term.description,
			...(term.inDefinedTermSet ? { inDefinedTermSet: term.inDefinedTermSet } : {}),
			...(term.image ? { image: term.image } : {}),
			...(term.alternateName?.length ? { alternateName: term.alternateName } : {}),
			...(term.sameAs?.length ? { sameAs: term.sameAs } : {}),
			url: term.url
		});
	}

	static createVideoObjectSchemaMarkup(video: VideoObjectInput): string {
		return JsonLd.toMarkup({
			'@context': SCHEMA_CONTEXT,
			'@type': 'VideoObject',
			name: video.name,
			description: video.description,
			thumbnailUrl: video.thumbnailUrl,
			uploadDate: video.uploadDate,
			embedUrl: video.embedUrl,
			contentUrl: video.contentUrl
		});
	}

	static createRecipeSchemaMarkup(data: Record<string, unknown>): string {
		return JsonLd.toMarkup({ '@context': SCHEMA_CONTEXT, '@type': 'Recipe', ...data });
	}

	static createHowToSchemaMarkup(data: Record<string, unknown>): string {
		return JsonLd.toMarkup({ '@context': SCHEMA_CONTEXT, '@type': 'HowTo', ...data });
	}

	static createArticleSchemaMarkup(data: Record<string, unknown>): string {
		return JsonLd.toMarkup({ '@context': SCHEMA_CONTEXT, '@type': 'Article', ...data });
	}

	private static toMarkup(schema: Record<string, unknown>): string {
		// XSS 차단: JSON.stringify는 `</script>`·`<`를 이스케이프하지 않는다. 이 마크업은 {@html}로 head에
		// 주입되고 schema에는 사용자 콘텐츠(용어 제목·요약 등)가 들어오므로, <>&를 유효한 JSON 유니코드
		// 이스케이프로 치환해 script 조기 종료를 막는다. (JSON 구조 문자는 <>&를 쓰지 않아 안전하다.)
		const json = JSON.stringify(schema)
			.replace(/</g, '\\u003c')
			.replace(/>/g, '\\u003e')
			.replace(/&/g, '\\u0026');
		return `<script type="application/ld+json">${json}</script>`;
	}
}
