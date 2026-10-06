import type { MarkdownHeading } from 'astro';
import { getCollection } from 'astro:content';

export async function getPublishedPosts() {
  const posts = await getCollection('posts', ({ data }) => import.meta.env.DEV || !data.draft);
  return posts.sort((a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf());
}

// GFM 각주 목록(SourceList)의 제목도 h2 로 나와서 목차에서 뺀다.
const FOOTNOTE_LABEL_SLUG = 'footnote-label';

export function getTocItems(headings: MarkdownHeading[]) {
  return headings.filter((heading) => heading.depth === 2 && heading.slug !== FOOTNOTE_LABEL_SLUG);
}
