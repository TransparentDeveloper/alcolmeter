import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const MAX_SOURCES = 5;
const TRAILING_URL = /^(.+?),\s*(https?:\/\/\S+)$/;

// 항목 형식: "저자(또는 기관), 제목, 발행처, 연도, URL". URL 은 있으면 맨 끝에 한 번만 쓴다.
const source = z
  .string()
  .trim()
  .min(1)
  .transform((value, ctx) => {
    const match = TRAILING_URL.exec(value);
    const text = match?.[1] ?? value;
    const url = match?.[2];
    if (/https?:\/\//.test(text) || (url !== undefined && !URL.canParse(url))) {
      ctx.addIssue({ code: 'custom', message: `참고 자료 URL 은 항목 끝에 ", URL" 형식으로 한 번만 쓴다: ${value}` });
      return z.NEVER;
    }
    return url === undefined ? { text } : { text, url };
  });

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
    z
      .object({
        title: z.string(),
        description: z.string(),
        publishedAt: z.coerce.date(),
        updatedAt: z.coerce.date().optional(),
        cover: image(),
        coverAlt: z.string().min(1),
        draft: z.boolean().default(false),
        sources: z.array(source).max(MAX_SOURCES).default([]),
      })
      .refine((data) => data.draft || data.sources.length > 0, {
        message: '공개 글에는 참고 자료(sources)가 1개 이상 있어야 한다.',
        path: ['sources'],
      }),
});

export const collections = { posts };
