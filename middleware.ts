import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  try {
    // Refresh session if expired
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Middleware auth error:', error);
    }

    const url = req.nextUrl.clone();
    const isAuthPage = url.pathname.startsWith('/auth/');
    const isProtectedPage = url.pathname.startsWith('/dashboard') || 
                           url.pathname.startsWith('/course') ||
                           url.pathname.startsWith('/lesson');
    const isPreviewPage = url.pathname.includes('/preview');

    // Allow preview pages without authentication
    if (isPreviewPage) {
      return res;
    }

    // Redirect authenticated users away from auth pages
    if (session && isAuthPage) {
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }

    // Redirect unauthenticated users from protected pages
    if (!session && isProtectedPage) {
      url.pathname = '/auth/signin';
      url.searchParams.set('redirectTo', req.nextUrl.pathname);
      return NextResponse.redirect(url);
    }

    return res;
  } catch (error) {
    console.error('Middleware error:', error);
    return res;
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};