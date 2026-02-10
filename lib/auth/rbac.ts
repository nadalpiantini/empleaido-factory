/**
 * Role-Based Access Control (RBAC) Utilities
 * Helper functions for checking permissions and managing access control
 */

import type { Permission, UserRole } from './permissions';
import { hasPermission, hasAnyPermission } from './permissions';

// =====================================================
// SERVER-SIDE PERMISSION CHECKING
// =====================================================

/**
 * Check if current user has permission (server-side)
 * This function should be used in server components and API routes
 *
 * @param request - NextRequest object (contains auth headers)
 * @param permission - Permission to check
 * @returns Object with hasPermission flag and user info
 */
export async function checkServerPermission(
  request: Request,
  permission: Permission
): Promise<{
  hasPermission: boolean;
  user: { id: string; role: UserRole; tenantId: string } | null;
}> {
  try {
    // Get user from session (using Supabase)
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Get auth header
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return { hasPermission: false, user: null };
    }

    const token = authHeader.substring(7);

    // Verify token and get user
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return { hasPermission: false, user: null };
    }

    // Get user profile with role and tenant
    const { data: profile } = await supabase
      .from('ef_user_profiles')
      .select('id, role, tenant_id')
      .eq('id', user.id)
      .single();

    if (!profile) {
      return { hasPermission: false, user: null };
    }

    const userRole = profile.role as UserRole;
    const permitted = hasPermission(userRole, permission);

    return {
      hasPermission: permitted,
      user: {
        id: profile.id,
        role: userRole,
        tenantId: profile.tenant_id,
      },
    };
  } catch (error) {
    console.error('Error checking server permission:', error);
    return { hasPermission: false, user: null };
  }
}

/**
 * Require permission (throws error if not permitted)
 * Use this in API routes to protect endpoints
 *
 * @param request - NextRequest object
 * @param permission - Required permission
 * @returns User object if permitted
 * @throws Error if not permitted
 */
export async function requirePermission(
  request: Request,
  permission: Permission
): Promise<{ id: string; role: UserRole; tenantId: string }> {
  const result = await checkServerPermission(request, permission);

  if (!result.hasPermission || !result.user) {
    throw new Error(
      `Permission denied: ${permission} required. You have role: ${result.user?.role || 'none'}`
    );
  }

  return result.user;
}

/**
 * Check multiple permissions (user needs at least one)
 * @param request - NextRequest object
 * @param permissions - Array of permissions
 * @returns Object with permission result and user info
 */
export async function checkAnyServerPermission(
  request: Request,
  permissions: Permission[]
): Promise<{
  hasPermission: boolean;
  user: { id: string; role: UserRole; tenantId: string } | null;
}> {
  try {
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return { hasPermission: false, user: null };
    }

    const token = authHeader.substring(7);
    const { data: { user } } = await supabase.auth.getUser(token);

    if (!user) {
      return { hasPermission: false, user: null };
    }

    const { data: profile } = await supabase
      .from('ef_user_profiles')
      .select('id, role, tenant_id')
      .eq('id', user.id)
      .single();

    if (!profile) {
      return { hasPermission: false, user: null };
    }

    const userRole = profile.role as UserRole;
    const permitted = hasAnyPermission(userRole, permissions);

    return {
      hasPermission: permitted,
      user: {
        id: profile.id,
        role: userRole,
        tenantId: profile.tenant_id,
      },
    };
  } catch (error) {
    console.error('Error checking permissions:', error);
    return { hasPermission: false, user: null };
  }
}

// =====================================================
// CLIENT-SIDE PERMISSION HELPERS
// =====================================================

/**
 * Hook to check if current user has permission
 * This is a placeholder - actual implementation would use session context
 *
 * @param permission - Permission to check
 * @returns True if user has permission
 */
export function useHasPermission(permission: Permission): boolean {
  // This would be implemented in a React component with session context
  // For now, return false as placeholder
  return false;
}

/**
 * Hook to get current user role
 * Placeholder for React hook implementation
 */
export function useUserRole(): UserRole | null {
  // This would be implemented with session context
  return null;
}

/**
 * Hook to check if user is developer
 */
export function useIsDeveloper(): boolean {
  return useUserRole() === 'developer';
}

/**
 * Hook to check if user is admin
 */
export function useIsAdmin(): boolean {
  return useUserRole() === 'admin';
}

