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

type Components = {
  Hero: HeroProps
  RichText: RichTextProps
  FeatureGrid: FeatureGridProps
  VideoFeature: VideoFeatureProps
  AudioFeature: AudioFeatureProps
  CTA: CTAProps
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
      components: ['Hero', 'RichText', 'FeatureGrid', 'CTA'],
    },
    media: {
      title: 'Media',
      components: ['VideoFeature', 'AudioFeature'],
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
  },
}
