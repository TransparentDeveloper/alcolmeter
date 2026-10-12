import type { MarkdownHeading } from 'astro';
import { getCollection } from 'astro:content';

export async function getPublishedPosts() {
  const posts = await getCollection('posts', ({ data }) => import.meta.env.DEV || !data.draft);
  return posts.sort((a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf());
}

interface TocItem {
  slug: string;
  text: string;
  children: { slug: string; text: string }[];
}

// 첫 h2 앞의 h3 는 글 구조 규칙상 없다고 보고 버린다.
export function getTocItems(headings: MarkdownHeading[]): TocItem[] {
  const items: TocItem[] = [];
  for (const { depth, slug, text } of headings) {
    if (depth === 2) items.push({ slug, text, children: [] });
    else if (depth === 3) items.at(-1)?.children.push({ slug, text });
  }
  return items;
}
