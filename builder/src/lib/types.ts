export type PageTemplate = 'landing' | 'text' | 'video' | 'audio' | 'links'
export type PageStatus = 'draft' | 'published'

export type LogiaPage = {
  title: string
  description: string
  lang: string
  slug: string
  template: PageTemplate
  status: PageStatus
  seo: {
    title?: string
    description?: string
    image?: string
    canonicalUrl?: string
    noIndex?: boolean
  }
  puck: {
    root: Record<string, unknown>
    content: Array<{ type: string; props: Record<string, unknown> }>
  }
}

export type PageSummary = {
  id: string
  title: string
  slug: string
  lang: string
  template: PageTemplate
  status: PageStatus
}
