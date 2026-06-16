import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

function isOriginAllowed(origin: string | null): boolean {
  if (!origin) return false
  try {
    const url = new URL(origin)
    const hostname = url.hostname
    // Allow localhost / 127.0.0.1
    if (hostname === 'localhost' || hostname === '127.0.0.1') return true
    // Allow private IP ranges (192.168.x.x, 10.x.x.x, 172.16.x.x to 172.31.x.x)
    if (
      hostname.startsWith('192.168.') ||
      hostname.startsWith('10.') ||
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(hostname)
    ) {
      return true
    }
  } catch (e) {
    // ignore
  }
  return false
}

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Handle CORS for API routes
  if (path.startsWith('/api')) {
    const origin = request.headers.get('origin')
    const isAllowed = isOriginAllowed(origin)

    if (request.method === 'OPTIONS') {
      const response = new NextResponse(null, { status: 204 })
      if (isAllowed && origin) {
        response.headers.set('Access-Control-Allow-Origin', origin)
        response.headers.set('Access-Control-Allow-Credentials', 'true')
        response.headers.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS,PATCH')
        response.headers.set(
          'Access-Control-Allow-Headers',
          'Content-Type, Authorization, Cookie, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version'
        )
        response.headers.set('Access-Control-Max-Age', '86400')
      }
      return response
    }

    const response = NextResponse.next()
    if (isAllowed && origin) {
      response.headers.set('Access-Control-Allow-Origin', origin)
      response.headers.set('Access-Control-Allow-Credentials', 'true')
      response.headers.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS,PATCH')
      response.headers.set(
        'Access-Control-Allow-Headers',
        'Content-Type, Authorization, Cookie, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version'
      )
    }
    return response
  }

  // Handle standard page requests
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-pathname', path)

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

export const config = {
  matcher: [
    // Apply middleware to all routes except static assets
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}

