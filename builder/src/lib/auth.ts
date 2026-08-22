import { cookies } from 'next/headers'

const cookieName = 'logia_builder_session'

export async function hasBuilderAccess() {
  const password = process.env.BUILDER_PASSWORD

  if (!password) return true

  const cookieStore = await cookies()
  return cookieStore.get(cookieName)?.value === password
}

export async function setBuilderSession() {
  const password = process.env.BUILDER_PASSWORD
  if (!password) return

  const cookieStore = await cookies()
  cookieStore.set(cookieName, password, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 12,
    path: '/',
  })
}

export async function clearBuilderSession() {
  const cookieStore = await cookies()
  cookieStore.delete(cookieName)
}
