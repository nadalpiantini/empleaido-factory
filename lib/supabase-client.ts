/**
 * SUPABASE CLIENT COMPONENT UTILITIES
 *
 * Browser client for client components
 * Uses @supabase/ssr createBrowserClient
 */

import { createBrowserClient } from '@supabase/ssr';

// =====================================================
// CLIENT COMPONENT CLIENT (for 'use client' components)
// =====================================================

let clientInstance: ReturnType<typeof createBrowserClient> | null = null;

export function createClientComponentClient() {
  if (typeof window === 'undefined') {
    throw new Error('createClientComponentClient can only be used in client components');
  }

  // Return singleton instance to avoid creating multiple clients
  if (!clientInstance) {
    clientInstance = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }

  return clientInstance;
}
