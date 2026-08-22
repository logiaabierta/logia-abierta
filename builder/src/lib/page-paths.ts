import type { LogiaPage } from './types'

const knownTemplatePaths: Record<string, string> = {
  home: 'src/content/puck-pages/es/home.json',
  text: 'src/content/puck-pages/es/template-text.json',
  video: 'src/content/puck-pages/es/template-video.json',
  audio: 'src/content/puck-pages/es/template-audio.json',
}

export function githubPathForPage(page: LogiaPage, id?: string) {
  if (id && knownTemplatePaths[id]) return knownTemplatePaths[id]

  const cleanSlug = page.slug.replace(/^\/+|\/+$/g, '') || 'home'
  return `src/content/puck-pages/${page.lang}/${cleanSlug}.json`
}
