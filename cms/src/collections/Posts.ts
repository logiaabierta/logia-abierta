import type { CollectionConfig } from 'payload'

import {
  canCreateEditorialContent,
  canEditAuthoredContent,
  canManageContent,
  canManageEditorialContent,
  canReadDraftableContent,
  hasRole,
  selectedAuthorId,
  userOwnsAuthor,
} from '../access/accessControl'
import { contentModeOptions, languageOptions, statusOptions } from '../config/editorialOptions'
import { postRichTextEditor } from '../editor/postRichTextEditor'
import { faqFields } from '../fields/faqFields'
import { seoFields } from '../fields/seoFields'

export const Posts: CollectionConfig = {
  slug: 'posts',
  access: {
    create: canCreateEditorialContent,
    delete: canManageEditorialContent,
    read: canReadDraftableContent,
    update: canEditAuthoredContent,
  },
  admin: {
    defaultColumns: ['title', 'language', 'status', 'publishedAt'],
    group: 'Content',
    useAsTitle: 'title',
  },
  hooks: {
    beforeValidate: [
      async ({ data, operation, req }) => {
        if (!data || !req.user?.id || !['create', 'update'].includes(operation)) {
          return data
        }

        const user = await req.payload.findByID({
          id: req.user.id,
          collection: 'users',
          depth: 0,
        })
        const authorProfiles = Array.isArray(user.authorProfiles) ? user.authorProfiles : []
        const firstAuthor = authorProfiles[0]
        const incomingAuthorId = selectedAuthorId(data)

        if (!canManageContent(req.user) && incomingAuthorId && !userOwnsAuthor(user, incomingAuthorId)) {
          throw new Error('You can only publish with an assigned author profile.')
        }

        if (hasRole(req.user, ['contributor']) && data.status === 'published') {
          data.status = 'draft'
        }

        if (operation === 'create' && !data.author && firstAuthor) {
          return {
            ...data,
            author: typeof firstAuthor === 'object' ? firstAuthor.id : firstAuthor,
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