// =====================================================
// PERMISSION GUARD HOC
// =====================================================

/**
 * Higher-order component to protect routes/pages based on permissions
 * This is a placeholder for React implementation
 */
export function withPermission<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  requiredPermission: Permission
) {
  return function PermissionGuard(props: P) {
    // This would check session context and redirect if not permitted
    // For now, just render the component
    return <WrappedComponent {...props} />;
  };
}

/**
 * Higher-order component to protect routes for specific roles
 */
export function withRole<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  allowedRoles: UserRole[]
) {
  return function RoleGuard(props: P) {
    // This would check session context and redirect if role not allowed
    return <WrappedComponent {...props} />;
  };
}

// =====================================================
// API ROUTE MIDDLEWARE
// =====================================================

/**
 * Middleware for API routes to check permissions
 * Usage in API route:
 * ```
 * import { withPermission } from '@/lib/auth/rbac';
 *
 * export const POST = withPermission(async (req, { user }) => {
 *   // Handle request, user is guaranteed to have permission
 * }, 'engine:create');
 * ```
 */
export function withPermission<
  T extends Request | (Request & { json: () => Promise<any> }),
>(
  handler: (req: T, context: { user: { id: string; role: UserRole; tenantId: string } }) => Promise<Response>,
  requiredPermission: Permission
) {
  return async (req: T): Promise<Response> => {
    try {
      const user = await requirePermission(req, requiredPermission);
      return handler(req, { user });
    } catch (error) {
      return new Response(
        JSON.stringify({
          error: error instanceof Error ? error.message : 'Permission denied',
        }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }
  };
}

/**
 * Middleware for API routes accepting multiple permissions
 */
export function withAnyPermission<
  T extends Request | (Request & { json: () => Promise<any> }),
>(
  handler: (req: T, context: { user: { id: string; role: UserRole; tenantId: string } }) => Promise<Response>,
  requiredPermissions: Permission[]
) {
  return async (req: T): Promise<Response> => {
    try {
      const result = await checkAnyServerPermission(req, requiredPermissions);

      if (!result.hasPermission || !result.user) {
        throw new Error('Permission denied');
      }

      return handler(req, { user: result.user });
    } catch (error) {
      return new Response(
        JSON.stringify({
          error: error instanceof Error ? error.message : 'Permission denied',
        }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }
  };
}

// =====================================================
// PERMISSION ERROR HANDLERS
// =====================================================

/**
 * Create a standardized permission error response
 */
export function createPermissionError(permission: Permission): Response {
  return new Response(
    JSON.stringify({
      error: `Permission denied: ${permission} required`,
      code: 'PERMISSION_DENIED',
      permission,
    }),
    { status: 403, headers: { 'Content-Type': 'application/json' } }
  );
}

/**
 * Create a "not found" response (to hide existence of resources user can't access)
 */
export function createNotFoundResponse(): Response {
  return new Response(
    JSON.stringify({
      error: 'Resource not found',
      code: 'NOT_FOUND',
    }),
    { status: 404, headers: { 'Content-Type': 'application/json' } }
  );
}

// =====================================================
// TENANT ISOLATION HELPERS
// =====================================================

/**
 * Check if user can access data from a specific tenant
 * @param userTenantId - User's tenant ID
 * @param targetTenantId - Target tenant ID
 * @param userRole - User's role
 * @returns True if user can access tenant data
 */
export function canAccessTenant(
  userTenantId: string,
  targetTenantId: string,
  userRole: UserRole
): boolean {
  // Admin can access all tenants
  if (userRole === 'admin') return true;

  // Users can only access their own tenant
  return userTenantId === targetTenantId;
}

/**
 * Filter query results to only include user's tenant
 * This should be used in conjunction with RLS policies
 * @param query - Query object
 * @param tenantId - User's tenant ID
 * @returns Filtered query (conceptual - actual implementation depends on ORM)
 */
export function filterByTenant<T extends { tenant_id?: string }>(
  items: T[],
  tenantId: string
): T[] {
  return items.filter((item) => item.tenant_id === tenantId);
}

// =====================================================
// EXPORTS
// =====================================================

export default {
  checkServerPermission,
  requirePermission,
  checkAnyServerPermission,
  withPermission,
  withAnyPermission,
  createPermissionError,
  createNotFoundResponse,
  canAccessTenant,
  filterByTenant,
};
