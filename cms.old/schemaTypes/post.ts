import {defineField, defineType} from 'sanity'
import { isUniqueOtherThanLanguage } from '../lib/isUniqueOtherThanLanguage'

const languageOptions = [
  {title: 'Español', value: 'es'},
  {title: 'English', value: 'en'},
  {title: 'Français', value: 'fr'},
  {title: 'Italiano', value: 'it'},
  {title: 'Português', value: 'pt'},
]

export default defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  initialValue: async (_params, context) => {
    const client = context.getClient({apiVersion: '2025-02-19'})
    const author = await client.fetch(
      `*[_type == "author" && defined(slug.current)] | order(isDefaultAuthor desc, _createdAt asc)[0]{_id}`,
    )

    return {
      language: 'es',
      targetLanguages: ['es'],
      author: author?._id
        ? {
            _type: 'reference',
            _ref: author._id,
            _weak: true,
          }
        : undefined,
    }
  },
  groups: [
    {name: 'editorial', title: 'Editorial', default: true},
    {name: 'seo', title: 'SEO & Social'},
    {name: 'media', title: 'Media'},
    {name: 'content', title: 'Contenido'},
    {name: 'faq', title: 'FAQs'},
  ],
  fields: [
    defineField({
      name: 'language',
      title: 'Language',
      type: 'string',
      group: 'editorial',
      options: {
        list: languageOptions,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'targetLanguages',
      title: 'Idiomas planeados para traducción',
      type: 'array',
      group: 'editorial',
      of: [{type: 'string'}],
      options: {
        list: languageOptions,
        layout: 'tags',
      },
      description: 'Plan editorial: marca los idiomas en los que este artículo debe existir.',
    }),

    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'editorial',
      validation: (Rule) => Rule.required().min(1).max(110),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'editorial',
      options: {
        source: 'title',
        maxLength: 96,
        isUnique: isUniqueOtherThanLanguage
      },
    }),
   
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      group: 'editorial',
      description: 'Maximum 300 characters',
      validation: (Rule) => Rule.min(1).max(300),
    }),
    defineField({
      name: 'seoTitle',
      title: 'SEO title',
      type: 'string',
      group: 'seo',
      description: 'Recommended: concise and descriptive. Ideal max: 60 characters.',
      validation: (Rule) => Rule.max(60).warning('Google usually displays concise titles best. Aim for 60 characters or fewer.'),
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO meta description',
      type: 'text',
      group: 'seo',
      description: 'Recommended: 140-160 characters. Max: 160.',
      validation: (Rule) => Rule.max(160).warning('Aim for 160 characters or fewer for search snippets and social previews.'),
    }),
    defineField({
      name: 'ogTitle',
      title: 'Open Graph / social title',
      type: 'string',
      group: 'seo',
      description: 'Optional. Falls back to SEO title, then post title.',
      validation: (Rule) => Rule.max(70).warning('Social previews work best with compact titles.'),
    }),
    defineField({
      name: 'ogDescription',
      title: 'Open Graph / social description',
      type: 'text',
      group: 'seo',
      description: 'Optional. Falls back to SEO description, then post description.',
      validation: (Rule) => Rule.max(200).warning('Keep social descriptions short enough for cards.'),
    }),
    defineField({
      name: 'canonicalUrl',
      title: 'Canonical URL override',
      type: 'url',
      group: 'seo',
      description: 'Optional. Leave empty unless this article canonicalizes to another URL.',
    }),
    defineField({
      name: 'noindex',
      title: 'Noindex',
      type: 'boolean',
      group: 'seo',
      initialValue: false,
      description: 'Hide this page from search indexing.',
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      group: 'editorial',
      to: [{type: 'author'}],
      weak: true,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'duration',
      title: 'Duration',
      type: 'number',
      group: 'editorial',
      description: 'Optional override in minutes. If empty, the site estimates reading time from the article body.',
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: 'mainImage',
      title: 'Main image',
      type: 'image',
      group: 'media',
      fields: [
        {
          name: 'alt',
          title: 'Alternative text',
          type: 'string',
        },
        {
          name: 'caption',
          title: 'Caption',
          type: 'string',
        },
        {
          name: 'seoFilename',
          title: 'SEO filename hint',
          type: 'string',
          description: 'Optional note for editors. Rename files before uploading when possible.',
        },
      ],
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'socialImage',
      title: 'Social image',
      type: 'image',
      group: 'media',
      description: 'Optional 1200x630 image for Open Graph and Twitter cards. Falls back to main image or thumbnail.',
      fields: [
        {
          name: 'alt',
          title: 'Alternative text',
          type: 'string',
        },
        {
          name: 'seoFilename',
          title: 'SEO filename hint',
          type: 'string',
          description: 'Optional note for editors. Rename files before uploading when possible.',
        },
      ],
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'thumbnail',
      title: 'Thumbnail',
      type: 'image',
      group: 'media',
      fields: [
        {
          name: 'alt',
          title: 'Alternative text',
          type: 'string',
        },
        {
          name: 'caption',
          title: 'Caption',
          type: 'string',
        },
        {
          name: 'seoFilename',
          title: 'SEO filename hint',
          type: 'string',
          description: 'Optional note for editors. Rename files before uploading when possible.',
        },
      ],
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      group: 'editorial',
      of: [{type: 'reference', to: {type: 'category'}}],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
      group: 'editorial',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'blockContent',
      group: 'content',
    }),
    defineField({
      name: 'enableFaqSchema',
      title: 'Enable FAQ schema',
      type: 'boolean',
      group: 'faq',
      initialValue: true,
      description: 'Only enable when the FAQs are visible on the article page.',
    }),
    defineField({
      name: 'faqs',
      title: 'FAQs',
      type: 'array',
      group: 'faq',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'question',
              title: 'Question',
              type: 'string',
              validation: (Rule) => Rule.required().min(1).max(180),
            }),
            defineField({
              name: 'answer',
              title: 'Answer',
              type: 'text',
              validation: (Rule) => Rule.required().min(1).max(1200),
            }),
          ],
          preview: {
            select: {
              title: 'question',
              subtitle: 'answer',
            },
          },
        },
      ],
    }),
  ],

  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'thumbnail',
    },
    prepare(selection) {
      const {author} = selection
      return {...selection, subtitle: author && `by ${author}`}
    },
  },
})
