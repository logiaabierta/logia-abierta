import type { Field } from 'payload'

export const seoFields: Field[] = [
  {
    name: 'title',
    type: 'text',
    maxLength: 60,
    admin: {
      description: 'Recommended max: 50-60 characters.',
    },
  },
  {
    name: 'description',
    type: 'textarea',
    maxLength: 160,
    admin: {
      description: 'Recommended max: 150-160 characters.',
    },
  },
  {
    name: 'canonicalUrl',
    type: 'text',
  },
  {
    name: 'ogImage',
    type: 'relationship',
    relationTo: 'media',
  },
  {
    name: 'noIndex',
    type: 'checkbox',
    defaultValue: false,
  },
]
