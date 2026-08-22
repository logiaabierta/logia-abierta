import {
  BlocksFeature,
  FixedToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { editorialBlocks } from '../blocks'

export const postRichTextEditor = lexicalEditor({
  features: ({ defaultFeatures }) => [
    ...defaultFeatures,
    FixedToolbarFeature(),
    BlocksFeature({
      blocks: editorialBlocks,
    }),
  ],
})
