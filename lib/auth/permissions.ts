/**
 * Role-Based Access Control (RBAC) Permissions
 * Defines what each user role can do in the Agent Wrapping Platform
 */

// =====================================================
// ROLE DEFINITIONS
// =====================================================

export type UserRole = 'developer' | 'user' | 'customer' | 'admin';

export interface RoleDefinition {
  name: string;
  description: string;
  permissions: Permission[];
}

export type Permission =
  // Engine permissions
  | 'engine:create'
  | 'engine:update'
  | 'engine:delete'
  | 'engine:publish'
  | 'engine:view'
  // Agent permissions
  | 'agent:create'
  | 'agent:update'
  | 'agent:delete'
  | 'agent:deploy'
  | 'agent:view'
  | 'agent:share'
  // Deployment permissions
  | 'deployment:view'
  | 'deployment:use'
  | 'deployment:manage'
  // Analytics permissions
  | 'analytics:view'
  | 'analytics:export'
  // Billing permissions
  | 'billing:view'
  | 'billing:manage'
  // Team permissions
  | 'team:create'
  | 'team:manage'
  | 'team:view'
  // Admin permissions
  | 'admin:users'
  | 'admin:tenants'
  | 'admin:settings';

// =====================================================
// PERMISSION MATRICES
// =====================================================

/**
 * Full permission matrix for each role
 */
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  developer: [
    // Engines
    'engine:create',
    'engine:update',
    'engine:delete',
    'engine:publish',
    'engine:view',
    // Agents
    'agent:create',
    'agent:update',
    'agent:delete',
    'agent:deploy',
    'agent:view',
    'agent:share',
    // Deployments
    'deployment:view',
    'deployment:use',
    'deployment:manage',
    // Analytics
    'analytics:view',
    'analytics:export',
    // Billing
    'billing:view',
    // Teams
    'team:create',
    'team:manage',
    'team:view',
  ],

  user: [
    // Engines (can view but not create/publish)
    'engine:view',
    // Agents
    'agent:create',
    'agent:update',
    'agent:delete',
    'agent:deploy',
    'agent:view',
    'agent:share',
    // Deployments
    'deployment:view',
    'deployment:use',
    'deployment:manage',
    // Analytics
    'analytics:view',
    // Billing
    'billing:view',
    // Teams
    'team:view',
  ],

  customer: [
    // Engines (view only public)
    'engine:view',
    // Agents (view only their own)
    'agent:view',
    // Deployments (use only)
    'deployment:view',
    'deployment:use',
  ],

  admin: [
    // All permissions (wildcard)
    'engine:create',
    'engine:update',
    'engine:delete',
    'engine:publish',
    'engine:view',
    'agent:create',
    'agent:update',
    'agent:delete',
    'agent:deploy',
    'agent:view',
    'agent:share',
    'deployment:view',
    'deployment:use',
    'deployment:manage',
    'analytics:view',
    'analytics:export',
    'billing:view',
    'billing:manage',
    'team:create',
    'team:manage',
    'team:view',
    'admin:users',
    'admin:tenants',
    'admin:settings',
  ],
};

/**
 * Human-readable role names and descriptions
 */
export const ROLE_DEFINITIONS: Record<UserRole, RoleDefinition> = {
  developer: {
    name: 'Developer',
    description: 'Can create, publish, and manage agent engines. Can build and deploy agents.',
    permissions: ROLE_PERMISSIONS.developer,
  },
  user: {
    name: 'User',
    description: 'Can assemble agents from engines and deploy them for customers.',
    permissions: ROLE_PERMISSIONS.user,
  },
  customer: {
    name: 'Customer',
    description: 'End users who interact with deployed agent applications.',
    permissions: ROLE_PERMISSIONS.customer,
  },
  admin: {
    name: 'Administrator',
    description: 'Full system access including user management and settings.',
    permissions: ROLE_PERMISSIONS.admin,
  },
};

// =====================================================
// PERMISSION CHECKING FUNCTIONS
// =====================================================

/**
 * Check if a role has a specific permission
 * @param role - User role
 * @param permission - Permission to check
 * @returns True if role has permission
 */
