import { getCollection } from 'astro:content';

// 개발 서버는 draft·ready 글도 보여 준다. 아직 발행일이 없으므로 오늘 날짜로 그린다.
export async function getPublishedPosts() {
  const posts = await getCollection('posts', ({ data }) => import.meta.env.DEV || data.status === 'published');
  return posts
    .map((post) => ({ ...post, data: { ...post.data, publishedAt: post.data.publishedAt ?? new Date() } }))
    .sort((a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf());
}
