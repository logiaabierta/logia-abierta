import {
  BlocksFeature,
  FixedToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { ImpressDeckBlock } from '../blocks/ImpressDeckBlock'
import { MermaidBlock } from '../blocks/MermaidBlock'

export const postRichTextEditor = lexicalEditor({
  features: ({ defaultFeatures }) => [
    ...defaultFeatures,
    FixedToolbarFeature(),
    BlocksFeature({
      blocks: [MermaidBlock, ImpressDeckBlock],
    }),
  ],
})
