import path from 'node:path'
import { fileURLToPath } from 'node:url'

import dotenv from 'dotenv'
import { getPayload } from 'payload'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const cmsDir = path.resolve(dirname, '..')

dotenv.config({ path: path.resolve(cmsDir, '.env') })

const { default: config } = await import('../payload.config')
const payload = await getPayload({ config })

const sanityProjectId = 'x7y01k44'
const sanityDataset = 'production'
const sanityApiVersion = '2024-01-01'

const pages = [
  {
    title: 'Inicio',
    slug: 'home',
    language: 'es',
    status: 'published',
    template: 'home',
    hero: {
      eyebrow: 'Logia Abierta',
      heading: 'Historia, simbolismo y cultura masonica',
      summary: 'Pagina principal editable para la presencia editorial de Logia Abierta.',
    },
    contentMode: 'visual',
    sections: [
      {
        blockType: 'hero',
        eyebrow: 'Logia Abierta',
        heading: 'Una biblioteca viva para pensar la tradicion',
        summary: 'Ensayos, podcasts, recursos y presentaciones para estudiar con calma.',
      },
    ],
    seo: {
      metaTitle: 'Logia Abierta',
      metaDescription: 'Ensayos, podcasts y recursos sobre historia, simbolismo y cultura masonica.',
    },
  },
  {
    title: 'Links',
    slug: 'links',
    language: 'es',
    status: 'published',
    template: 'links',
    hero: {
      eyebrow: 'Perfiles oficiales',
      heading: 'Links de Logia Abierta',
      summary: 'Redes, podcast, videos, suscripciones y recursos principales.',
    },
    contentMode: 'visual',
    sections: [],
    seo: {
      metaTitle: 'Links de Logia Abierta',
      metaDescription: 'Todos los enlaces oficiales de Logia Abierta en un solo lugar.',
    },
  },
  {
    title: 'Sobre Logia Abierta',
    slug: 'sobre-logia-abierta',
    language: 'es',
    status: 'draft',
    template: 'standard',
    hero: {
      eyebrow: 'Proyecto editorial',
      heading: 'Sobre Logia Abierta',
      summary: 'Una pagina base para presentar la vision, el alcance y la linea editorial del proyecto.',
    },
    contentMode: 'visual',
    sections: [
      {
        blockType: 'richTextSection',
        content: lexicalText(
          'Logia Abierta es un espacio editorial dedicado al estudio historico, simbolico y filosofico de la tradicion masonica.',
        ),
      },
    ],
    seo: {
      metaTitle: 'Sobre Logia Abierta',
      metaDescription: 'Conoce la vision editorial y el enfoque de Logia Abierta.',
    },
  },
  {
    title: 'Preguntas frecuentes',
    slug: 'preguntas-frecuentes',
    language: 'es',
    status: 'draft',
    template: 'faqHub',
    hero: {
      eyebrow: 'FAQ',
      heading: 'Preguntas frecuentes',
      summary: 'Respuestas breves para lectores, autores y buscadores.',
    },
    contentMode: 'visual',
    sections: [],
    faq: [
      {
        question: 'Que es Logia Abierta?',
        answer:
          'Es un proyecto editorial dedicado a publicar ensayos, recursos y conversaciones sobre historia, simbolismo y cultura masonica.',
      },
      {
        question: 'Puedo citar el contenido?',
        answer:
          'Si. El contenido publico se distribuye bajo una licencia Creative Commons BY-NC-SA 4.0 salvo que se indique lo contrario.',
      },
    ],
    seo: {
      metaTitle: 'Preguntas frecuentes de Logia Abierta',
      metaDescription: 'FAQ editorial de Logia Abierta para lectores, autores y buscadores.',
    },
  },
]

function lexicalText(text?: string) {
  if (!text) return undefined

  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      children: [
        {
          type: 'paragraph',
          direction: null,
          format: '',
          indent: 0,
          textFormat: 0,
          textStyle: '',
          version: 1,
          children: [
            {
              type: 'text',
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text,
              version: 1,
            },
          ],
        },
      ],
    },
  }
}

