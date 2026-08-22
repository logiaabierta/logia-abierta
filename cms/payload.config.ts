import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

import { postgresAdapter } from '@payloadcms/db-postgres'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import { buildConfig } from 'payload'
import sharp from 'sharp'

import { Authors } from './src/collections/Authors'
import { Media } from './src/collections/Media'
import { Pages } from './src/collections/Pages'
import { Posts } from './src/collections/Posts'
import { Users } from './src/collections/Users'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const databaseUrl = process.env.DATABASE_URL
const databaseCaCertPath = process.env.SUPABASE_DB_CA_CERT
const databaseCaCertText = process.env.SUPABASE_DB_CA_CERT_TEXT
const databaseCaCert =
  databaseCaCertText ||
  (databaseCaCertPath && fs.existsSync(databaseCaCertPath)
    ? fs.readFileSync(databaseCaCertPath, 'utf8')
    : undefined)
const databaseSsl = databaseCaCert
  ? {
      ca: databaseCaCert,
      rejectUnauthorized: true,
    }
  : undefined
const payloadSecret =
  process.env.PAYLOAD_SECRET ||
  (process.env.NODE_ENV === 'production' ? '' : 'logia-abierta-cms-local-dev-secret')

const r2Enabled = Boolean(
  process.env.R2_BUCKET &&
    process.env.R2_ACCESS_KEY_ID &&
    process.env.R2_SECRET_ACCESS_KEY &&
    process.env.R2_ENDPOINT &&
    process.env.R2_PUBLIC_URL,
)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname, 'src'),
    },
  },
  collections: [Users, Media, Authors, Pages, Posts],
  db: databaseUrl
    ? postgresAdapter({
        pool: {
          connectionString: databaseUrl,
          ...(databaseSsl ? { ssl: databaseSsl } : {}),
        },
      })
    : sqliteAdapter({
        client: {
          url: `file:${path.resolve(dirname, 'payload-dev.db')}`,
        },
        wal: true,
      }),
  editor: lexicalEditor(),
  plugins: [
    s3Storage({
      enabled: r2Enabled,
      bucket: process.env.R2_BUCKET || '',
      collections: {
        media: {
          disablePayloadAccessControl: true,
          generateFileURL: ({ filename, prefix }) => {
            const key = prefix ? `${prefix}/${filename}` : filename

            return `${process.env.R2_PUBLIC_URL}/${key}`
          },
        },
      },
      config: {
        credentials: {
          accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
        },
        endpoint: process.env.R2_ENDPOINT,
        forcePathStyle: true,
        region: 'auto',
      },
    }),
  ],
  secret: payloadSecret,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})
