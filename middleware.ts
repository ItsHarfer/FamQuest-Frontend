import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // only protect dashboard and all subroutes
  const isDashboard = pathname === '/dashboard' || pathname.startsWith('/dashboard/')
  if (!isDashboard) return NextResponse.next()

  // middleware can read cookies (NOT localStorage)
  const token = req.cookies.get('famquest_token')?.value

  if (!token) {
    const url = req.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('next', pathname)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*'],
}