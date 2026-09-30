import { getCollection } from 'astro:content';

export async function getPublishedPosts() {
  const posts = await getCollection('posts', ({ data }) => import.meta.env.DEV || !data.draft);
  return posts.sort((a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf());
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat('ko-KR', { dateStyle: 'long', timeZone: 'Asia/Seoul' }).format(date);
}
