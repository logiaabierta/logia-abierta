import { NextResponse } from 'next/server'

import { hasBuilderAccess } from '../../../lib/auth'
import { pageSchema } from '../../../lib/page-schema'
import { githubPathForPage } from '../../../lib/page-paths'
import { pageId, templates } from '../../../lib/templates'
import type { LogiaPage, PageSummary } from '../../../lib/types'

function summaries(): PageSummary[] {
  return Object.entries(templates).map(([id, page]) => ({
    id,
    title: page.title,
    slug: page.slug,
    lang: page.lang,
    template: page.template,
    status: page.status,
  }))
}

function encodeBase64(value: string) {
  return Buffer.from(value, 'utf8').toString('base64')
}

async function getGithubFile(path: string) {
  const token = process.env.GITHUB_CONTENT_TOKEN
  const owner = process.env.GITHUB_OWNER
  const repo = process.env.GITHUB_REPO
  const branch = process.env.GITHUB_BRANCH || 'main'

  if (!token || !owner || !repo) return null

  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${encodeURIComponent(path).replaceAll('%2F', '/')}?ref=${branch}`,
    {
      headers: {
        accept: 'application/vnd.github+json',
        authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    },
  )

  if (response.status === 404) return null
  if (!response.ok) throw new Error(`GitHub read failed: ${response.status}`)

  return (await response.json()) as { sha?: string }
}

async function saveToGithub({ id, page }: { id?: string; page: LogiaPage }) {
  const token = process.env.GITHUB_CONTENT_TOKEN
  const owner = process.env.GITHUB_OWNER
  const repo = process.env.GITHUB_REPO
  const branch = process.env.GITHUB_BRANCH || 'main'

  if (!token || !owner || !repo) {
    return {
      saved: false,
      mode: 'download',
      message: 'GitHub env vars missing. Export the JSON and commit it manually.',
    }
  }

  const path = githubPathForPage(page, id)
  const existing = await getGithubFile(path)

  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${encodeURIComponent(path).replaceAll('%2F', '/')}`,
    {
      method: 'PUT',
      headers: {
        accept: 'application/vnd.github+json',
        authorization: `Bearer ${token}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        branch,
        message: `Update Puck page: ${page.lang}/${page.slug}`,
        content: encodeBase64(`${JSON.stringify(page, null, 2)}\n`),
        sha: existing?.sha,
      }),
    },
  )

  if (!response.ok) {
    const body = await response.text()
    throw new Error(`GitHub save failed: ${response.status} ${body}`)
  }

  return { saved: true, mode: 'github', path }
}

export async function GET(request: Request) {
  if (!(await hasBuilderAccess())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json({ pages: summaries() })
  }

  const page = templates[id] || templates.home
  return NextResponse.json({ id: id || pageId(page), page })
}

export async function POST(request: Request) {
  if (!(await hasBuilderAccess())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = (await request.json()) as { id?: string; page?: unknown }
  const page = pageSchema.parse(body.page) as LogiaPage
  const result = await saveToGithub({ id: body.id, page })

  return NextResponse.json({ ok: true, ...result })
}
