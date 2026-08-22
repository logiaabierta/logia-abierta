import type { CollectionConfig } from 'payload'

import { contentModeOptions, languageOptions, statusOptions } from '../config/editorialOptions'
import { postRichTextEditor } from '../editor/postRichTextEditor'
import { faqFields } from '../fields/faqFields'
import { seoFields } from '../fields/seoFields'

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    defaultColumns: ['title', 'language', 'status', 'publishedAt'],
    group: 'Content',
    useAsTitle: 'title',
  },
  hooks: {
    beforeValidate: [
      async ({ data, operation, req }) => {
        if (!data || data.author || !req.user?.id || operation !== 'create') {
          return data
        }

        const linkedAuthor = await req.payload.find({
          collection: 'authors',
          depth: 0,
          limit: 1,
          overrideAccess: true,
          where: {
            linkedUser: {
              equals: req.user.id,
            },
          },
        })

        if (linkedAuthor.docs[0]) {
          return {
            ...data,
            author: linkedAuthor.docs[0].id,
          }
        }

        return data
      },
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'language',
      type: 'select',
      defaultValue: 'es',
      options: languageOptions,
      required: true,
    },
    {
      name: 'translationGroup',
      type: 'text',
      admin: {
        description: 'Shared key for translated versions of the same article.',
      },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      options: statusOptions,
      required: true,
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'authors',
      required: true,
    },
    {
      name: 'categories',
      type: 'array',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'tags',
      type: 'array',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'heroImage',
      type: 'relationship',
      relationTo: 'media',
    },
    {
      name: 'thumbnail',
      type: 'relationship',
      relationTo: 'media',
    },
    {
      name: 'excerpt',
      type: 'textarea',
      maxLength: 160,
      admin: {
        description: 'Recommended meta description length: 150-160 characters.',
      },
    },
    {
      name: 'contentMode',
      type: 'select',
      defaultValue: 'visual',
      options: contentModeOptions,
      required: true,
      admin: {
        description: 'Choose how this article is authored and rendered by Astro.',
      },
    },
    {
      name: 'body',
      type: 'richText',
      editor: postRichTextEditor,
      admin: {
        condition: (_, siblingData) => siblingData?.contentMode !== 'mdx',
        description:
          'WYSIWYG editor with one-click editorial blocks: Mermaid, Impress.js, media, CTA, FAQ, timeline and more.',
      },
    },
    {
      name: 'mdxSource',
      type: 'textarea',
      admin: {
        condition: (_, siblingData) => siblingData?.contentMode !== 'visual',
        description:
          'Advanced MDX/Astro-compatible source. Use this for custom components or hand-authored MDX.',
        rows: 24,
      },
    },
    {
      name: 'faq',
      type: 'array',
      fields: faqFields,
    },
    {
      name: 'seo',
      type: 'group',
      fields: seoFields,
    },
  ],
}
