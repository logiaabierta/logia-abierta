import type { Block } from 'payload'

export const YouTubeBlock: Block = {
  slug: 'youtubeEmbed',
  interfaceName: 'YouTubeEmbedBlock',
  labels: {
    singular: 'YouTube',
    plural: 'YouTube embeds',
  },
  fields: [
    {
      name: 'url',
      type: 'text',
      required: true,
      admin: {
        description: 'Paste a YouTube video or playlist URL.',
      },
    },
    {
      name: 'title',
      type: 'text',
    },
    {
      name: 'caption',
      type: 'text',
    },
  ],
}
