import { User } from '../../../services/firebase/userService';

// define role-based permissions for scheduling features
export interface SchedulingPermissions {
  canViewShifts: boolean;
  canCreateShifts: boolean;
  canEditShifts: boolean;
  canDeleteShifts: boolean;
  canAssignUsers: boolean;
  canSubmitAvailability: boolean;
  canViewTeamAvailability: boolean;
}

// define the different role types
export type UserRole = 'admin' | 'coordinator' | 'team_member' | 'support';

/**
 * returns the permissions for a user based on their role
 */
export const getSchedulingPermissions = (userRole?: UserRole): SchedulingPermissions => {
  switch (userRole) {
    case 'admin':
      return {
        canViewShifts: true,
        canCreateShifts: true,
        canEditShifts: true,
        canDeleteShifts: true,
        canAssignUsers: true,
        canSubmitAvailability: true,
        canViewTeamAvailability: true
      };
    case 'coordinator':
      return {
        canViewShifts: true,
        canCreateShifts: true,
        canEditShifts: true,
        canDeleteShifts: true,
        canAssignUsers: true,
        canSubmitAvailability: true,
        canViewTeamAvailability: true
      };
    case 'team_member':
      return {
        canViewShifts: true,
        canCreateShifts: false,
        canEditShifts: false,
        canDeleteShifts: false,
        canAssignUsers: false,
        canSubmitAvailability: true,
        canViewTeamAvailability: false
      };
    case 'support':
      return {
        canViewShifts: true,
        canCreateShifts: false,
        canEditShifts: false,
        canDeleteShifts: false,
        canAssignUsers: false,
        canSubmitAvailability: true,
        canViewTeamAvailability: false
      };
    default:
      // default to most restrictive permissions if role is unknown
      return {
        canViewShifts: true,
        canCreateShifts: false,
        canEditShifts: false,
        canDeleteShifts: false,
        canAssignUsers: false,
        canSubmitAvailability: true,
        canViewTeamAvailability: false
      };
  }
};

/**
 * check if a user has a specific permission
 */
export const hasPermission = (
  user: User | null, 
  permission: keyof SchedulingPermissions
): boolean => {
  if (!user) return false;
  
  const permissions = getSchedulingPermissions(user.role);
  return permissions[permission];
};

/**
 * get user-specific shifts based on role
 */
export const getFilteredShifts = (shifts: any[], user: User | null): any[] => {
  if (!user) return [];
  
  // admin and coordinators can see all shifts
  if (user.role === 'admin' || user.role === 'coordinator') {
    return shifts;
  }
  
  // team members and support staff only see shifts they're assigned to
  return shifts.filter(shift => {
    if (!shift.assignedUsers) return false;
    return shift.assignedUsers.some((assigned: any) => assigned.userId === user.id);
  });
};

/**
 * determines if a user can interact with a specific shift
 */
export const canModifyShift = (shift: any, user: User | null): boolean => {
  if (!user) return false;
  
  // admins and coordinators can modify any shift
  if (user.role === 'admin' || user.role === 'coordinator') {
    return true;
  }
  
  // team members and support can't modify shifts
  return false;
};