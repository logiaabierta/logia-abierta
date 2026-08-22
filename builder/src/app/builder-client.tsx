'use client'

import type { Data } from '@puckeditor/core'
import dynamic from 'next/dynamic'
import { Download, ExternalLink, FileJson, Monitor, Save } from 'lucide-react'
import { Component, type ReactNode, useEffect, useMemo, useState } from 'react'

import { puckConfig } from '../lib/puck-config'
import type { LogiaPage, PageSummary } from '../lib/types'

type SaveState = 'idle' | 'saving' | 'saved' | 'download' | 'error'

const Puck = dynamic(() => import('@puckeditor/core').then((mod) => mod.Puck), {
  ssr: false,
  loading: () => <main className="builder-loading">Cargando canvas...</main>,
})

class CanvasErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; message: string }> {
  state = { hasError: false, message: '' }

  static getDerivedStateFromError(error: unknown) {
    return {
      hasError: true,
      message: error instanceof Error ? error.message : 'El canvas visual no pudo cargar.',
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="builder-canvas-error">
          <p className="builder-eyebrow">Canvas</p>
          <h2>El editor visual no pudo cargar</h2>
          <p>{this.state.message}</p>
          <p>La sesion sigue viva. Recarga la pagina o vuelve al selector de paginas.</p>
        </div>
      )
    }

    return this.props.children
  }
}

function downloadJson(page: LogiaPage) {
  const blob = new Blob([`${JSON.stringify(page, null, 2)}\n`], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = `${page.slug.split('/').pop() || 'page'}.json`
  anchor.click()
  URL.revokeObjectURL(url)
}

function ensurePuckIds(page: LogiaPage): LogiaPage {
  return {
    ...page,
    puck: {
      ...page.puck,
      content: page.puck.content.map((block, index) => ({
        ...block,
        props: {
          ...block.props,
          id: typeof block.props.id === 'string' ? block.props.id : `${block.type.toLowerCase()}-${index + 1}`,
        },
      })),
    },
  }
}

export default function BuilderClient() {
  const [pages, setPages] = useState<PageSummary[]>([])
  const [selectedId, setSelectedId] = useState('home')
  const [page, setPage] = useState<LogiaPage | null>(null)
  const [saveState, setSaveState] = useState<SaveState>('idle')
  const [message, setMessage] = useState('')
  const [viewportReady, setViewportReady] = useState(false)
  const [supportsEditorViewport, setSupportsEditorViewport] = useState(false)

  useEffect(() => {
    fetch('/api/pages')
      .then((response) => response.json())
      .then((data) => setPages(data.pages || []))
  }, [])

  useEffect(() => {
    const updateViewport = () => {
      const canUseCanvas = window.matchMedia('(min-width: 1024px) and (pointer: fine)').matches
      setSupportsEditorViewport(canUseCanvas)
      setViewportReady(true)
    }

    updateViewport()
    window.addEventListener('resize', updateViewport)

    return () => window.removeEventListener('resize', updateViewport)
  }, [])

  useEffect(() => {
    fetch(`/api/pages?id=${selectedId}`)
      .then((response) => response.json())
      .then((data) => {
        setPage(ensurePuckIds(data.page))
        setSaveState('idle')
        setMessage('')
      })
  }, [selectedId])

  const data = useMemo(
    () => (page?.puck || { root: { props: {} }, content: [] }) as Data,
    [page],
  )

  async function publish(puckData: Data) {
    if (!page) return

    const nextPage = ensurePuckIds({
      ...page,
      puck: puckData as LogiaPage['puck'],
    })

    setPage(nextPage)
    setSaveState('saving')
    setMessage('')

    try {
      const response = await fetch('/api/pages', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ id: selectedId, page: nextPage }),
      })
      const result = await response.json()

      if (!response.ok) throw new Error(result.error || 'Save failed')

      if (result.saved) {
        setSaveState('saved')
        setMessage(`Guardado en GitHub: ${result.path}`)
      } else {
        setSaveState('download')
        setMessage(result.message || 'GitHub no esta configurado. Descarga el JSON.')
        downloadJson(nextPage)
      }
    } catch (error) {
      setSaveState('error')
      setMessage(error instanceof Error ? error.message : 'No se pudo guardar.')
    }
  }

  if (!page || !viewportReady) {
    return <main className="builder-loading">Cargando builder...</main>
  }

  if (!supportsEditorViewport) {
    return (
      <main className="builder-mobile-shell">
        <section className="builder-mobile-panel">
          <span className="builder-mobile-icon">
            <Monitor size={28} />
          </span>
          <p className="builder-eyebrow">Logia Abierta Builder</p>
          <h1>Usa el editor visual en desktop</h1>
          <p>
            El canvas de Puck esta optimizado para una pantalla grande, mouse o trackpad. En movil evitamos cargarlo
            para que Chrome Android no rompa la sesion.
          </p>
          <div className="builder-mobile-actions">
            <a href="https://logiaabierta.com" target="_blank">
              <ExternalLink size={16} />
              Ver website
            </a>
            <button type="button" onClick={() => downloadJson(page)}>
              <Download size={16} />
              Exportar pagina
            </button>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="builder-shell">
      <aside className="builder-sidebar">
        <div>
          <p className="builder-eyebrow">Logia Abierta</p>
          <h1>Builder</h1>
          <p>Paginas visuales SSG guardadas como JSON para Astro.</p>
        </div>

        <label>
          Pagina
          <select value={selectedId} onChange={(event) => setSelectedId(event.target.value)}>
            {pages.map((item) => (
              <option value={item.id} key={item.id}>
                {item.title}
              </option>
            ))}
          </select>
        </label>

        <div className="builder-meta">
          <label>
            Titulo
            <input value={page.title} onChange={(event) => setPage({ ...page, title: event.target.value })} />
          </label>
          <label>
            Slug
            <input value={page.slug} onChange={(event) => setPage({ ...page, slug: event.target.value })} />
          </label>
          <label>
            Meta description
            <textarea
              maxLength={160}
              value={page.description}
              onChange={(event) => setPage({ ...page, description: event.target.value })}
            />
          </label>
          <label>
            Template
            <select
              value={page.template}
              onChange={(event) => setPage({ ...page, template: event.target.value as LogiaPage['template'] })}
            >
              <option value="landing">Landing</option>
              <option value="text">Texto</option>
              <option value="video">Video</option>
              <option value="audio">Audio</option>
              <option value="links">Links</option>
            </select>
          </label>
        </div>

        <div className="builder-sidebar-actions">
          <button type="button" onClick={() => downloadJson(page)}>
            <Download size={16} />
            Exportar JSON
          </button>
          <a href={`https://logiaabierta.com/es/${page.slug === 'home' ? '' : page.slug}`} target="_blank">
            <ExternalLink size={16} />
            Ver publico
          </a>
        </div>

        {message ? <p className={`builder-status builder-status-${saveState}`}>{message}</p> : null}
      </aside>

      <section className="builder-editor">
        <div className="builder-topbar">
          <span>
            <FileJson size={16} />
            {page.lang}/{page.slug}
          </span>
          <span>
            <Save size={16} />
            {saveState === 'saving' ? 'Guardando...' : 'Publish guarda JSON'}
          </span>
        </div>
        <CanvasErrorBoundary>
          <Puck
            config={puckConfig}
            data={data}
            dnd={{ disableAutoScroll: true, behavior: 'static' }}
            iframe={{ enabled: false }}
            onPublish={publish}
          />
        </CanvasErrorBoundary>
      </section>
    </main>
  )
}
