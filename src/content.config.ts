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
			lang: z.string().default('es'),
			status: z.enum(['draft', 'published']).default('published'),
			excerpt: z.string().optional(),
			// Transform string to Date object
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			author: z.string().optional(),
			category: z.string().optional(),
			tags: z.array(z.string()).default([]),
			readingMinutes: z.number().optional(),
			featured: z.boolean().default(false),
			heroImage: z.optional(image()),
			heroImageUrl: z.string().url().optional(),
			heroImageAlt: z.string().optional(),
			thumbnailUrl: z.string().url().optional(),
			thumbnailAlt: z.string().optional(),
			canonicalUrl: z.string().url().optional(),
			ogTitle: z.string().optional(),
			ogDescription: z.string().optional(),
			ogImageUrl: z.string().url().optional(),
			faqs: z
				.array(
					z.object({
						question: z.string(),
						answer: z.string(),
					})
				)
				.optional(),
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
			heroImageUrl: z.string().url().optional(),
			heroImageAlt: z.string().optional(),
		}),
});

const authors = defineCollection({
	loader: glob({ base: './src/content/authors', pattern: '**/*.json' }),
	schema: z.object({
		publicName: z.string(),
		displayMode: z.enum(['pseudonym', 'real', 'both']).default('pseudonym'),
		internalIdentity: z.string().optional(),
		realName: z.string().optional(),
		archetype: z.string().default('otro'),
		bio: z.string().optional(),
		languages: z.array(z.string()).default(['es']),
		rites: z.array(z.string()).default([]),
		country: z.string().default('DO'),
		city: z.string().optional(),
		avatarUrl: z.string().url().optional(),
		avatarAlt: z.string().optional(),
		website: z.string().url().optional(),
		instagram: z.string().url().optional(),
		linkedin: z.string().url().optional(),
		substack: z.string().url().optional(),
	}),
});

const categories = defineCollection({
	loader: glob({ base: './src/content/categories', pattern: '**/*.json' }),
	schema: z.object({
		title: z.string(),
		lang: z.string().default('es'),
		description: z.string().optional(),
	}),
});

const tags = defineCollection({
	loader: glob({ base: './src/content/tags', pattern: '**/*.json' }),
	schema: z.object({
		title: z.string(),
		lang: z.string().default('es'),
		description: z.string().optional(),
	}),
});

const mediaNotes = defineCollection({
	loader: glob({ base: './src/content/media-notes', pattern: '**/*.json' }),
	schema: z.object({
		title: z.string(),
		kind: z.enum(['image', 'audio', 'video', 'document', 'attachment']).default('image'),
		r2Url: z.string().url(),
		altText: z.string().optional(),
		credit: z.string().optional(),
		publishedAt: z.coerce.date().optional(),
	}),
});

const editorialMediaBase = z.object({
	title: z.string(),
	description: z.string(),
	lang: z.string().default('es'),
	status: z.enum(['draft', 'published']).default('published'),
	pubDate: z.coerce.date(),
	updatedDate: z.coerce.date().optional(),
	author: z.string().optional(),
	category: z.string().optional(),
	tags: z.array(z.string()).default([]),
	episode: z.number().optional(),
	duration: z.number().optional(),
	thumbnailUrl: z.string().url().optional(),
	thumbnailAlt: z.string().optional(),
	audioUrl: z.string().url().optional(),
	videoUrl: z.string().url().optional(),
	spotifyUrl: z.string().url().optional(),
	youtubeUrl: z.string().url().optional(),
	transcriptUrl: z.string().url().optional(),
	canonicalUrl: z.string().url().optional(),
	ogTitle: z.string().optional(),
	ogDescription: z.string().optional(),
	ogImageUrl: z.string().url().optional(),
	featured: z.boolean().default(false),
	faqs: z
		.array(
			z.object({
				question: z.string(),
				answer: z.string(),
			})
		)
		.optional(),
});

const podcasts = defineCollection({
	loader: glob({ base: './src/content/podcasts', pattern: '**/*.{md,mdx}' }),
	schema: editorialMediaBase.extend({
		showNotes: z.string().optional(),
	}),
});

const audioEpisodes = defineCollection({
	loader: glob({ base: './src/content/audio', pattern: '**/*.{md,mdx}' }),
	schema: editorialMediaBase.extend({
		audioType: z.enum(['podcast-extra', 'lecture', 'reflection', 'music', 'archive']).default('reflection'),
	}),
});

const videos = defineCollection({
	loader: glob({ base: './src/content/videos', pattern: '**/*.{md,mdx}' }),
	schema: editorialMediaBase.extend({
		videoType: z.enum(['class', 'lecture', 'short', 'interview', 'archive']).default('lecture'),
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

export const collections = {
	blog,
	essays,
	authors,
	categories,
	tags,
	mediaNotes,
	podcasts,
	audioEpisodes,
	videos,
	puckPages,
};
