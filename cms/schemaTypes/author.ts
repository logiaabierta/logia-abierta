import {defineField, defineType} from 'sanity'

const languageOptions = [
  {title: 'ES', value: 'es'},
  {title: 'EN', value: 'en'},
  {title: 'FR', value: 'fr'},
  {title: 'IT', value: 'it'},
  {title: 'PT', value: 'pt'},
]

const countryOptions = [
  {title: 'República Dominicana', value: 'República Dominicana'},
  {title: 'Estados Unidos', value: 'Estados Unidos'},
  {title: 'Puerto Rico', value: 'Puerto Rico'},
  {title: 'México', value: 'México'},
  {title: 'Colombia', value: 'Colombia'},
  {title: 'Venezuela', value: 'Venezuela'},
  {title: 'España', value: 'España'},
  {title: 'Francia', value: 'Francia'},
  {title: 'Italia', value: 'Italia'},
  {title: 'Portugal', value: 'Portugal'},
  {title: 'Brasil', value: 'Brasil'},
  {title: 'Argentina', value: 'Argentina'},
  {title: 'Chile', value: 'Chile'},
  {title: 'Perú', value: 'Perú'},
]

const cityOptions = [
  {title: 'Santo Domingo', value: 'Santo Domingo'},
  {title: 'Santiago de los Caballeros', value: 'Santiago de los Caballeros'},
  {title: 'San Juan', value: 'San Juan'},
  {title: 'Miami', value: 'Miami'},
  {title: 'New York', value: 'New York'},
  {title: 'Ciudad de México', value: 'Ciudad de México'},
  {title: 'Bogotá', value: 'Bogotá'},
  {title: 'Caracas', value: 'Caracas'},
  {title: 'Madrid', value: 'Madrid'},
  {title: 'Barcelona', value: 'Barcelona'},
  {title: 'Paris', value: 'Paris'},
  {title: 'Rome', value: 'Rome'},
  {title: 'Lisbon', value: 'Lisbon'},
  {title: 'São Paulo', value: 'São Paulo'},
  {title: 'Buenos Aires', value: 'Buenos Aires'},
  {title: 'Santiago de Chile', value: 'Santiago de Chile'},
  {title: 'Lima', value: 'Lima'},
]

const riteOptions = [
  {title: 'RAPM - Rito Antiguo y Primitivo de Memphis', value: 'RAPM'},
  {title: 'RAPMM - Rito Antiguo y Primitivo de Memphis-Misraim', value: 'RAPMM'},
  {title: 'RN - Régimen de Nápoles / Misraim', value: 'RN'},
  {title: 'RER - Régimen Escocés Rectificado', value: 'RER'},
  {title: 'REAA - Rito Escocés Antiguo y Aceptado', value: 'REAA'},
  {title: 'HRAJ - Holy Royal Arch of Jerusalem', value: 'HRAJ'},
]

const bodyOptions = [
  {title: 'MESA - Maestro Escocés de San Andrés', value: 'MESA'},
  {title: 'SN - Escudero Novicio', value: 'SN'},
  {title: 'CBCS - Caballero Bienhechor de la Ciudad Santa', value: 'CBCS'},
  {title: 'SC33 - Supremo Consejo del Grado 33', value: 'SC33'},
  {title: 'PR-RER - Priorato del Régimen Escocés Rectificado', value: 'PR-RER'},
  {title: 'SGC-HRAJ - Supremo Gran Capítulo del Holy Royal Arch of Jerusalem', value: 'SGC-HRAJ'},
  {title: 'SSMM - Soberano Santuario de Memphis y Misraim', value: 'SSMM'},
  {
    title:
      'SSAPRMM - Soberano Santuario de los Antiguos y Primitivos Ritos de Memphis y Misraim',
    value: 'SSAPRMM',
  },
]

const honorOptions = [
  {title: 'PM - Past Master', value: 'PM'},
]

