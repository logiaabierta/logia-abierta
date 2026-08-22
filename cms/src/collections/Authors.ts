import type { CollectionConfig } from 'payload'

const languageOptions = [
  { label: 'Spanish', value: 'es' },
  { label: 'English', value: 'en' },
  { label: 'French', value: 'fr' },
  { label: 'Italian', value: 'it' },
  { label: 'Portuguese', value: 'pt' },
]

const bodyOptions = [
  { label: 'PM - Past Master', value: 'pm' },
  { label: 'RAPM - Memphis', value: 'rapm' },
  { label: 'RAPMM - Memphis-Misraim', value: 'rapmm' },
  { label: 'RN - Regimen de Napoles / Misraim', value: 'rn' },
  { label: 'RER - Regimen Escoces Rectificado', value: 'rer' },
  { label: 'SN - Escudero Novicio', value: 'sn' },
  { label: 'MESA - Maestro Escoces de San Andres', value: 'mesa' },
  { label: 'CBCS - Caballero Bienhechor de la Ciudad Santa', value: 'cbcs' },
  { label: 'HRAJ - Holy Royal Arch of Jerusalem', value: 'hraj' },
  { label: 'SGCHRAJ - Supremo Gran Capitulo HRAJ', value: 'sgchraj' },
  { label: 'REAA - Rito Escoces Antiguo y Aceptado', value: 'reaa' },
  { label: 'SC33 - Supremo Consejo Grado 33', value: 'sc33' },
  { label: 'SSAPMM - Soberano Santuario Antiguos y Primitivos Ritos de Memphis y Misraim', value: 'ssapmm' },
]

export const Authors: CollectionConfig = {
  slug: 'authors',
  admin: {
    defaultColumns: ['name', 'slug', 'languages'],
    group: 'Editorial',
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Stable URL handle for this author.',
      },
    },
    {
      name: 'photo',
      type: 'relationship',
      relationTo: 'media',
    },
    {
      name: 'languages',
      type: 'select',
      hasMany: true,
      options: languageOptions,
    },
    {
      name: 'bodies',
      type: 'select',
      hasMany: true,
      options: bodyOptions,
    },
    {
      name: 'shortBio',
      type: 'textarea',
      maxLength: 280,
    },
    {
      name: 'bio',
      type: 'richText',
    },
    {
      name: 'links',
      type: 'array',
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'url',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
}
