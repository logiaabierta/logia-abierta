import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {documentInternationalization} from '@sanity/document-internationalization'
import {internationalizedArray} from 'sanity-plugin-internationalized-array'
import {structure} from './structure'
import {table} from '@sanity/table'

export default defineConfig({
  name: 'default',
  title: 'Logia Abierta',

  projectId: 'x7y01k44',
  dataset: 'production',

  plugins: [
    table(),
    visionTool(),
    structureTool({
      structure,
    }),
    documentInternationalization({
      supportedLanguages: [
        {id: 'es', title: 'Español'},
        {id: 'en', title: 'English'},
        {id: 'fr', title: 'Français'},
        {id: 'it', title: 'Italiano'},
        {id: 'pt', title: 'Português'},
      ],
      schemaTypes: ['post', 'podcast'],
      languageField: `language`,
      weakReferences: true,
      bulkPublish: true,
      hideLanguageFilter: true,
    }),
    internationalizedArray({
      languages: [
        {id: 'es', title: 'Español'},
        {id: 'en', title: 'English'},
        {id: 'fr', title: 'Français'},
        {id: 'it', title: 'Italiano'},
        {id: 'pt', title: 'Português'},
      ],
      defaultLanguages: ['es'],
      fieldTypes: ['string', 'text'],
    }),
  ],

  schema: {
    types: schemaTypes,
  },
})
