import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const posts = defineCollection({
  loader: glob({
    pattern: '**/index.mdx',
    base: './src/content/posts',
    generateId: ({ entry }) => {
      const id = entry.split('/')[0] ?? '';
      if (!/^[1-9]\d*$/.test(id)) throw new Error(`글 폴더 이름은 1 이상의 정수여야 한다: ${entry}`);
      return id;
    },
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      publishedAt: z.coerce.date(),
      updatedAt: z.coerce.date().optional(),
      cover: image(),
      coverAlt: z.string().min(1),
      draft: z.boolean().default(false),
    }),
});

export const collections = { posts };
