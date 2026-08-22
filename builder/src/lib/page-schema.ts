import { z } from 'zod'

export const pageSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1).max(160),
  lang: z.string().min(2),
  slug: z.string().min(1),
  template: z.enum(['landing', 'text', 'video', 'audio', 'links']),
  status: z.enum(['draft', 'published']),
  seo: z
    .object({
      title: z.string().max(60).optional(),
      description: z.string().max(160).optional(),
      image: z.string().optional(),
      canonicalUrl: z.string().url().optional().or(z.literal('')),
      noIndex: z.boolean().optional(),
    })
    .default({}),
  puck: z.object({
    root: z.record(z.string(), z.unknown()).or(z.object({ props: z.record(z.string(), z.unknown()).default({}) })),
    content: z.array(z.record(z.string(), z.unknown())),
  }),
})
