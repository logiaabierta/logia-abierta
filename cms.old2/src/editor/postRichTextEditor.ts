import {
  BlocksFeature,
  EXPERIMENTAL_TableFeature,
  FixedToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { editorialBlocks } from '../blocks'

export const postRichTextEditor = lexicalEditor({
  features: ({ defaultFeatures }) => [
    ...defaultFeatures,
    FixedToolbarFeature(),
    EXPERIMENTAL_TableFeature(),
    BlocksFeature({
      blocks: editorialBlocks,
    }),
  ],
})
