import path from 'node:path'
import { fileURLToPath } from 'node:url'

import dotenv from 'dotenv'
import { getPayload } from 'payload'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const cmsDir = path.resolve(dirname, '..')

dotenv.config({ path: path.resolve(cmsDir, '.env') })

const email = process.argv[2]

if (!email) {
  throw new Error('Usage: npm run payload -- run scripts/promote-admin.ts user@example.com')
}

const { default: config } = await import('../payload.config')
const payload = await getPayload({ config })

const users = await payload.find({
  collection: 'users',
  where: {
    email: {
      equals: email,
    },
  },
  limit: 1,
  overrideAccess: true,
})

const user = users.docs[0]

if (!user) {
  throw new Error(`No Payload user found for ${email}`)
}

const updated = await payload.update({
  collection: 'users',
  id: user.id,
  data: {
    role: 'admin',
  },
  overrideAccess: true,
})

console.log(`Promoted ${updated.email} to ${updated.role}`)

process.exit(0)
