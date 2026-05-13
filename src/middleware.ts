import { NextRequest, NextResponse } from 'next/server';
import { AUTH, verifyToken } from './lib/auth';

// Static asset extensions served from /public — these are always allowed
// (otherwise the landing page's videos, parallax JPGs, decorative PNGs, etc.
// get redirected to /login because they live at the URL root).
const STATIC_FILE_RE = /\.(?:mp4|webm|mov|m4v|ogg|png|jpe?g|gif|svg|ico|webp|avif|woff2?|ttf|eot|css|js|map|txt|json|pdf)$/i;

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Always allow public routes, login, logout, public assets, tracking endpoints get their own auth check.
  if (
    pathname === '/' ||
    STATIC_FILE_RE.test(pathname) ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/admin/login') ||
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/logo') ||
    pathname.startsWith('/screenshots') ||
    pathname === '/robots.txt'
  ) {
    return NextResponse.next();
  }

  // Admin section: require admin cookie
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    const adminTok = req.cookies.get(AUTH.ADMIN_COOKIE_NAME)?.value;
    const adminSess = await verifyToken(adminTok);
    if (!adminSess || adminSess.role !== 'admin') {
      const url = req.nextUrl.clone();
      url.pathname = '/admin/login';
      url.searchParams.set('next', pathname);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // Tracking endpoints: visitor session required
  if (pathname.startsWith('/api/track')) {
    const tok = req.cookies.get(AUTH.COOKIE_NAME)?.value;
    if (!(await verifyToken(tok))) {
      return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });
    }
    return NextResponse.next();
  }

  // Everything else: visitor cookie required
  const sessTok = req.cookies.get(AUTH.COOKIE_NAME)?.value;
  if (!(await verifyToken(sessTok))) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    if (pathname !== '/') url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // Skip the middleware entirely for Next internals and anything that has a
  // common static-asset file extension. The in-function STATIC_FILE_RE is the
  // defensive second line; this matcher is the first.
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:mp4|webm|mov|m4v|ogg|png|jpe?g|gif|svg|ico|webp|avif|woff2?|ttf|eot|css|js|map|txt|json|pdf)$).*)',
  ],
};
