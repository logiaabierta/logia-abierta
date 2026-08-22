import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
	// Load Markdown and MDX files in the `src/content/blog/` directory.
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	// Type-check frontmatter using a schema
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			// Transform string to Date object
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			heroImage: z.optional(image()),
		}),
});

const essays = defineCollection({
	loader: glob({ base: './src/content/essays', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			lang: z.string().default('es'),
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			author: z.string().default('Logia Abierta'),
			tags: z.array(z.string()).default([]),
			featured: z.boolean().default(false),
			heroImage: z.optional(image()),
		}),
});

const puckPages = defineCollection({
	loader: glob({ base: './src/content/puck-pages', pattern: '**/*.json' }),
	schema: z.object({
		title: z.string(),
		description: z.string().max(160),
		lang: z.string().default('es'),
		slug: z.string(),
		template: z.enum(['text', 'video', 'audio', 'landing', 'links']).default('landing'),
		status: z.enum(['draft', 'published']).default('published'),
		seo: z
			.object({
				title: z.string().max(60).optional(),
				description: z.string().max(160).optional(),
				image: z.string().optional(),
				canonicalUrl: z.string().url().optional(),
				noIndex: z.boolean().default(false),
			})
			.default({}),
		puck: z.object({
			root: z
				.object({
					props: z.record(z.string(), z.unknown()).default({}),
				})
				.default({ props: {} }),
			content: z.array(
				z.object({
					type: z.string(),
					props: z.record(z.string(), z.unknown()).default({}),
				}),
			),
		}),
	}),
});

export const collections = { blog, essays, puckPages };
