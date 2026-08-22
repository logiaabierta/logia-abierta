'use client'

import type { Config } from '@puckeditor/core'
import React from 'react'

type HeroProps = {
  eyebrow?: string
  title: string
  summary?: string
  image?: string
  imageAlt?: string
  align?: 'left' | 'center'
  primaryLabel?: string
  primaryHref?: string
  secondaryLabel?: string
  secondaryHref?: string
}

type RichTextProps = {
  eyebrow?: string
  title?: string
  body?: string
  width?: 'narrow' | 'wide'
}

type FeatureGridProps = {
  eyebrow?: string
  title?: string
  items?: Array<{ label?: string; title: string; text?: string }>
}

type StatBandProps = {
  eyebrow?: string
  title?: string
  stats?: Array<{ value: string; label: string }>
}

type QuoteProps = {
  quote: string
  cite?: string
}

type TimelineProps = {
  eyebrow?: string
  title?: string
  events?: Array<{ year?: string; title: string; text?: string }>
}

type FAQProps = {
  eyebrow?: string
  title?: string
  items?: Array<{ question: string; answer: string }>
}

type MermaidProps = {
  eyebrow?: string
  title?: string
  code: string
}

type LinkListProps = {
  eyebrow?: string
  title?: string
  links?: Array<{ label: string; href: string; description?: string }>
}

type VideoFeatureProps = {
  eyebrow?: string
  title?: string
  summary?: string
  embedUrl?: string
  transcriptHref?: string
  poster?: string
  posterAlt?: string
}

type AudioFeatureProps = {
  eyebrow?: string
  title?: string
  summary?: string
  audioUrl?: string
  transcriptHref?: string
  platformLabel?: string
  platformHref?: string
}

type CTAProps = {
  eyebrow?: string
  title?: string
  text?: string
  label?: string
  href?: string
}

type NewsletterProps = {
  eyebrow?: string
  title?: string
  text?: string
  emailPlaceholder?: string
  buttonLabel?: string
}

type Components = {
  Hero: HeroProps
  RichText: RichTextProps
  FeatureGrid: FeatureGridProps
  StatBand: StatBandProps
  Quote: QuoteProps
  Timeline: TimelineProps
  FAQ: FAQProps
  Mermaid: MermaidProps
  LinkList: LinkListProps
  VideoFeature: VideoFeatureProps
  AudioFeature: AudioFeatureProps
  CTA: CTAProps
  Newsletter: NewsletterProps
}

function Actions({
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
}: Pick<HeroProps, 'primaryLabel' | 'primaryHref' | 'secondaryLabel' | 'secondaryHref'>) {
  if (!primaryLabel && !secondaryLabel) return null

  return (
    <div className="builder-actions">
      {primaryLabel && primaryHref ? (
        <span className="builder-button builder-button-primary">{primaryLabel}</span>
      ) : null}
      {secondaryLabel && secondaryHref ? (
        <span className="builder-button builder-button-secondary">{secondaryLabel}</span>
      ) : null}
    </div>
  )
}

