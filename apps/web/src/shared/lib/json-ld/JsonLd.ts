const SCHEMA_CONTEXT = 'https://schema.org';

export type QuestionAnswer = { question: string; answer: string };

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

	static createVideoObjectSchemaMarkup(data: Record<string, unknown>): string {
		return JsonLd.toMarkup({ '@context': SCHEMA_CONTEXT, '@type': 'VideoObject', ...data });
	}

	static createDefinedTermSetSchemaMarkup(data: Record<string, unknown>): string {
		return JsonLd.toMarkup({ '@context': SCHEMA_CONTEXT, '@type': 'DefinedTermSet', ...data });
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
