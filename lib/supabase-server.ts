/**
 * SUPABASE SERVER CLIENT UTILITIES
 *
 * Provides server-side Supabase client creation for Route Handlers, Server Components, and Middleware
 * Uses @supabase/ssr instead of deprecated auth-helpers
 */

import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

// =====================================================
// ROUTE HANDLER CLIENT (for API routes)
// =====================================================

export function createRouteHandlerClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async getAll() {
          return (await cookieStore).getAll();
        },
        async setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          try {
            const store = await cookieStore;
            cookiesToSet.forEach(({ name, value, options }) =>
              store.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}

// =====================================================
// SERVER COMPONENT CLIENT (for React Server Components)
// =====================================================

export function createServerComponentClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async getAll() {
          return (await cookieStore).getAll();
        },
        async setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          try {
            const store = await cookieStore;
            cookiesToSet.forEach(({ name, value, options }) =>
              store.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}

// =====================================================
// MIDDLEWARE CLIENT (for Next.js middleware)
// =====================================================

export function createMiddlewareClient({ req, res }: { req: NextRequest; res: NextResponse }) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async getAll() {
          const cookieNames = Object.keys(req.cookies);
          const cookies = cookieNames.map((name) => ({
            name,
            value: req.cookies.get(name)?.value || '',
          }));
          return cookies;
        },
        async setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          res.cookies.set(cookiesToSet.map(({ name, value, options }) => ({
            name,
            value,
            ...options,
          })));
        },
      },
    }
  );
}