export const puckConfig: Config<Components> = {
  root: {
    fields: {
      pageLayout: {
        type: 'select',
        label: 'Page layout',
        options: [
          { label: 'Full', value: 'full' },
          { label: 'Article', value: 'article' },
          { label: 'Media', value: 'media' },
        ],
      },
    },
  },
  categories: {
    editorial: {
      title: 'Editorial',
      components: ['Hero', 'RichText', 'FeatureGrid', 'Quote', 'Timeline', 'FAQ', 'CTA'],
    },
    media: {
      title: 'Media',
      components: ['VideoFeature', 'AudioFeature'],
    },
    growth: {
      title: 'Growth',
      components: ['StatBand', 'LinkList', 'Newsletter', 'Mermaid'],
    },
  },
  components: {
    Hero: {
      label: 'Hero',
      fields: {
        eyebrow: { type: 'text', label: 'Eyebrow' },
        title: { type: 'text', label: 'Title' },
        summary: { type: 'textarea', label: 'Summary' },
        image: { type: 'text', label: 'Image URL' },
        imageAlt: { type: 'text', label: 'Image alt' },
        align: {
          type: 'select',
          label: 'Alignment',
          options: [
            { label: 'Left', value: 'left' },
            { label: 'Center', value: 'center' },
          ],
        },
        primaryLabel: { type: 'text', label: 'Primary label' },
        primaryHref: { type: 'text', label: 'Primary URL' },
        secondaryLabel: { type: 'text', label: 'Secondary label' },
        secondaryHref: { type: 'text', label: 'Secondary URL' },
      },
      defaultProps: {
        eyebrow: 'Logia Abierta',
        title: 'Nuevo titulo',
        summary: 'Resumen breve de la pagina.',
        align: 'left',
      },
      render: (props) => (
        <section className={`builder-hero builder-hero-${props.align || 'left'}`}>
          <div>
            {props.eyebrow ? <p className="builder-eyebrow">{props.eyebrow}</p> : null}
            <h1>{props.title}</h1>
            {props.summary ? <p className="builder-summary">{props.summary}</p> : null}
            <Actions {...props} />
          </div>
          {props.image ? <img src={props.image} alt={props.imageAlt || ''} /> : null}
        </section>
      ),
    },
    RichText: {
      label: 'Text section',
      fields: {
        eyebrow: { type: 'text', label: 'Eyebrow' },
        title: { type: 'text', label: 'Title' },
        body: { type: 'textarea', label: 'Body' },
        width: {
          type: 'select',
          label: 'Width',
          options: [
            { label: 'Narrow', value: 'narrow' },
            { label: 'Wide', value: 'wide' },
          ],
        },
      },
      defaultProps: {
        title: 'Nueva seccion',
        body: 'Escribe aqui el contenido.\n\nPuedes usar parrafos separados por lineas.',
        width: 'narrow',
      },
      render: ({ eyebrow, title, body, width }) => (
        <section className={`builder-section builder-rich builder-width-${width || 'narrow'}`}>
          {eyebrow ? <p className="builder-eyebrow">{eyebrow}</p> : null}
          {title ? <h2>{title}</h2> : null}
          {(body || '').split('\n').filter(Boolean).map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </section>
      ),
    },
    FeatureGrid: {
      label: 'Feature grid',
      fields: {
        eyebrow: { type: 'text', label: 'Eyebrow' },
        title: { type: 'text', label: 'Title' },
        items: {
          type: 'array',
          label: 'Items',
          min: 1,
          arrayFields: {
            label: { type: 'text', label: 'Label' },
            title: { type: 'text', label: 'Title' },
            text: { type: 'textarea', label: 'Text' },
          },
          defaultItemProps: {
            label: 'Tema',
            title: 'Nueva tarjeta',
            text: 'Descripcion breve.',
          },
          getItemSummary: (item) => item.title || 'Tarjeta',
        },
      },
      defaultProps: {
        eyebrow: 'Secciones',
        title: 'Grid editorial',
        items: [
          { label: 'Texto', title: 'Ensayos', text: 'Lectura larga y SEO.' },
          { label: 'Video', title: 'Ponencias', text: 'Video con transcripcion.' },
        ],
      },
      render: ({ eyebrow, title, items = [] }) => (
        <section className="builder-section">
          {eyebrow ? <p className="builder-eyebrow">{eyebrow}</p> : null}
          {title ? <h2>{title}</h2> : null}
          <div className="builder-grid">
            {items.map((item, index) => (
              <article className="builder-card" key={index}>
                {item.label ? <p className="builder-card-label">{item.label}</p> : null}
                <h3>{item.title}</h3>
                {item.text ? <p>{item.text}</p> : null}
              </article>
            ))}
          </div>
        </section>
      ),
    },
    StatBand: {
      label: 'Stats band',
      fields: {
        eyebrow: { type: 'text', label: 'Eyebrow' },
        title: { type: 'text', label: 'Title' },
        stats: {
          type: 'array',
          label: 'Stats',
          min: 1,
          arrayFields: {
            value: { type: 'text', label: 'Value' },
            label: { type: 'text', label: 'Label' },
          },
          defaultItemProps: {
            value: '33',
            label: 'Grados, simbolos o hitos',
          },
          getItemSummary: (item) => item.label || item.value || 'Stat',
        },
      },
      defaultProps: {
        eyebrow: 'Archivo vivo',
        title: 'Una biblioteca para crecer con el proyecto',
        stats: [
          { value: '5', label: 'Idiomas preparados' },
          { value: '3', label: 'Formatos editoriales' },
          { value: 'SEO', label: 'Estructura indexable' },
        ],
      },
      render: ({ eyebrow, title, stats = [] }) => (
        <section className="builder-section builder-stat-band">
          <div>
            {eyebrow ? <p className="builder-eyebrow">{eyebrow}</p> : null}
            {title ? <h2>{title}</h2> : null}
          </div>
          <div className="builder-stats">
            {stats.map((stat, index) => (
              <div className="builder-stat" key={index}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        </section>
      ),
    },
    Quote: {
      label: 'Quote',
      fields: {
        quote: { type: 'textarea', label: 'Quote' },
        cite: { type: 'text', label: 'Citation' },
      },
      defaultProps: {
        quote: 'La tradicion se estudia mejor cuando la forma ayuda al pensamiento.',
        cite: 'Logia Abierta',
      },
      render: ({ quote, cite }) => (
        <section className="builder-section builder-quote">
          <blockquote>{quote}</blockquote>
          {cite ? <cite>{cite}</cite> : null}
        </section>
      ),
    },
    Timeline: {
      label: 'Timeline',
      fields: {
        eyebrow: { type: 'text', label: 'Eyebrow' },
        title: { type: 'text', label: 'Title' },
        events: {
          type: 'array',
          label: 'Events',
          min: 1,
          arrayFields: {
            year: { type: 'text', label: 'Date / year' },
            title: { type: 'text', label: 'Title' },
            text: { type: 'textarea', label: 'Text' },
          },
          defaultItemProps: {
            year: '2026',
            title: 'Nuevo hito',
            text: 'Descripcion breve del evento.',
          },
          getItemSummary: (item) => item.title || item.year || 'Event',
        },
      },
      defaultProps: {
        eyebrow: 'Linea de tiempo',
        title: 'Contexto historico',
        events: [
          { year: '1723', title: 'Constituciones', text: 'Un punto de partida documental.' },
          { year: 'Hoy', title: 'Lectura contemporanea', text: 'Releer con metodo, contexto y criterio.' },
        ],
      },
      render: ({ eyebrow, title, events = [] }) => (
        <section className="builder-section builder-timeline">
          {eyebrow ? <p className="builder-eyebrow">{eyebrow}</p> : null}
          {title ? <h2>{title}</h2> : null}
          <div>
            {events.map((event, index) => (
              <article key={index}>
                {event.year ? <span>{event.year}</span> : null}
                <h3>{event.title}</h3>
                {event.text ? <p>{event.text}</p> : null}
              </article>
            ))}
          </div>
        </section>
      ),
    },
    FAQ: {
      label: 'FAQ schema block',
      fields: {
        eyebrow: { type: 'text', label: 'Eyebrow' },
        title: { type: 'text', label: 'Title' },
        items: {
          type: 'array',
          label: 'Questions',
          min: 1,
          arrayFields: {
            question: { type: 'text', label: 'Question' },
            answer: { type: 'textarea', label: 'Answer' },
          },
          defaultItemProps: {
            question: 'Pregunta frecuente',
            answer: 'Respuesta breve, clara y lista para SEO.',
          },
          getItemSummary: (item) => item.question || 'FAQ',
        },
      },
      defaultProps: {
        eyebrow: 'FAQ',
        title: 'Preguntas frecuentes',
        items: [
          {
            question: 'Que es Logia Abierta?',
            answer: 'Un proyecto editorial para estudiar masoneria, simbolismo e historia con rigor.',
          },
        ],
      },
      render: ({ eyebrow, title, items = [] }) => (
        <section className="builder-section builder-faq">
          {eyebrow ? <p className="builder-eyebrow">{eyebrow}</p> : null}
          {title ? <h2>{title}</h2> : null}
          <div>
            {items.map((item, index) => (
              <details key={index} open={index === 0}>
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </section>
      ),
    },
    Mermaid: {
      label: 'Mermaid diagram',
      fields: {
        eyebrow: { type: 'text', label: 'Eyebrow' },
        title: { type: 'text', label: 'Title' },
        code: { type: 'textarea', label: 'Mermaid code' },
      },
      defaultProps: {
        eyebrow: 'Diagrama',
        title: 'Linea simbolica',
        code: 'graph TD\\n  A[Aprendiz] --> B[Companero]\\n  B --> C[Maestro]',
      },
      render: ({ eyebrow, title, code }) => (
        <section className="builder-section builder-code-block">
          {eyebrow ? <p className="builder-eyebrow">{eyebrow}</p> : null}
          {title ? <h2>{title}</h2> : null}
          <pre>
            <code>{code}</code>
          </pre>
        </section>
      ),
    },
    LinkList: {
      label: 'Link list',
      fields: {
        eyebrow: { type: 'text', label: 'Eyebrow' },
        title: { type: 'text', label: 'Title' },
        links: {
          type: 'array',
          label: 'Links',
          min: 1,
          arrayFields: {
            label: { type: 'text', label: 'Label' },
            href: { type: 'text', label: 'URL' },
            description: { type: 'textarea', label: 'Description' },
          },
          defaultItemProps: {
            label: 'Recurso',
            href: 'https://logiaabierta.com',
            description: 'Descripcion breve.',
          },
          getItemSummary: (item) => item.label || item.href || 'Link',
        },
      },
      defaultProps: {
        eyebrow: 'Recursos',
        title: 'Enlaces importantes',
        links: [
          { label: 'Website', href: 'https://logiaabierta.com', description: 'Pagina principal.' },
          { label: 'RSS', href: '/rss.xml', description: 'Feed para lectores y agregadores.' },
        ],
      },
      render: ({ eyebrow, title, links = [] }) => (
        <section className="builder-section builder-link-list">
          {eyebrow ? <p className="builder-eyebrow">{eyebrow}</p> : null}
          {title ? <h2>{title}</h2> : null}
          <div>
            {links.map((link, index) => (
              <article key={index}>
                <h3>{link.label}</h3>
                {link.description ? <p>{link.description}</p> : null}
                <span>{link.href}</span>
              </article>
            ))}
          </div>
        </section>
      ),
    },
    VideoFeature: {
      label: 'Video feature',
      fields: {
        eyebrow: { type: 'text', label: 'Eyebrow' },
        title: { type: 'text', label: 'Title' },
        summary: { type: 'textarea', label: 'Summary' },
        embedUrl: { type: 'text', label: 'Embed URL' },
        transcriptHref: { type: 'text', label: 'Transcript URL' },
        poster: { type: 'text', label: 'Poster URL' },
        posterAlt: { type: 'text', label: 'Poster alt' },
      },
      defaultProps: {
        eyebrow: 'Video',
        title: 'Titulo del video',
        summary: 'Contexto editorial del video.',
        embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      },
      render: ({ eyebrow, title, summary, embedUrl, poster, posterAlt }) => (
        <section className="builder-section builder-media">
          <div>
            {eyebrow ? <p className="builder-eyebrow">{eyebrow}</p> : null}
            {title ? <h2>{title}</h2> : null}
            {summary ? <p>{summary}</p> : null}
          </div>
          <div className="builder-video">
            {embedUrl ? <iframe src={embedUrl} title={title || 'Video'} /> : poster ? <img src={poster} alt={posterAlt || ''} /> : null}
          </div>
        </section>
      ),
    },
    AudioFeature: {
      label: 'Audio feature',
      fields: {
        eyebrow: { type: 'text', label: 'Eyebrow' },
        title: { type: 'text', label: 'Title' },
        summary: { type: 'textarea', label: 'Summary' },
        audioUrl: { type: 'text', label: 'Audio URL' },
        transcriptHref: { type: 'text', label: 'Transcript URL' },
        platformLabel: { type: 'text', label: 'Platform label' },
        platformHref: { type: 'text', label: 'Platform URL' },
      },
      defaultProps: {
        eyebrow: 'Audio',
        title: 'Titulo del episodio',
        summary: 'Resumen del episodio.',
        platformLabel: 'Escuchar',
      },
      render: ({ eyebrow, title, summary, audioUrl, platformLabel }) => (
        <section className="builder-section builder-audio">
          {eyebrow ? <p className="builder-eyebrow">{eyebrow}</p> : null}
          {title ? <h2>{title}</h2> : null}
          {summary ? <p>{summary}</p> : null}
          {audioUrl ? <audio controls src={audioUrl} /> : <span className="builder-button builder-button-secondary">{platformLabel || 'Escuchar'}</span>}
        </section>
      ),
    },
    CTA: {
      label: 'Call to action',
      fields: {
        eyebrow: { type: 'text', label: 'Eyebrow' },
        title: { type: 'text', label: 'Title' },
        text: { type: 'textarea', label: 'Text' },
        label: { type: 'text', label: 'Button label' },
        href: { type: 'text', label: 'Button URL' },
      },
      defaultProps: {
        title: 'Llamado a la accion',
        text: 'Texto breve para orientar al lector.',
        label: 'Abrir',
        href: '/',
      },
      render: ({ eyebrow, title, text, label }) => (
        <section className="builder-section builder-cta">
          {eyebrow ? <p className="builder-eyebrow">{eyebrow}</p> : null}
          {title ? <h2>{title}</h2> : null}
          {text ? <p>{text}</p> : null}
          {label ? <span className="builder-button builder-button-primary">{label}</span> : null}
        </section>
      ),
    },
    Newsletter: {
      label: 'Newsletter / subscribe',
      fields: {
        eyebrow: { type: 'text', label: 'Eyebrow' },
        title: { type: 'text', label: 'Title' },
        text: { type: 'textarea', label: 'Text' },
        emailPlaceholder: { type: 'text', label: 'Email placeholder' },
        buttonLabel: { type: 'text', label: 'Button label' },
      },
      defaultProps: {
        eyebrow: 'Comunidad',
        title: 'Recibe las nuevas publicaciones',
        text: 'Ensayos, podcast, videos y recursos curados.',
        emailPlaceholder: 'hola@ejemplo.com',
        buttonLabel: 'Suscribirme',
      },
      render: ({ eyebrow, title, text, emailPlaceholder, buttonLabel }) => (
        <section className="builder-section builder-newsletter">
          <div>
            {eyebrow ? <p className="builder-eyebrow">{eyebrow}</p> : null}
            {title ? <h2>{title}</h2> : null}
            {text ? <p>{text}</p> : null}
          </div>
          <form>
            <input placeholder={emailPlaceholder || 'correo@email.com'} />
            <button type="button">{buttonLabel || 'Suscribirme'}</button>
          </form>
        </section>
      ),
    },
  },
}
