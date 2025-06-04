// Define all available permissions in the system
export type Permission =
  | 'manage_users'
  | 'manage_patients'
  | 'view_patients'
  | 'add_patients'
  | 'assign_beds'
  | 'manage_medications'
  | 'view_medications'
  | 'manage_transports'
  | 'view_logs';

// Define all available roles
export type UserRole =
  | 'Administrator'
  | 'Doctor'
  | 'Nurse'
  | 'Pharmacist'
  | 'Transport Tech'
  | 'Receptionist';

// Permissions assigned to each role
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  'Administrator': [
    'manage_users',
    'manage_patients',
    'view_patients',
    'add_patients',
    'assign_beds',
    'manage_medications',
    'view_medications',
    'manage_transports',
    'view_logs'
  ],
  'Doctor': [
    'manage_patients',
    'view_patients',
    'manage_medications',
    'view_medications',
    'view_logs'
  ],
  'Nurse': [
    'view_patients',
    'view_medications',
    'view_logs'
  ],
  'Pharmacist': [
    'manage_medications',
    'view_medications',
    'view_logs'
  ],
  'Transport Tech': [
    'manage_transports',
    'view_logs'
  ],
  'Receptionist': [
    'add_patients',
    'assign_beds',
    'view_patients'
  ]
};

// Helper function to check if a role has a specific permission
export const hasPermission = (role: UserRole, permission: Permission): boolean => {
  if (!ROLE_PERMISSIONS[role]) return false;
  return ROLE_PERMISSIONS[role].includes(permission);
};

// Helper function to check if a user has any of the required permissions
export const hasAnyPermission = (role: UserRole, permissions: Permission[]): boolean => {
  return permissions.some(permission => hasPermission(role, permission));
};

// Helper function to check if a user has all of the required permissions
export const hasAllPermissions = (role: UserRole, permissions: Permission[]): boolean => {
  return permissions.every(permission => hasPermission(role, permission));
};

// Backend <-> Frontend role mapping
export const BACKEND_TO_FRONTEND_ROLE: Record<string, UserRole> = {
  M: 'Doctor',
  R: 'Receptionist',
  F: 'Pharmacist',
  A: 'Nurse',
  D: 'Administrator',
  // Add more if backend adds more roles
};

export const FRONTEND_TO_BACKEND_ROLE: Record<UserRole, string> = {
  'Doctor': 'M',
  'Receptionist': 'R',
  'Pharmacist': 'F',
  'Nurse': 'A',
  'Administrator': 'D',
  'Transport Tech': 'T', // Only if backend supports this
};

export function backendRoleToFrontend(backendRole: string): UserRole | undefined {
  return BACKEND_TO_FRONTEND_ROLE[backendRole];
}

export function frontendRoleToBackend(frontendRole: UserRole): string | undefined {
  return FRONTEND_TO_BACKEND_ROLE[frontendRole];
}
