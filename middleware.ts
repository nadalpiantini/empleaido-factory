/**
 * Middleware for route protection and tenant detection
 * Handles authentication and tenant routing for the Agent Wrapping Platform
 */

import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Routes that don't require authentication
 */
const publicRoutes = [
  '/login',
  '/register',
  '/auth',
  '/api/auth',
  '/_next',
  '/favicon.ico',
];

/**
 * Routes that require developer role
 */
const developerRoutes = ['/dashboard/developer', '/engines'];

/**
 * Routes that require admin role
 */
const adminRoutes = ['/admin'];

/**
 * Main middleware function
 */
export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const { pathname } = req.nextUrl;

  // Create Supabase client for middleware
  const supabase = createMiddlewareClient({ req, res });

  // Check if route is public
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));

  // Get session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Redirect to login if not authenticated and trying to access protected route
  if (!session && !isPublicRoute && pathname.startsWith('/dashboard')) {
    const redirectUrl = new URL('/login', req.url);
    redirectUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // If logged in and trying to access login/register, redirect to dashboard
  if (session && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // Get user profile with role and tenant
  let userRole: string | null = null;
  let tenantId: string | null = null;

  if (session?.user) {
    try {
      // Fetch user profile from ef_user_profiles
      const { data: profile } = await supabase
        .from('ef_user_profiles')
        .select('role, tenant_id')
        .eq('id', session.user.id)
        .single();

      if (profile) {
        userRole = profile.role;
        tenantId = profile.tenant_id;
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  }

  // Role-based route protection
  if (userRole) {
    // Check developer routes
    if (developerRoutes.some((route) => pathname.startsWith(route))) {
      if (userRole !== 'developer' && userRole !== 'admin') {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
    }

    // Check admin routes
    if (adminRoutes.some((route) => pathname.startsWith(route))) {
      if (userRole !== 'admin') {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
    }
  }

  // Tenant routing (future: subdomain support)
  // For now, we'll store tenant_id in headers for server components
  if (tenantId) {
    res.headers.set('x-tenant-id', tenantId);
  }

  if (userRole) {
    res.headers.set('x-user-role', userRole);
  }

  return res;
}

/**
 * Configure which routes the middleware should run on
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api/auth/* (auth endpoints)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
