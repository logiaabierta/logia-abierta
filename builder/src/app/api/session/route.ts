import { NextResponse } from 'next/server'

import { clearBuilderSession, setBuilderSession } from '../../../lib/auth'

export async function POST(request: Request) {
  const password = process.env.BUILDER_PASSWORD

  if (!password) {
    await setBuilderSession()
    return NextResponse.json({ ok: true })
  }

  const body = (await request.json().catch(() => ({}))) as { password?: string }

  if (body.password !== password) {
    return NextResponse.json({ ok: false, error: 'Invalid password' }, { status: 401 })
  }

  await setBuilderSession()
  return NextResponse.json({ ok: true })
}

export async function DELETE() {
  await clearBuilderSession()
  return NextResponse.json({ ok: true })
}
