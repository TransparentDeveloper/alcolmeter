import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPublishedPosts } from '../lib/posts';

export async function GET(context: APIContext) {
  const posts = await getPublishedPosts();
  return rss({
    title: 'alcolmeter',
    description: '술이 만들어지는 과정과 주류 정보를 정리합니다.',
    site: context.site ?? 'https://alcolmeter.kr',
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.publishedAt,
      link: `/posts/${post.id}`,
    })),
  });
}
