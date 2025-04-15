import { User } from '@/services/firebase/userService';

export interface SchedulingPermissions {
  canViewShifts: boolean;
  canCreateShifts: boolean;
  canEditShifts: boolean;
  canDeleteShifts: boolean;
  canAssignUsers: boolean;
  canSubmitAvailability: boolean;
  canViewTeamAvailability: boolean;
}

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
  
  if (user.role === 'admin' || user.role === 'coordinator') {
    return shifts;
  }
  
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
  
  if (user.role === 'admin' || user.role === 'coordinator') {
    return true;
  }
  
  return false;
};