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
        {
          type: 'StatBand',
          props: {
            eyebrow: 'Preparado para crecer',
            title: 'Contenido estatico, rapido y listo para SEO',
            stats: [
              { value: '5', label: 'Idiomas base' },
              { value: '3', label: 'Formatos editoriales' },
              { value: 'FAQ', label: 'Bloques para respuestas generativas' },
            ],
          },
        },
        {
          type: 'Newsletter',
          props: {
            eyebrow: 'Comunidad',
            title: 'Recibe nuevas publicaciones',
            text: 'Ensayos, podcast, videos y recursos para estudiar la tradicion con calma.',
            emailPlaceholder: 'tu@email.com',
            buttonLabel: 'Suscribirme',
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
        {
          type: 'Quote',
          props: {
            quote: 'Una pagina editorial debe poder respirarse: titulo claro, argumento fuerte y salida natural hacia el siguiente paso.',
            cite: 'Guia editorial Logia Abierta',
          },
        },
        {
          type: 'FAQ',
          props: {
            eyebrow: 'SEO',
            title: 'Preguntas que esta pagina responde',
            items: [
              {
                question: 'Para que sirve esta plantilla?',
                answer: 'Para publicar paginas largas, guias y piezas evergreen con estructura clara para lectores y buscadores.',
              },
              {
                question: 'Puede incluir FAQ schema?',
                answer: 'Si. El bloque FAQ deja las preguntas organizadas para que Astro pueda generar datos estructurados.',
              },
            ],
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
        {
          type: 'RichText',
          props: {
            eyebrow: 'Transcripcion',
            title: 'Notas de la ponencia',
            body:
              'Incluye aqui el resumen, puntos clave y transcripcion parcial o completa.\n\nEsto convierte el video en una pagina indexable y util para Google, lectores y modelos de respuesta.',
          },
        },
        {
          type: 'CTA',
          props: {
            eyebrow: 'Siguiente paso',
            title: 'Explora mas trazados relacionados',
            text: 'Conecta esta ponencia con lecturas, recursos y episodios relacionados.',
            label: 'Ver biblioteca',
            href: '/es/blog',
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
        {
          type: 'Timeline',
          props: {
            eyebrow: 'Show notes',
            title: 'Estructura del episodio',
            events: [
              { year: '00:00', title: 'Introduccion', text: 'Contexto y tesis central.' },
              { year: '12:00', title: 'Tema principal', text: 'Desarrollo del argumento.' },
              { year: 'Final', title: 'Recursos', text: 'Lecturas y enlaces recomendados.' },
            ],
          },
        },
        {
          type: 'LinkList',
          props: {
            eyebrow: 'Recursos',
            title: 'Links del episodio',
            links: [
              { label: 'Spotify', href: 'https://open.spotify.com/', description: 'Escuchar o seguir el podcast.' },
              { label: 'RSS', href: '/rss.xml', description: 'Agregar el feed a tu lector.' },
            ],
          },
        },
      ],
    },
  },
}

export function pageId(page: Pick<LogiaPage, 'lang' | 'slug'>) {
  return `${page.lang}/${page.slug === 'home' ? 'home' : page.slug}`
}