export function hasPermission(role: UserRole | null | undefined, permission: Permission): boolean {
  if (!role) return false;
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

/**
 * Check if a role has any of the specified permissions
 * @param role - User role
 * @param permissions - Array of permissions to check
 * @returns True if role has at least one of the permissions
 */
export function hasAnyPermission(
  role: UserRole | null | undefined,
  permissions: Permission[]
): boolean {
  if (!role) return false;
  const rolePermissions = new Set(ROLE_PERMISSIONS[role] ?? []);
  return permissions.some((permission) => rolePermissions.has(permission));
}

/**
 * Check if a role has all of the specified permissions
 * @param role - User role
 * @param permissions - Array of permissions to check
 * @returns True if role has all permissions
 */
export function hasAllPermissions(
  role: UserRole | null | undefined,
  permissions: Permission[]
): boolean {
  if (!role) return false;
  const rolePermissions = new Set(ROLE_PERMISSIONS[role] ?? []);
  return permissions.every((permission) => rolePermissions.has(permission));
}

/**
 * Get all permissions for a role
 * @param role - User role
 * @returns Array of permissions
 */
export function getRolePermissions(role: UserRole): Permission[] {
  return ROLE_PERMISSIONS[role] ?? [];
}

/**
 * Validate if a permission string is valid
 * @param permission - Permission string to validate
 * @returns True if permission exists in any role
 */
export function isValidPermission(permission: string): boolean {
  const allPermissions = new Set<Permission>();
  Object.values(ROLE_PERMISSIONS).forEach((permissions) => {
    permissions.forEach((p) => allPermissions.add(p));
  });
  return allPermissions.has(permission as Permission);
}

// =====================================================
// ROUTE PERMISSION HELPERS
// =====================================================

/**
 * Permission requirements for common routes
 */
export const ROUTE_PERMISSIONS: Record<string, Permission[]> = {
  '/dashboard/developer/engines/new': ['engine:create'],
  '/dashboard/developer/engines': ['engine:view'],
  '/dashboard/workspace/assemble': ['agent:create'],
  '/dashboard/workspace/my-agents': ['agent:view'],
  '/dashboard/deployments': ['deployment:view'],
  '/dashboard/analytics': ['analytics:view'],
  '/dashboard/billing': ['billing:view'],
  '/admin/users': ['admin:users'],
  '/admin/tenants': ['admin:tenants'],
  '/admin/settings': ['admin:settings'],
};

/**
 * Check if user can access a specific route
 * @param role - User role
 * @param pathname - Route path
 * @returns True if user can access route
 */
export function canAccessRoute(role: UserRole | null, pathname: string): boolean {
  // Public routes
  if (pathname.startsWith('/login') || pathname.startsWith('/register')) {
    return true;
  }

  if (!role) return false;

  // Check route-specific permissions
  for (const [route, permissions] of Object.entries(ROUTE_PERMISSIONS)) {
    if (pathname.startsWith(route)) {
      return hasAnyPermission(role, permissions);
    }
  }

  // Dashboard base route - all authenticated users can access
  if (pathname === '/dashboard' || pathname.startsWith('/dashboard/')) {
    return true;
  }

  return false;
}

// =====================================================
// UTILITY FUNCTIONS
// =====================================================

/**
 * Get a user-friendly description of what a permission allows
 * @param permission - Permission to describe
 * @returns Human-readable description
 */
export function getPermissionDescription(permission: Permission): string {
  const descriptions: Record<Permission, string> = {
    'engine:create': 'Create new agent engines',
    'engine:update': 'Modify existing engines',
    'engine:delete': 'Delete engines',
    'engine:publish': 'Publish engines to marketplace',
    'engine:view': 'View engine details',
    'agent:create': 'Assemble new agents from engines',
    'agent:update': 'Modify agent configurations',
    'agent:delete': 'Delete agents',
    'agent:deploy': 'Deploy agents as applications',
    'agent:view': 'View agent details',
    'agent:share': 'Share agents with others',
    'deployment:view': 'View deployment information',
    'deployment:use': 'Interact with deployed agents',
    'deployment:manage': 'Manage deployment settings',
    'analytics:view': 'View analytics and metrics',
    'analytics:export': 'Export analytics data',
    'billing:view': 'View billing information',
    'billing:manage': 'Manage billing and subscriptions',
    'team:create': 'Create new teams',
    'team:manage': 'Manage team members',
    'team:view': 'View team information',
    'admin:users': 'Manage platform users',
    'admin:tenants': 'Manage platform tenants',
    'admin:settings': 'Configure platform settings',
  };

  return descriptions[permission] || permission;
}

/**
 * Group permissions by category
 * @returns Permissions grouped by category
 */
export function getPermissionsByCategory(): Record<string, Permission[]> {
  return {
    Engines: [
      'engine:create',
      'engine:update',
      'engine:delete',
      'engine:publish',
      'engine:view',
    ],
    Agents: [
      'agent:create',
      'agent:update',
      'agent:delete',
      'agent:deploy',
      'agent:view',
      'agent:share',
    ],
    Deployments: [
      'deployment:view',
      'deployment:use',
      'deployment:manage',
    ],
    Analytics: [
      'analytics:view',
      'analytics:export',
    ],
    Billing: [
      'billing:view',
      'billing:manage',
    ],
    Teams: [
      'team:create',
      'team:manage',
      'team:view',
    ],
    Admin: [
      'admin:users',
      'admin:tenants',
      'admin:settings',
    ],
  };
}

// =====================================================
// DEFAULT EXPORT
// =====================================================

export default {
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  getRolePermissions,
  canAccessRoute,
  getPermissionDescription,
  getPermissionsByCategory,
  ROLE_DEFINITIONS,
  ROLE_PERMISSIONS,
};
