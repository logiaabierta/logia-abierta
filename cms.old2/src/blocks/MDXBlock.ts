import type { Block } from 'payload'

export const MDXBlock: Block = {
  slug: 'mdxSource',
  interfaceName: 'MDXSourceBlock',
  labels: {
    singular: 'MDX source',
    plural: 'MDX source blocks',
  },
  fields: [
    {
      name: 'label',
      type: 'text',
      defaultValue: 'Advanced MDX',
    },
    {
      name: 'source',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Advanced MDX/Astro-compatible source for custom rendering.',
        rows: 18,
      },
    },
  ],
}