function slugValue(value?: string) {
  if (!value) return undefined

  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function normalizeCode(value?: string) {
  if (!value) return undefined

  const known: Record<string, string> = {
    'PR-RER': 'prrer',
    'SGC-HRAJ': 'sgchraj',
    SSAPRMM: 'ssapmm',
    SSMM: 'ssapmm',
  }

  return known[value] || value.toLowerCase()
}

function localizedValue(input: unknown, fallback = '') {
  if (typeof input === 'string') return input
  if (!Array.isArray(input)) return fallback

  const preferred =
    input.find((entry) => entry?.language === 'es') ||
    input.find((entry) => entry?.language === 'en') ||
    input[0]

  return preferred?.value || fallback
}

async function upsert(collection: 'authors' | 'pages', slug: string, data: Record<string, unknown>) {
  const existing = await payload.find({
    collection,
    depth: 0,
    limit: 1,
    overrideAccess: true,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  if (existing.docs[0]) {
    await payload.update({
      id: existing.docs[0].id,
      collection,
      data: data as never,
      overrideAccess: true,
    })
    return 'updated'
  }

  await payload.create({
    collection,
    data: data as never,
    overrideAccess: true,
  })
  return 'created'
}

async function fetchSanityAuthors() {
  const query = `*[_type == "author" && defined(slug.current)] | order(name asc){
    name,
    "slug": slug.current,
    activeLanguages,
    country,
    cityName,
    otherLocation,
    shortBio,
    descriptionLocalized,
    bioLocalized,
    primaryRites,
    craftBodies,
    philosophicalBodies,
    appendantBodies,
    honors,
    personalWebsite,
    publicEmail,
    contacts
  }`
  const params = new URLSearchParams({ query })
  const url = `https://${sanityProjectId}.api.sanity.io/v${sanityApiVersion}/data/query/${sanityDataset}?${params}`
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Sanity responded ${response.status}: ${await response.text()}`)
  }

  const payload = await response.json()
  return payload.result || []
}

try {
  for (const page of pages) {
    const result = await upsert('pages', page.slug, page)
    console.log(`${result} page ${page.slug}`)
  }

  const sanityAuthors = await fetchSanityAuthors()

  if (sanityAuthors.length === 0) {
    console.log('No Sanity authors found.')
  }

  for (const author of sanityAuthors) {
    const slug = author.slug || slugValue(author.name)

    if (!author.name || !slug) continue

    const data = {
      name: author.name,
      slug,
      languages: author.activeLanguages?.length ? author.activeLanguages : ['es'],
      country: slugValue(author.country),
      cityName: slugValue(author.cityName),
      otherLocation: author.otherLocation,
      shortBio:
        localizedValue(author.shortBio) ||
        localizedValue(author.descriptionLocalized) ||
        localizedValue(author.bioLocalized),
      bio: lexicalText(localizedValue(author.bioLocalized) || localizedValue(author.descriptionLocalized)),
      showMasonicProfile: true,
      primaryRites: (author.primaryRites || []).map(normalizeCode).filter(Boolean),
      craftBodies: (author.craftBodies || []).map(normalizeCode).filter(Boolean),
      philosophicalBodies: (author.philosophicalBodies || []).map(normalizeCode).filter(Boolean),
      appendantBodies: (author.appendantBodies || []).map(normalizeCode).filter(Boolean),
      honors: (author.honors || []).map(normalizeCode).filter(Boolean),
      personalWebsite: author.personalWebsite,
      publicEmail: author.publicEmail,
      contacts: (author.contacts || []).map((contact: { icon?: string; link?: string; network?: string }) => ({
        network: contact.network,
        url: contact.link,
        icon: contact.icon,
      })),
    }

    const result = await upsert('authors', slug, data)
    console.log(`${result} author ${slug}`)
  }
} finally {
  await payload.destroy()
}
