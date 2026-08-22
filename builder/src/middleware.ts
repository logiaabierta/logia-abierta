import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

const cookieName = 'logia_builder_session'

export function middleware(request: NextRequest) {
  const password = process.env.BUILDER_PASSWORD

  if (!password) return NextResponse.next()

  const { pathname } = request.nextUrl
  const publicPath =
    pathname === '/login' ||
    pathname.startsWith('/api/session') ||
    pathname.startsWith('/_next') ||
    pathname === '/favicon.ico'

  if (publicPath) return NextResponse.next()

  if (request.cookies.get(cookieName)?.value === password) {
    return NextResponse.next()
  }

  const url = request.nextUrl.clone()
  url.pathname = '/login'
  url.searchParams.set('from', pathname)
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ['/((?!.*\\..*).*)'],
}