export default defineType({
  name: 'author',
  title: 'Author',
  type: 'document',
  groups: [
    {name: 'identity', title: 'Identidad', default: true},
    {name: 'localized', title: 'Idiomas'},
    {name: 'masonic', title: 'Perfil masónico'},
    {name: 'links', title: 'Links'},
    {name: 'legacy', title: 'Legacy'},
  ],
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      group: 'identity',
      validation: (Rule) => Rule.required().min(1).max(50),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'identity',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      group: 'identity',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'isDefaultAuthor',
      title: 'Default author',
      type: 'boolean',
      group: 'identity',
      initialValue: false,
      description: 'Use this author automatically when creating new posts.',
    }),
    defineField({
      name: 'activeLanguages',
      title: 'Idiomas activos',
      type: 'array',
      group: 'localized',
      of: [{type: 'string'}],
      options: {
        list: languageOptions,
        layout: 'tags',
      },
      initialValue: ['es'],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'jobLocalized',
      title: 'Cargo / oficio editorial',
      type: 'internationalizedArrayString',
      group: 'localized',
    }),
    defineField({
      name: 'country',
      title: 'País',
      type: 'string',
      group: 'identity',
      options: {
        list: countryOptions,
      },
    }),
    defineField({
      name: 'cityName',
      title: 'Ciudad',
      type: 'string',
      group: 'identity',
      options: {
        list: cityOptions,
      },
    }),
    defineField({
      name: 'otherLocation',
      title: 'Otra ubicación',
      type: 'string',
      group: 'identity',
      description: 'Usar solo si el país o ciudad no aparece en las listas controladas.',
    }),
    defineField({
      name: 'shortBio',
      title: 'Bio corta',
      type: 'internationalizedArrayText',
      group: 'localized',
      description: 'Resumen breve para tarjetas de autor. Ideal: menos de 280 caracteres por idioma.',
    }),
    defineField({
      name: 'descriptionLocalized',
      title: 'Descripción',
      type: 'internationalizedArrayText',
      group: 'localized',
      description: 'Descripción principal para SEO y páginas de autor.',
    }),
    defineField({
      name: 'bioLocalized',
      title: 'Bio larga',
      type: 'internationalizedArrayText',
      group: 'localized',
      description: 'Biografía pública larga por idioma.',
    }),
    defineField({
      name: 'showMasonicProfile',
      title: 'Mostrar perfil masónico públicamente',
      type: 'boolean',
      group: 'masonic',
      initialValue: true,
    }),
    defineField({
      name: 'primaryRites',
      title: 'Ritos / sistemas principales',
      type: 'array',
      group: 'masonic',
      of: [{type: 'string'}],
      options: {
        list: riteOptions,
        layout: 'grid',
      },
    }),
    defineField({
      name: 'craftBodies',
      title: 'Craft / masonería simbólica',
      type: 'array',
      group: 'masonic',
      of: [{type: 'string'}],
      options: {
        list: riteOptions,
        layout: 'grid',
      },
    }),
    defineField({
      name: 'philosophicalBodies',
      title: 'Cuerpos filosóficos',
      type: 'array',
      group: 'masonic',
      of: [{type: 'string'}],
      options: {
        list: [...riteOptions, ...bodyOptions],
        layout: 'grid',
      },
    }),
    defineField({
      name: 'appendantBodies',
      title: 'Appendant bodies / órdenes interiores',
      type: 'array',
      group: 'masonic',
      of: [{type: 'string'}],
      options: {
        list: bodyOptions,
        layout: 'grid',
      },
    }),
    defineField({
      name: 'honors',
      title: 'Distinciones / oficios',
      type: 'array',
      group: 'masonic',
      of: [{type: 'string'}],
      options: {
        list: honorOptions,
        layout: 'grid',
      },
    }),
    defineField({
      name: 'masonicNotes',
      title: 'Notas públicas del perfil masónico',
      type: 'internationalizedArrayText',
      group: 'masonic',
    }),
    defineField({
      name: 'personalWebsite',
      title: 'Página personal',
      type: 'url',
      group: 'links',
    }),
    defineField({
      name: 'publicEmail',
      title: 'Email público',
      type: 'email',
      group: 'links',
    }),
    defineField({
      name: 'contacts',
      title: 'Redes sociales',
      type: 'array',
      group: 'links',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'network',
              title: 'Network',
              type: 'string',
              validation: (Rule) => Rule.min(1).max(50),
            },
            {
              name: 'link',
              title: 'Link',
              type: 'url',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'icon',
              title: 'Icon',
              type: 'string',
              description: 'Opcional. Ejemplo: fa-brands fa-x-twitter',
            },
          ],
        },
      ],
    }),

    defineField({
      name: 'language',
      title: 'Legacy language',
      type: 'string',
      group: 'legacy',
      hidden: true,
    }),
    defineField({
      name: 'job',
      title: 'Legacy job',
      type: 'string',
      group: 'legacy',
      hidden: true,
    }),
    defineField({
      name: 'city',
      title: 'Legacy city',
      type: 'string',
      group: 'legacy',
      hidden: true,
    }),
    defineField({
      name: 'cityLocalized',
      title: 'Legacy localized city',
      type: 'internationalizedArrayString',
      group: 'legacy',
      hidden: true,
    }),
    defineField({
      name: 'description',
      title: 'Legacy description',
      type: 'text',
      group: 'legacy',
      hidden: true,
    }),
    defineField({
      name: 'bio',
      title: 'Legacy bio',
      type: 'array',
      group: 'legacy',
      hidden: true,
      of: [
        {
          title: 'Block',
          type: 'block',
          styles: [{title: 'Normal', value: 'normal'}],
          lists: [],
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'slug.current',
      media: 'image',
    },
  },
})
