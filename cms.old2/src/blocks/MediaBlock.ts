import type { Block } from 'payload'

export const MediaBlock: Block = {
  slug: 'mediaFeature',
  interfaceName: 'MediaFeatureBlock',
  labels: {
    singular: 'Media',
    plural: 'Media sections',
  },
  fields: [
    {
      name: 'media',
      type: 'relationship',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'caption',
      type: 'text',
    },
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'wide',
      options: [
        { label: 'Wide', value: 'wide' },
        { label: 'Inset', value: 'inset' },
        { label: 'Full bleed', value: 'fullBleed' },
      ],
    },
  ],
}
