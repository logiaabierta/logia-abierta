import type { CollectionConfig } from 'payload'

const languageOptions = [
  { label: 'Spanish', value: 'es' },
  { label: 'English', value: 'en' },
  { label: 'French', value: 'fr' },
  { label: 'Italian', value: 'it' },
  { label: 'Portuguese', value: 'pt' },
]

const countryOptions = [
  { label: 'Republica Dominicana', value: 'republica-dominicana' },
  { label: 'Estados Unidos', value: 'estados-unidos' },
  { label: 'Puerto Rico', value: 'puerto-rico' },
  { label: 'Mexico', value: 'mexico' },
  { label: 'Colombia', value: 'colombia' },
  { label: 'Venezuela', value: 'venezuela' },
  { label: 'Espana', value: 'espana' },
  { label: 'Francia', value: 'francia' },
  { label: 'Italia', value: 'italia' },
  { label: 'Portugal', value: 'portugal' },
  { label: 'Brasil', value: 'brasil' },
  { label: 'Argentina', value: 'argentina' },
  { label: 'Chile', value: 'chile' },
  { label: 'Peru', value: 'peru' },
]

const cityOptions = [
  { label: 'Santo Domingo', value: 'santo-domingo' },
  { label: 'Santiago de los Caballeros', value: 'santiago-de-los-caballeros' },
  { label: 'San Juan', value: 'san-juan' },
  { label: 'Miami', value: 'miami' },
  { label: 'New York', value: 'new-york' },
  { label: 'Ciudad de Mexico', value: 'ciudad-de-mexico' },
  { label: 'Bogota', value: 'bogota' },
  { label: 'Caracas', value: 'caracas' },
  { label: 'Madrid', value: 'madrid' },
  { label: 'Barcelona', value: 'barcelona' },
  { label: 'Paris', value: 'paris' },
  { label: 'Rome', value: 'rome' },
  { label: 'Lisbon', value: 'lisbon' },
  { label: 'Sao Paulo', value: 'sao-paulo' },
  { label: 'Buenos Aires', value: 'buenos-aires' },
  { label: 'Santiago de Chile', value: 'santiago-de-chile' },
  { label: 'Lima', value: 'lima' },
]

const riteOptions = [
  { label: 'RAPM - Memphis', value: 'rapm' },
  { label: 'RAPMM - Memphis-Misraim', value: 'rapmm' },
  { label: 'RN - Regimen de Napoles / Misraim', value: 'rn' },
  { label: 'RER - Regimen Escoces Rectificado', value: 'rer' },
  { label: 'REAA - Rito Escoces Antiguo y Aceptado', value: 'reaa' },
  { label: 'HRAJ - Holy Royal Arch of Jerusalem', value: 'hraj' },
]

const bodyOptions = [
  { label: 'SN - Escudero Novicio', value: 'sn' },
  { label: 'MESA - Maestro Escoces de San Andres', value: 'mesa' },
  { label: 'CBCS - Caballero Bienhechor de la Ciudad Santa', value: 'cbcs' },
  { label: 'HRAJ - Holy Royal Arch of Jerusalem', value: 'hraj' },
  { label: 'SGCHRAJ - Supremo Gran Capitulo HRAJ', value: 'sgchraj' },
  { label: 'SC33 - Supremo Consejo Grado 33', value: 'sc33' },
  { label: 'PRRER - Priorato del RER', value: 'prrer' },
  { label: 'SSAPMM - Soberano Santuario Antiguos y Primitivos Ritos de Memphis y Misraim', value: 'ssapmm' },
]

const honorOptions = [{ label: 'PM - Past Master', value: 'pm' }]

const uniqueOptions = (options: typeof bodyOptions) =>
  options.filter((option, index, list) => list.findIndex((item) => item.value === option.value) === index)

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
      admin: {
        description: 'Idiomas en los que este autor puede publicar o revisar.',
      },
    },
    {
      name: 'country',
      type: 'select',
      options: countryOptions,
    },
    {
      name: 'cityName',
      type: 'select',
      options: cityOptions,
    },
    {
      name: 'otherLocation',
      type: 'text',
      admin: {
        description: 'Usar solo si el pais o ciudad no aparece en las listas controladas.',
      },
    },
    {
      name: 'showMasonicProfile',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'primaryRites',
      type: 'select',
      hasMany: true,
      options: riteOptions,
    },
    {
      name: 'craftBodies',
      type: 'select',
      hasMany: true,
      options: riteOptions,
    },
    {
      name: 'philosophicalBodies',
      type: 'select',
      hasMany: true,
      options: uniqueOptions([...riteOptions, ...bodyOptions]),
    },
    {
      name: 'appendantBodies',
      type: 'select',
      hasMany: true,
      options: bodyOptions,
    },
    {
      name: 'honors',
      type: 'select',
      hasMany: true,
      options: honorOptions,
    },
    {
      name: 'bodies',
      type: 'select',
      hasMany: true,
      options: uniqueOptions([...riteOptions, ...bodyOptions, ...honorOptions]),
      admin: {
        description: 'Legacy combined badges. Prefer the separated rite/body fields above.',
      },
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
      name: 'personalWebsite',
      type: 'text',
    },
    {
      name: 'publicEmail',
      type: 'email',
    },
    {
      name: 'contacts',
      type: 'array',
      fields: [
        {
          name: 'network',
          type: 'text',
          required: true,
        },
        {
          name: 'url',
          type: 'text',
          required: true,
        },
        {
          name: 'icon',
          type: 'text',
        },
      ],
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
