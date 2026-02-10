/**
 * Supabase Server Client for Middleware
 */

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export function createMiddlewareClient({ req, res }: { req: NextRequest; res: NextResponse }) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return req.cookies.get(name)?.value;
      },
      set(name: string, value: string, options: any) {
        res.cookies.set({ name, value, ...options });
      },
      remove(name: string, options: any) {
        res.cookies.set({ name, value: '', ...options });
      },
    },
  });
}
