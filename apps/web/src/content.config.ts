import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const posts = defineCollection({
  loader: glob({
    pattern: '**/index.{md,mdx}',
    base: './src/content/posts',
    generateId: ({ entry }) => entry.split('/')[0] ?? entry,
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
