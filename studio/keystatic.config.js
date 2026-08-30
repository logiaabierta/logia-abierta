import { collection, config, fields } from '@keystatic/core';

const languageOptions = [
  { label: 'Español', value: 'es' },
  { label: 'English', value: 'en' },
  { label: 'Français', value: 'fr' },
  { label: 'Italiano', value: 'it' },
  { label: 'Português', value: 'pt' },
];

const statusOptions = [
  { label: 'Borrador', value: 'draft' },
  { label: 'Publicado', value: 'published' },
];

const riteOptions = [
  { label: 'PM - Past Master', value: 'PM' },
  { label: 'RAPM - Rito Antiguo y Primitivo de Memphis', value: 'RAPM' },
  { label: 'RAPMM - Rito Antiguo y Primitivo de Memphis-Misraim', value: 'RAPMM' },
  { label: 'RN - Régimen de Nápoles / Misraim', value: 'RN' },
  { label: 'RER - Régimen Escocés Rectificado', value: 'RER' },
  { label: 'SN - Escudero Novicio', value: 'SN' },
  { label: 'MESA - Maestro Escocés de San Andrés', value: 'MESA' },
  { label: 'CBCS - Caballero Bienhechor de la Ciudad Santa', value: 'CBCS' },
  { label: 'HRAJ - Holy Royal Arch of Jerusalem', value: 'HRAJ' },
  { label: 'REAA - Rito Escocés Antiguo y Aceptado', value: 'REAA' },
  { label: 'SC33 - Supremo Consejo del Grado 33', value: 'SC33' },
  { label: 'PRER - Priorato del RER', value: 'PRER' },
  { label: 'SGC-HRAJ - Supremo Gran Capítulo del HRAJ', value: 'SGC-HRAJ' },
  { label: 'SSAPMM - Soberano Santuario de los Antiguos y Primitivos Ritos de Memphis y Misraim', value: 'SSAPMM' },
];

const storage =
  process.env.NODE_ENV === 'production' ||
  process.env.NEXT_PUBLIC_KEYSTATIC_STORAGE === 'github' ||
  process.env.KEYSTATIC_STORAGE === 'github'
    ? {
        kind: 'github',
        repo: 'logiaabierta/logia-abierta',
      }
    : { kind: 'local' };

