import type { LogiaPage } from './types'

export const templates: Record<string, LogiaPage> = {
  home: {
    title: 'Logia Abierta',
    description:
      'Biblioteca editorial masonica con ensayos, podcast, video y trazados para estudiar la tradicion con calma.',
    lang: 'es',
    slug: 'home',
    template: 'landing',
    status: 'published',
    seo: {
      title: 'Logia Abierta',
      description: 'Ensayos, podcast, video y trazados masonicos para estudiar la tradicion con calma.',
    },
    puck: {
      root: {
        props: {
          pageLayout: 'full',
        },
      },
      content: [
        {
          type: 'Hero',
          props: {
            eyebrow: 'Biblioteca viva',
            title: 'Logia Abierta',
            summary:
              'Ensayos, conversaciones y recursos para pensar la masoneria con rigor, belleza y libertad interior.',
            primaryLabel: 'Leer articulos',
            primaryHref: '/es/blog',
            secondaryLabel: 'Ver links',
            secondaryHref: '/es/links',
          },
        },
        {
          type: 'FeatureGrid',
          props: {
            eyebrow: 'Formatos',
            title: 'Tres formas de estudiar',
            items: [
              {
                label: 'Texto',
                title: 'Ensayos y trazados',
                text: 'Articulos largos, guias y piezas preparadas para SEO, lectura lenta y archivo.',
              },
              {
                label: 'Video',
                title: 'Ponencias y clases',
                text: 'Paginas con video, transcripcion, notas y recursos complementarios.',
              },
              {
                label: 'Audio',
                title: 'Podcast y reflexiones',
                text: 'Episodios con show notes, enlaces y contexto editorial reutilizable.',
              },
            ],
          },
        },
      ],
    },
  },
  text: {
    title: 'Plantilla de articulo textual',
    description: 'Pagina Puck estatica para ensayos, trazados y articulos largos.',
    lang: 'es',
    slug: 'plantillas/texto',
    template: 'text',
    status: 'published',
    seo: {
      title: 'Plantilla texto',
      description: 'Demo de pagina estatica para contenido textual de Logia Abierta.',
    },
    puck: {
      root: { props: { template: 'text' } },
      content: [
        {
          type: 'Hero',
          props: {
            eyebrow: 'Template texto',
            title: 'Ensayo, trazado o guia editorial',
            summary: 'Esta plantilla sirve para paginas largas con introduccion, cuerpo editorial, CTA y FAQ.',
          },
        },
        {
          type: 'RichText',
          props: {
            eyebrow: 'Cuerpo',
            title: 'Una estructura pensada para lectura lenta',
            body:
              'El contenido textual queda como HTML estatico generado por Astro.\n\nEste formato es ideal para articulos evergreen, paginas de doctrina, glosarios y recursos SEO.',
          },
        },
      ],
    },
  },
  video: {
    title: 'Plantilla de video',
    description: 'Pagina Puck estatica para videos, ponencias y clases con transcripcion.',
    lang: 'es',
    slug: 'plantillas/video',
    template: 'video',
    status: 'published',
    seo: {
      title: 'Plantilla video',
      description: 'Demo de pagina estatica para videos y clases de Logia Abierta.',
    },
    puck: {
      root: { props: { template: 'video' } },
      content: [
        {
          type: 'Hero',
          props: {
            eyebrow: 'Template video',
            title: 'Ponencia o clase en video',
            summary: 'Una pagina con video, resumen, transcripcion y recursos indexables.',
          },
        },
        {
          type: 'VideoFeature',
          props: {
            eyebrow: 'Video principal',
            title: 'Tema de la ponencia',
            summary: 'Aqui va el contexto editorial del video.',
            embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            transcriptHref: '#transcripcion',
          },
        },
      ],
    },
  },
  audio: {
    title: 'Plantilla de audio',
    description: 'Pagina Puck estatica para podcasts, audios y reflexiones con show notes.',
    lang: 'es',
    slug: 'plantillas/audio',
    template: 'audio',
    status: 'published',
    seo: {
      title: 'Plantilla audio',
      description: 'Demo de pagina estatica para podcast y contenido de audio de Logia Abierta.',
    },
    puck: {
      root: { props: { template: 'audio' } },
      content: [
        {
          type: 'Hero',
          props: {
            eyebrow: 'Template audio',
            title: 'Episodio de podcast o audio',
            summary: 'Un formato para publicar audio con contexto, notas, links y transcripcion.',
          },
        },
        {
          type: 'AudioFeature',
          props: {
            eyebrow: 'Audio principal',
            title: 'Titulo del episodio',
            summary: 'Aqui va la descripcion editorial del episodio y sus temas principales.',
            audioUrl: '',
            platformLabel: 'Escuchar en Spotify',
            platformHref: 'https://open.spotify.com/',
          },
        },
      ],
    },
  },
}

export function pageId(page: Pick<LogiaPage, 'lang' | 'slug'>) {
  return `${page.lang}/${page.slug === 'home' ? 'home' : page.slug}`
}
