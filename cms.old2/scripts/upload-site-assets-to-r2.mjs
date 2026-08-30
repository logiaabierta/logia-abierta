import { createHash } from 'node:crypto'
import { createReadStream } from 'node:fs'
import { mkdir, readdir, readFile, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import dotenv from 'dotenv'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(dirname, '../..')
const cmsDir = path.resolve(rootDir, 'cms')
const envPath = path.resolve(cmsDir, '.env')
const manifestPath = path.resolve(rootDir, 'src/config/r2-assets.json')
const uploadPrefix = 'site-assets'

dotenv.config({ path: envPath })

const required = [
  'R2_BUCKET',
  'R2_ACCESS_KEY_ID',
  'R2_SECRET_ACCESS_KEY',
  'R2_ENDPOINT',
  'R2_PUBLIC_URL',
]

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing ${key} in ${envPath}`)
  }
}

const client = new S3Client({
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
  endpoint: process.env.R2_ENDPOINT,
  forcePathStyle: true,
  region: 'auto',
})

const imageExtensions = new Set(['.avif', '.gif', '.jpeg', '.jpg', '.png', '.svg', '.webp'])
const contentTypes = {
  '.avif': 'image/avif',
  '.gif': 'image/gif',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
}

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const absolutePath = path.join(dir, entry.name)

    if (entry.isDirectory()) {
      files.push(...(await walk(absolutePath)))
    } else if (imageExtensions.has(path.extname(entry.name).toLowerCase())) {
      files.push(absolutePath)
    }
  }

  return files
}

function publicPathFor(file) {
  const relative = path.relative(rootDir, file).split(path.sep).join('/')

  if (relative.startsWith('public/')) {
    return `/${relative.slice('public/'.length)}`
  }

  return `/${relative}`
}

function r2KeyFor(file) {
  const relative = path.relative(rootDir, file).split(path.sep).join('/')

  return `${uploadPrefix}/${relative}`
}

async function digestFor(file) {
  const buffer = await readFile(file)

  return createHash('sha256').update(buffer).digest('hex')
}

const uploadRoots = [path.resolve(rootDir, 'public'), path.resolve(rootDir, 'src/assets')]
const files = (await Promise.all(uploadRoots.map(walk))).flat().sort()
const manifest = {
  generatedAt: new Date().toISOString(),
  publicBaseUrl: process.env.R2_PUBLIC_URL,
  uploadPrefix,
  assets: {},
}

for (const file of files) {
  const extension = path.extname(file).toLowerCase()
  const key = r2KeyFor(file)
  const url = `${process.env.R2_PUBLIC_URL}/${key}`
  const metadata = await stat(file)
  const sha256 = await digestFor(file)

  await client.send(
    new PutObjectCommand({
      Bucket: process.env.R2_BUCKET,
      Key: key,
      Body: createReadStream(file),
      ContentLength: metadata.size,
      ContentType: contentTypes[extension] || 'application/octet-stream',
      CacheControl: 'public, max-age=31536000, immutable',
    }),
  )

  manifest.assets[publicPathFor(file)] = {
    key,
    sha256,
    size: metadata.size,
    url,
  }

  console.log(`Uploaded ${publicPathFor(file)} -> ${url}`)
}

await mkdir(path.dirname(manifestPath), { recursive: true })
await writeFile(`${manifestPath}.tmp`, `${JSON.stringify(manifest, null, 2)}\n`)
await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`)

console.log(`Wrote ${path.relative(rootDir, manifestPath)}`)
