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

Payload has been archived in `cms.old2/`. Keystatic is now the active Git-based editorial studio for posts, essays, authors and R2 media notes.

The intended publication flow is:

```text
Author publishes in Keystatic
Keystatic commits Markdown/MDX/JSON to main
GitHub triggers the Vercel production deployment
Vercel runs astro build
Astro reads content from the repository at build time
Vercel serves static HTML from CDN
```

A reader opening a blog post receives generated HTML. The request does not query Supabase/Payload per page view.

Keystatic lives in the standalone Next app:

```text
studio/
```

Use GitHub mode in production:

```text
KEYSTATIC_STORAGE=github
```

Recommended Vercel project:

```text
Project name: logia-abierta-studio
Root directory: studio
Domain: studio.logiaabierta.com
Framework preset: Next.js
Build command: npm run build
Install command: npm install
```

The repo target is configured in `studio/keystatic.config.js`:

```text
logiaabierta/logia-abierta
```

## Puck templates

Current Git-backed templates:

```text
/es/plantillas/texto
/es/plantillas/video
/es/plantillas/audio
```

These are starter JSON pages for the standalone Puck builder. The builder saves JSON back to Git, not to Payload.

## Puck builder deployment

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

## R2 assets

Keystatic's native file/image fields save to Git or Keystatic Cloud. Logia Abierta uses Cloudflare R2 for public assets, so the standalone studio includes a dedicated uploader:

```text
https://studio.logiaabierta.com/assets
```

The uploader sends files to R2 and returns a public URL. Paste that URL into the `heroImageUrl`, `thumbnailUrl`, `ogImageUrl`, author avatar, or media note fields in Keystatic.

Required environment variables:

```text
STUDIO_BASIC_USER
STUDIO_BASIC_PASSWORD
KEYSTATIC_STORAGE=github
KEYSTATIC_GITHUB_CLIENT_ID
KEYSTATIC_GITHUB_CLIENT_SECRET
KEYSTATIC_SECRET
NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG
R2_UPLOAD_SECRET
R2_BUCKET
R2_ACCESS_KEY_ID
R2_SECRET_ACCESS_KEY
R2_ENDPOINT
R2_PUBLIC_URL
```

## Legacy CMS

Previous CMS experiments are archived:

```text
cms.old/   Sanity Studio
cms.old2/  Payload CMS
```
