import { NextResponse } from 'next/server';

function unauthorized() {
  return new NextResponse('Authentication required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Logia Abierta Studio"',
    },
  });
}

export function middleware(request) {
  const username = process.env.STUDIO_BASIC_USER;
  const password = process.env.STUDIO_BASIC_PASSWORD;

  if (!username || !password) return NextResponse.next();

  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/_next') || pathname === '/favicon.ico') {
    return NextResponse.next();
  }

  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Basic ')) return unauthorized();

  try {
    const decoded = atob(authHeader.slice('Basic '.length));
    const separator = decoded.indexOf(':');
    const suppliedUser = decoded.slice(0, separator);
    const suppliedPassword = decoded.slice(separator + 1);

    if (suppliedUser === username && suppliedPassword === password) {
      return NextResponse.next();
    }
  } catch {
    return unauthorized();
  }

  return unauthorized();
}

export const config = {
  matcher: ['/((?!.*\\..*).*)'],
};
