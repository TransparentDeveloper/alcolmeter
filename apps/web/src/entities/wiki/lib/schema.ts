import { JsonLd } from '$shared/lib';
import { videoThumbnails, videoWatchUrl, videoEmbedUrl } from './video';
import type { WikiTermData, WikiInfoRow } from '$entities/wiki/model';

const WIKI_BASE = 'https://alcolmeter.kr/wiki';

// 같은 key의 행 값을 콤마로 분해해 모으고 중복을 제거한다 (alternateName·sameAs 공용).
function collectCsv(rows: WikiInfoRow[], key: WikiInfoRow['key']): string[] {
	const values = rows
		.filter((r) => r.key === key)
		.flatMap((r) => r.value.split(/[\n,]/))
		.map((s) => s.trim())
		.filter(Boolean);
	return [...new Set(values)];
}

// 상세 페이지 구조화 데이터. 존재하는 소스만 방출한다:
// image·alternateName·sameAs → DefinedTerm, 영상 → VideoObject. (info_rows key=text는 표시 전용이라 제외.)
function buildWikiSchemas(term: WikiTermData): string[] {
	const url = `${WIKI_BASE}/${encodeURIComponent(term.slug)}`;
	const alternateName = collectCsv(term.infoRows, 'alternateName');
	const sameAs = collectCsv(term.infoRows, 'sameAs');

	const schemas = [
		JsonLd.createDefinedTermSchemaMarkup({
			name: term.title,
			description: term.summary,
			inDefinedTermSet: WIKI_BASE,
			url,
			...(term.mainImage ? { image: term.mainImage.url } : {}),
			...(alternateName.length ? { alternateName } : {}),
			...(sameAs.length ? { sameAs } : {})
		})
	];

	if (term.video) {
		schemas.push(
			JsonLd.createVideoObjectSchemaMarkup({
				name: term.video.title,
				description: term.video.description,
				thumbnailUrl: videoThumbnails(term.video),
				uploadDate: term.video.uploadDate,
				embedUrl: videoEmbedUrl(term.video),
				contentUrl: videoWatchUrl(term.video)
			})
		);
	}

	return schemas;
}

export { buildWikiSchemas };
