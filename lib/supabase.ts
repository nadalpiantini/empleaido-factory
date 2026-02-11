/**
 * SUPABASE CLIENT UTILITIES - Barrel Export
 *
 * Re-exports from specialized files to avoid module resolution issues
 */

// Server-side exports (for API routes, Server Components, Middleware)
export {
  createRouteHandlerClient,
  createServerComponentClient,
  createMiddlewareClient,
} from './supabase-server';

// Client-side exports (for Client Components)
export { createClientComponentClient } from './supabase-client';
