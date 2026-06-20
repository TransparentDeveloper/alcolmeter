import { readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

// 콘텐츠 디렉터리는 이 파일 기준으로 해석한다 (cwd 비의존).
// src/lib/dictionary/ → ../../content/dictionary = src/content/dictionary
const CONTENT_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '../../content/dictionary');

const WIKI_LINK = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g;

function readExistingSlugs() {
	try {
		return new Set(
			readdirSync(CONTENT_DIR)
				.filter((f) => f.endsWith('.md'))
				.map((f) => f.replace(/\.md$/, ''))
		);
	} catch {
		return new Set();
	}
}

/**
 * `[[용어]]` / `[[용어|표시문구]]` 를 용어사전 링크로 바꾸는 Svelte 프리프로세서.
 *
 * 왜 remark 플러그인이 아니라 프리프로세서인가:
 * `[[용어]]`는 마크다운의 링크 참조 문법(`[label]`)과 충돌해, 파싱이 끝난 mdast에서는
 * 대괄호가 여러 노드로 쪼개진다. 그래서 **파싱 전 원본 문자열** 단계에서 raw HTML로 치환한다.
 * (mdsvex보다 먼저 실행되도록 preprocess 배열 앞에 둔다.)
 *
 * - 존재하는 용어 → `<a class="wiki-link" href="/dictionary/{slug}">label</a>`
 * - 아직 없는 용어 → `<span class="wiki-link wiki-link--missing">label</span>`
 *   (끊긴 링크를 만들지 않으면서 작성 우선순위를 드러낸다)
 */
export function wikiLinkPreprocess() {
	return {
		name: 'wiki-link',
		/**
		 * @param {{ content: string, filename?: string }} input
		 */
		markup({ content, filename }) {
			if (!filename || !filename.endsWith('.md')) return;

			const slugs = readExistingSlugs();
			const code = content.replace(WIKI_LINK, (_full, rawTarget, rawLabel) => {
				const slug = rawTarget.trim();
				const label = (rawLabel ?? rawTarget).trim();
				return slugs.has(slug)
					? `<a class="wiki-link" href="/dictionary/${slug}">${label}</a>`
					: `<span class="wiki-link wiki-link--missing" title="아직 작성되지 않은 용어">${label}</span>`;
			});

			return { code };
		}
	};
}
