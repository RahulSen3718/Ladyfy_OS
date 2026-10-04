export type UserRole = "OWNER" | "ADMIN" | "EMPLOYEE" | "CLIENT";

export type EmployeeSubRole =
  | "SALES"
  | "SCRIPT_WRITER"
  | "SHOOT_MANAGER"
  | "EDITOR";

export type Permission =
  // Governance & Global
  | "manage:system"
  | "manage:rbac"
  | "view:audit_logs"
  | "view:executive_analytics"

  // Employees & Team
  | "manage:employees"
  | "view:employees"

  // Clients
  | "create:clients"
  | "read:clients"
  | "update:clients"
  | "delete:clients"

  // Orders & Packages
  | "manage:orders"
  | "view:orders"

  // Scripting
  | "create:scripts"
  | "edit:scripts"
  | "review:scripts"
  | "approve:scripts"

  // Creators
  | "manage:creators"
  | "view:creators"
  | "book:creators"

  // Shoots
  | "schedule:shoots"
  | "manage:shoots"
  | "view:shoots"

  // Video Production & Editing
  | "manage:video_pipeline"
  | "edit:assigned_videos"
  | "view:videos"
  | "qa:videos"
  | "deliver:videos"

  // Tasks
  | "manage:tasks"
  | "view:tasks"

  // Financials
  | "manage:payments"
  | "view:financials"
  | "manage:expenses"
  | "manage:creator_payouts"

  // Support Tickets
  | "manage:support_tickets"
  | "create:support_tickets"
  | "view:support_tickets"

  // Client Portal Isolated Permissions
  | "portal:view_own_orders"
  | "portal:review_own_scripts"
  | "portal:review_own_videos"
  | "portal:download_deliveries"
  | "portal:view_own_invoices"
  | "portal:manage_own_tickets";

export interface AuthUserSession {
  id: string;
  supabaseId: string;
  email: string;
  fullName: string;
  role: UserRole;
  employeeSubRole?: EmployeeSubRole | null;
  clientId?: string | null;
  employeeId?: string | null;
  isActive: boolean;
}
