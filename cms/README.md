# Logia Abierta CMS

Payload CMS workspace for Logia Abierta.

## Stack

- Payload 3
- Next.js 15
- Supabase Postgres through `DATABASE_URL`
- Local SQLite fallback when `DATABASE_URL` is not set
- Cloudflare R2 through Payload's S3-compatible storage adapter

## Local setup

1. Copy `.env.example` to `.env`.
2. For quick local testing, leave `DATABASE_URL` empty and Payload will use `payload-dev.db`.
3. To test Supabase, add a Supabase Postgres connection string to `DATABASE_URL`.
4. Add a strong `PAYLOAD_SECRET` before deploying.
5. Optional: add the Cloudflare R2 variables when media uploads should go to R2.

For Vercel, use `SUPABASE_DB_CA_CERT_TEXT` with the full Supabase CA certificate content
instead of relying on a local certificate file.

```bash
npm install
npm run dev
```

The admin UI runs at `http://localhost:3334/admin`.

## Notes

The previous Sanity Studio has been moved to `cms.old` while Payload becomes the active CMS workspace.
