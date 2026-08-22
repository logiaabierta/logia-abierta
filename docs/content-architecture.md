# Logia Abierta Content Architecture

## Rendering model

Logia Abierta uses static output first.

### Static visual pages

Home, landing pages, links-style hubs and evergreen static pages live as Puck-compatible JSON in Git:

```text
src/content/puck-pages/
```

Astro reads those JSON files during `astro build` and renders plain static HTML through:

```text
src/components/puck/PuckPage.astro
src/components/puck/PuckBlock.astro
```

This keeps the public site fast and resilient. A reader opening a static page does not hit Supabase, Payload or a serverless function.

### Editorial content

Payload remains the editorial CMS for posts, authors, media, roles and workflow.

The intended publication flow is:

```text
Author publishes in Payload
Payload calls VERCEL_DEPLOY_HOOK_URL
Vercel runs astro build
Astro reads Payload/Supabase at build time
Vercel serves static HTML from CDN
```

A reader opening a blog post should receive generated HTML. The request should not query Supabase per page view.

## Puck templates

Current Git-backed templates:

```text
/es/plantillas/texto
/es/plantillas/video
/es/plantillas/audio
```

These are starter JSON pages for the standalone Puck builder. The builder saves JSON back to Git, not to Payload.

## Standalone builder deployment

The Puck visual builder lives in:

```text
builder/
```

Recommended Vercel project:

```text
Project name: logia-abierta-builder
Root directory: builder
Domain: builder.logiaabierta.com
Framework preset: Next.js
Build command: npm run build
Install command: npm install
```

The builder is independent from Payload. It has its own simple access gate:

```text
BUILDER_PASSWORD=...
```

Without GitHub variables, the builder still works and can export JSON. With GitHub variables, clicking Publish commits JSON into the Astro repo:

```text
GITHUB_CONTENT_TOKEN=...
GITHUB_OWNER=logiaabierta
GITHUB_REPO=logia-abierta
GITHUB_BRANCH=main
```

Use a fine-grained GitHub token with contents read/write permission for this repo only.

## Payload post templates

Payload posts have `contentTemplate`:

- `text`: essays, guides, trazados and long-form articles.
- `video`: talks, classes, YouTube/Vidstack pages with transcript.
- `audio`: podcast episodes, audio notes and show notes.

Video/audio fields live under `mediaDetails`.

## Vercel deploy hook

Set this environment variable on the Payload deployment:

```text
VERCEL_DEPLOY_HOOK_URL=https://api.vercel.com/v1/integrations/deploy/...
```

When a post is published or updated while published, Payload calls the hook. If the variable is missing, nothing happens.
