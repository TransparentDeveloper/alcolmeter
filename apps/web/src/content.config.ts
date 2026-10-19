import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const MAX_SOURCES = 5;
const TRAILING_URL = /^(.+?),\s*(https?:\/\/\S+)$/;
const READY_AT_FORMAT = '2026-10-19T14:30+09:00';

// 날짜만 쓰면 그날 09:00(KST)로 읽혀 발행 순서가 헷갈리므로 시각과 시간대까지 받는다.
// 초를 붙이면 YAML 이 Date 로 바꿔 날짜만 쓴 값과 구분할 수 없어 초 없는 문자열 하나로 정한다.
const readyAt = z
  .string({ error: `readyAt 은 ${READY_AT_FORMAT} 형식으로 쓴다.` })
  .regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(Z|[+-]\d{2}:\d{2})$/, `readyAt 은 ${READY_AT_FORMAT} 형식으로 쓴다.`)
  .pipe(z.coerce.date());

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
        description: z.string().trim().min(1).optional(),
        status: z.enum(['draft', 'ready', 'published']),
        readyAt: readyAt.optional(),
        publishedAt: z.coerce.date().optional(),
        updatedAt: z.coerce.date().optional(),
        cover: image(),
        coverAlt: z.string().min(1),
        sources: z.array(source).max(MAX_SOURCES).default([]),
      })
      .refine((data) => data.status !== 'ready' || data.readyAt !== undefined, {
        message: 'ready 글에는 readyAt 이 있어야 한다.',
        path: ['readyAt'],
      })
      .refine((data) => data.status !== 'published' || data.publishedAt !== undefined, {
        message: 'published 글에는 publishedAt 이 있어야 한다.',
        path: ['publishedAt'],
      })
      .refine((data) => data.status === 'draft' || data.sources.length > 0, {
        message: 'ready·published 글에는 참고 자료(sources)가 1개 이상 있어야 한다.',
        path: ['sources'],
      })
      .refine((data) => data.status === 'draft' || data.coverAlt !== '임시 표지', {
        message: 'ready·published 글에는 임시 표지를 쓸 수 없다.',
        path: ['coverAlt'],
      }),
});

export const collections = { posts };
