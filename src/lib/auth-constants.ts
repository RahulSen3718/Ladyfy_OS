import { EmployeeSubRole, UserRole } from "@/types/rbac.types";

export const AUTH_COOKIE_NAME = "leadyfy_session";

export interface DemoAccount {
  id: string;
  role: UserRole;
  email: string;
  fullName: string;
  title: string;
  description: string;
  subRole: EmployeeSubRole | null;
  avatar: string;
  badgeColor: string;
}

export const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    id: "demo-owner",
    role: "OWNER",
    email: "owner@leadyfy.io",
    fullName: "Super Admin (Owner)",
    title: "Agency Founder & CEO",
    description: "Full master access to all operations, financials, ledger, and settings.",
    subRole: null,
    avatar: "👑",
    badgeColor: "amber",
  },
  {
    id: "demo-sales",
    role: "EMPLOYEE",
    email: "aarav@leadyfy.io",
    fullName: "Aarav Sharma",
    title: "Head of Sales & Deals",
    description: "Client acquisition, onboarding pipelines, contracts, and package deals.",
    subRole: "SALES",
    avatar: "💼",
    badgeColor: "emerald",
  },
  {
    id: "demo-writer",
    role: "EMPLOYEE",
    email: "devika@leadyfy.io",
    fullName: "Devika Sen",
    title: "Lead Creative Scriptwriter",
    description: "UGC video scripts, hook drafting, visual concepting, and revisions.",
    subRole: "SCRIPT_WRITER",
    avatar: "✍️",
    badgeColor: "purple",
  },
  {
    id: "demo-shoot",
    role: "EMPLOYEE",
    email: "rahul@leadyfy.io",
    fullName: "Rahul Varma",
    title: "Shoot & Logistics Manager",
    description: "Creator rostering, studio logistics, shoot schedules, and product tracking.",
    subRole: "SHOOT_MANAGER",
    avatar: "🎬",
    badgeColor: "blue",
  },
  {
    id: "demo-editor",
    role: "EMPLOYEE",
    email: "ankit@leadyfy.io",
    fullName: "Ankit Roy",
    title: "Senior Post-Production Editor",
    description: "Editing queue, urgency-based cuts, captioning, and client revision QA.",
    subRole: "EDITOR",
    avatar: "✂️",
    badgeColor: "orange",
  },
  {
    id: "demo-client",
    role: "CLIENT",
    email: "rohan@zenithwear.com",
    fullName: "Rohan Varma",
    title: "Zenith Wear (Brand Owner)",
    description: "Isolated client portal to review drafts, stamp timestamps, and sign off.",
    subRole: null,
    avatar: "🏢",
    badgeColor: "cyan",
  },
];
