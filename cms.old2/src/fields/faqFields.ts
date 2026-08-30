import type { Field } from 'payload'

export const faqFields: Field[] = [
  {
    name: 'question',
    type: 'text',
    required: true,
  },
  {
    name: 'answer',
    type: 'textarea',
    required: true,
  },
]
