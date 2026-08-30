import type { Block } from 'payload'

export const QuoteBlock: Block = {
  slug: 'quote',
  interfaceName: 'QuoteBlock',
  labels: {
    singular: 'Quote',
    plural: 'Quotes',
  },
  fields: [
    {
      name: 'quote',
      type: 'textarea',
      required: true,
    },
    {
      name: 'attribution',
      type: 'text',
    },
    {
      name: 'tone',
      type: 'select',
      defaultValue: 'editorial',
      options: [
        { label: 'Editorial', value: 'editorial' },
        { label: 'Historical', value: 'historical' },
        { label: 'Ceremonial', value: 'ceremonial' },
      ],
    },
  ],
}
