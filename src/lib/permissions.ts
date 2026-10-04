import { AuthUserSession, EmployeeSubRole, Permission, UserRole } from "@/types/rbac.types";

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  OWNER: [
    "manage:system",
    "manage:rbac",
    "view:audit_logs",
    "view:executive_analytics",
    "manage:employees",
    "view:employees",
    "create:clients",
    "read:clients",
    "update:clients",
    "delete:clients",
    "manage:orders",
    "view:orders",
    "create:scripts",
    "edit:scripts",
    "review:scripts",
    "approve:scripts",
    "manage:creators",
    "view:creators",
    "book:creators",
    "schedule:shoots",
    "manage:shoots",
    "view:shoots",
    "manage:video_pipeline",
    "edit:assigned_videos",
    "view:videos",
    "qa:videos",
    "deliver:videos",
    "manage:tasks",
    "view:tasks",
    "manage:payments",
    "view:financials",
    "manage:expenses",
    "manage:creator_payouts",
    "manage:support_tickets",
    "create:support_tickets",
    "view:support_tickets",
  ],
  ADMIN: [
    "view:audit_logs",
    "view:employees",
    "create:clients",
    "read:clients",
    "update:clients",
    "manage:orders",
    "view:orders",
    "create:scripts",
    "edit:scripts",
    "review:scripts",
    "approve:scripts",
    "manage:creators",
    "view:creators",
    "book:creators",
    "schedule:shoots",
    "manage:shoots",
    "view:shoots",
    "manage:video_pipeline",
    "view:videos",
    "qa:videos",
    "manage:tasks",
    "view:tasks",
    "manage:payments",
    "view:financials",
    "manage:expenses",
    "manage:support_tickets",
    "create:support_tickets",
    "view:support_tickets",
  ],
  EMPLOYEE: [
    "read:clients",
    "view:orders",
    "view:tasks",
    "view:videos",
  ],
  CLIENT: [
    "portal:view_own_orders",
    "portal:review_own_scripts",
    "portal:review_own_videos",
    "portal:download_deliveries",
    "portal:view_own_invoices",
    "portal:manage_own_tickets",
  ],
};

const SUBROLE_EXTRA_PERMISSIONS: Record<EmployeeSubRole, Permission[]> = {
  SALES: [
    "create:clients",
    "update:clients",
    "manage:orders",
  ],
  SCRIPT_WRITER: [
    "create:scripts",
    "edit:scripts",
    "review:scripts",
  ],
  SHOOT_MANAGER: [
    "manage:creators",
    "view:creators",
    "book:creators",
    "schedule:shoots",
    "manage:shoots",
    "view:shoots",
  ],
  EDITOR: [
    "edit:assigned_videos",
    "view:videos",
    "qa:videos",
  ],
};

export function hasPermission(user: AuthUserSession, permission: Permission): boolean {
  if (!user || !user.isActive) return false;
  if (user.role === "OWNER") return true;

  const basePermissions = ROLE_PERMISSIONS[user.role] || [];
  if (basePermissions.includes(permission)) return true;

  if (user.role === "EMPLOYEE" && user.employeeSubRole) {
    const subPermissions = SUBROLE_EXTRA_PERMISSIONS[user.employeeSubRole] || [];
    return subPermissions.includes(permission);
  }

  return false;
}

export function assertPermission(user: AuthUserSession, permission: Permission): void {
  if (!hasPermission(user, permission)) {
    throw new Error(`Unauthorized: Missing required permission [${permission}]`);
  }
}
