import type { Block } from 'payload'

import { faqFields } from '../fields/faqFields'

export const FAQBlock: Block = {
  slug: 'faqSection',
  interfaceName: 'FAQSectionBlock',
  labels: {
    singular: 'FAQ',
    plural: 'FAQ sections',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'Preguntas frecuentes',
    },
    {
      name: 'items',
      type: 'array',
      fields: faqFields,
      minRows: 1,
    },
  ],
}
