const SCHEMA_CONTEXT = 'https://schema.org';

export type QuestionAnswer = { question: string; answer: string };

export type DefinedTermInput = {
	name: string;
	description: string;
	url: string;
	/** 소속 용어집 URL (DefinedTermSet.url) */
	inDefinedTermSet?: string;
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
		return `<script type="application/ld+json">${JSON.stringify(schema)}</script>`;
	}
}
