import type { CollectionConfig } from 'payload'

import { editorialBlocks } from '../blocks'
import { contentModeOptions, languageOptions, statusOptions } from '../config/editorialOptions'
import { postRichTextEditor } from '../editor/postRichTextEditor'
import { faqFields } from '../fields/faqFields'
import { seoFields } from '../fields/seoFields'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    defaultColumns: ['title', 'slug', 'language', 'status', 'updatedAt'],
    useAsTitle: 'title',
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
      admin: {
        description: 'Use "home" for the homepage. Astro can map it to /.',
      },
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
        description: 'Shared key for translated versions of the same page.',
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
      name: 'template',
      type: 'select',
      defaultValue: 'standard',
      options: [
        { label: 'Standard', value: 'standard' },
        { label: 'Home', value: 'home' },
        { label: 'Landing SEO', value: 'landing' },
        { label: 'Links', value: 'links' },
        { label: 'FAQ hub', value: 'faqHub' },
      ],
      required: true,
    },
    {
      name: 'hero',
      type: 'group',
      fields: [
        {
          name: 'eyebrow',
          type: 'text',
        },
        {
          name: 'heading',
          type: 'text',
        },
        {
          name: 'summary',
          type: 'textarea',
          maxLength: 220,
        },
        {
          name: 'image',
          type: 'relationship',
          relationTo: 'media',
        },
      ],
    },
    {
      name: 'contentMode',
      type: 'select',
      defaultValue: 'visual',
      options: contentModeOptions,
      required: true,
      admin: {
        description: 'Use visual blocks, raw MDX, or both.',
      },
    },
    {
      name: 'sections',
      type: 'blocks',
      blocks: editorialBlocks,
      admin: {
        condition: (_, siblingData) => siblingData?.contentMode !== 'mdx',
        description: 'Page-builder sections rendered by Astro.',
      },
    },
    {
      name: 'body',
      type: 'richText',
      editor: postRichTextEditor,
      admin: {
        condition: (_, siblingData) => siblingData?.contentMode !== 'mdx',
        description: 'Optional long-form page content after the section blocks.',
      },
    },
    {
      name: 'mdxSource',
      type: 'textarea',
      admin: {
        condition: (_, siblingData) => siblingData?.contentMode !== 'visual',
        description: 'Advanced MDX/Astro-compatible page source.',
        rows: 26,
      },
    },
    {
      name: 'faq',
      type: 'array',
      fields: faqFields,
      admin: {
        description: 'Structured FAQ data for rich results and AI answer surfaces.',
      },
    },
    {
      name: 'seo',
      type: 'group',
      fields: seoFields,
    },
  ],
}
