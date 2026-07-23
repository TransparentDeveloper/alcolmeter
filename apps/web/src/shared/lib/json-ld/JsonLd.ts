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

export class JsonLd {
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