export default config({
  storage,
  locale: 'es-ES',
  ui: {
    brand: { name: 'Logia Abierta Studio' },
    navigation: {
      Editorial: ['posts', 'essays', 'authors', 'categories', 'tags'],
      Operaciones: ['mediaNotes'],
    },
  },
  collections: {
    categories: collection({
      label: 'Categorías',
      path: 'src/content/categories/*',
      slugField: 'title',
      format: 'json',
      columns: ['title', 'lang'],
      schema: {
        title: fields.slug({
          name: { label: 'Nombre', validation: { isRequired: true, length: { min: 2, max: 80 } } },
          slug: { label: 'Slug' },
        }),
        lang: fields.select({ label: 'Idioma', options: languageOptions, defaultValue: 'es' }),
        description: fields.text({ label: 'Descripción SEO', validation: { length: { max: 160 } }, multiline: true }),
      },
    }),
    tags: collection({
      label: 'Tags',
      path: 'src/content/tags/*',
      slugField: 'title',
      format: 'json',
      columns: ['title', 'lang'],
      schema: {
        title: fields.slug({
          name: { label: 'Nombre', validation: { isRequired: true, length: { min: 2, max: 60 } } },
          slug: { label: 'Slug' },
        }),
        lang: fields.select({ label: 'Idioma', options: languageOptions, defaultValue: 'es' }),
        description: fields.text({ label: 'Descripción', validation: { length: { max: 160 } }, multiline: true }),
      },
    }),
    posts: collection({
      label: 'Artículos',
      path: 'src/content/blog/*',
      slugField: 'title',
      entryLayout: 'content',
      format: { contentField: 'content' },
      columns: ['title', 'lang', 'status', 'pubDate'],
      previewUrl: 'https://logiaabierta.com/{lang}/blog/{slug}',
      schema: {
        title: fields.slug({
          name: { label: 'Título', validation: { isRequired: true, length: { min: 3, max: 120 } } },
          slug: { label: 'Slug SEO', description: 'URL corta, legible y sin fecha.' },
        }),
        lang: fields.select({ label: 'Idioma', options: languageOptions, defaultValue: 'es' }),
        status: fields.select({ label: 'Estado', options: statusOptions, defaultValue: 'draft' }),
        description: fields.text({
          label: 'Meta description',
          description: 'Ideal: 140-160 caracteres.',
          validation: { isRequired: true, length: { min: 10, max: 250 } },
          multiline: true,
        }),
        excerpt: fields.text({
          label: 'Resumen editorial',
          validation: { length: { max: 240 } },
          multiline: true,
        }),
        pubDate: fields.date({ label: 'Fecha de publicación' }),
        updatedDate: fields.date({ label: 'Fecha de actualización' }),
        author: fields.relationship({ label: 'Autor', collection: 'authors' }),
        category: fields.relationship({ label: 'Categoría', collection: 'categories' }),
        tags: fields.multiRelationship({ label: 'Tags', collection: 'tags' }),
        readingMinutes: fields.integer({ label: 'Duración estimada en minutos' }),
        featured: fields.checkbox({ label: 'Featured' }),
        heroImageUrl: fields.url({ label: 'Imagen principal en R2' }),
        heroImageAlt: fields.text({ label: 'Alt text imagen principal', validation: { length: { max: 160 } } }),
        thumbnailUrl: fields.url({ label: 'Thumbnail en R2' }),
        thumbnailAlt: fields.text({ label: 'Alt text thumbnail', validation: { length: { max: 160 } } }),
        canonicalUrl: fields.url({ label: 'Canonical URL' }),
        ogTitle: fields.text({ label: 'Open Graph / Twitter title', validation: { length: { max: 60 } } }),
        ogDescription: fields.text({ label: 'Open Graph / Twitter description', validation: { length: { max: 160 } }, multiline: true }),
        ogImageUrl: fields.url({ label: 'Open Graph image R2' }),
        faqs: fields.array(
          fields.object({
            question: fields.text({ label: 'Pregunta', validation: { isRequired: true, length: { max: 140 } } }),
            answer: fields.text({ label: 'Respuesta', validation: { isRequired: true, length: { max: 500 } }, multiline: true }),
          }),
          { label: 'FAQs para schema SEO', itemLabel: (props) => props.value.question || 'FAQ' },
        ),
        content: fields.markdoc({
          label: 'Contenido Markdown',
          description: 'Markdown editorial compatible con Astro.',
          extension: 'md',
        }),
      },
    }),
    essays: collection({
      label: 'Ensayos / MDX',
      path: 'src/content/essays/*',
      slugField: 'title',
      entryLayout: 'content',
      format: { contentField: 'content' },
      columns: ['title', 'lang', 'pubDate'],
      previewUrl: 'https://logiaabierta.com/{lang}/ensayos/{slug}',
      schema: {
        title: fields.slug({
          name: { label: 'Título', validation: { isRequired: true, length: { min: 3, max: 120 } } },
          slug: { label: 'Slug' },
        }),
        description: fields.text({ label: 'Descripción SEO', validation: { isRequired: true, length: { min: 10, max: 250 } }, multiline: true }),
        lang: fields.select({ label: 'Idioma', options: languageOptions, defaultValue: 'es' }),
        pubDate: fields.date({ label: 'Fecha de publicación' }),
        updatedDate: fields.date({ label: 'Fecha de actualización' }),
        author: fields.relationship({ label: 'Autor', collection: 'authors' }),
        tags: fields.multiRelationship({ label: 'Tags', collection: 'tags' }),
        featured: fields.checkbox({ label: 'Featured' }),
        heroImageUrl: fields.url({ label: 'Imagen en R2' }),
        heroImageAlt: fields.text({ label: 'Alt text', validation: { length: { max: 160 } } }),
        content: fields.mdx({
          label: 'Contenido MDX',
          description: 'MDX con soporte para componentes (Mermaid, Impress.js, etc.).',
          extension: 'mdx',
        }),
      },
    }),
    authors: collection({
      label: 'Autores',
      path: 'src/content/authors/*',
      slugField: 'publicName',
      format: 'json',
      columns: ['publicName', 'displayMode', 'country'],
      schema: {
        publicName: fields.slug({
          name: { label: 'Nombre público / pseudónimo', validation: { isRequired: true, length: { min: 2, max: 80 } } },
          slug: { label: 'Slug del autor' },
        }),
        displayMode: fields.select({
          label: 'Cómo publicar',
          options: [
            { label: 'Pseudónimo solamente', value: 'pseudonym' },
            { label: 'Nombre real', value: 'real' },
            { label: 'Nombre real + pseudónimo', value: 'both' },
          ],
          defaultValue: 'pseudonym',
        }),
        internalIdentity: fields.text({ label: 'Identidad interna', validation: { length: { max: 120 } } }),
        realName: fields.text({ label: 'Nombre real', validation: { length: { max: 120 } } }),
        archetype: fields.select({
          label: 'Arquetipo interno',
          options: [
            { label: 'Zorobabel - Príncipe de Jerusalén', value: 'zorobabel-principe' },
            { label: 'Ageo - Profeta', value: 'ageo-profeta' },
            { label: 'Josué - Sumo Sacerdote', value: 'josue-sumo-sacerdote' },
            { label: 'Otro', value: 'otro' },
          ],
          defaultValue: 'otro',
        }),
        bio: fields.text({ label: 'Bio breve', multiline: true, validation: { length: { max: 500 } } }),
        languages: fields.multiselect({ label: 'Idiomas', options: languageOptions, defaultValue: ['es'] }),
        rites: fields.multiselect({ label: 'Ritos, cuerpos y distinciones', options: riteOptions, defaultValue: [] }),
        country: fields.select({
          label: 'País',
          options: [
            { label: 'República Dominicana', value: 'DO' },
            { label: 'Puerto Rico', value: 'PR' },
            { label: 'Estados Unidos', value: 'US' },
            { label: 'España', value: 'ES' },
            { label: 'México', value: 'MX' },
            { label: 'Colombia', value: 'CO' },
            { label: 'Argentina', value: 'AR' },
            { label: 'Chile', value: 'CL' },
            { label: 'Otro', value: 'OTHER' },
          ],
          defaultValue: 'DO',
        }),
        city: fields.text({ label: 'Ciudad', validation: { length: { max: 80 } } }),
        avatarUrl: fields.url({ label: 'Foto / avatar en R2' }),
        website: fields.url({ label: 'Página personal' }),
        instagram: fields.url({ label: 'Instagram' }),
        linkedin: fields.url({ label: 'LinkedIn' }),
        substack: fields.url({ label: 'Substack' }),
      },
    }),
    mediaNotes: collection({
      label: 'Notas de media R2',
      path: 'src/content/media-notes/*',
      slugField: 'title',
      format: 'json',
      columns: ['title', 'kind', 'publishedAt'],
      schema: {
        title: fields.slug({
          name: { label: 'Título', validation: { isRequired: true } },
          slug: { label: 'Slug' },
        }),
        kind: fields.select({
          label: 'Tipo',
          options: [
            { label: 'Imagen', value: 'image' },
            { label: 'Audio', value: 'audio' },
            { label: 'Video', value: 'video' },
            { label: 'Documento', value: 'document' },
            { label: 'Adjunto', value: 'attachment' },
          ],
          defaultValue: 'image',
        }),
        r2Url: fields.url({ label: 'URL pública en R2', validation: { isRequired: true } }),
        altText: fields.text({ label: 'Alt text / descripción accesible', multiline: true }),
        credit: fields.text({ label: 'Crédito' }),
        publishedAt: fields.date({ label: 'Fecha' }),
      },
    }),
  },
});
