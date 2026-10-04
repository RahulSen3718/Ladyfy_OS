"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  Search,
  Plus,
  Shield,
  Layers,
  Sparkles,
  CheckCircle,
  LogOut,
  User,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logoutAction, switchRoleAction, getCurrentSessionAction } from "@/actions/auth.actions";
import { AuthUserSession, EmployeeSubRole, UserRole } from "@/types/rbac.types";

interface HeaderProps {
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function Header({ title, subtitle, actions }: HeaderProps) {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<AuthUserSession | null>(null);
  const [activeRole, setActiveRole] = useState<string>("OWNER");
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    async function loadUser() {
      const res = await getCurrentSessionAction();
      if (res.success && res.session) {
        setCurrentUser(res.session);
        setActiveRole(
          res.session.role === "EMPLOYEE" && res.session.employeeSubRole
            ? res.session.employeeSubRole
            : res.session.role
        );
      }
    }
    loadUser();
  }, []);

  const handleRoleSwitch = async (role: UserRole, subRole?: EmployeeSubRole) => {
    setActiveRole(subRole || role);
    const res = await switchRoleAction(role, subRole);
    if (res.success && res.session) {
      setCurrentUser(res.session);
      toast.success(`Switched role view to ${subRole || role}`);
      if (role === "CLIENT") {
        router.push("/portal");
      }
      router.refresh();
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    const res = await logoutAction();
    if (res.success) {
      toast.success("Successfully logged out");
      router.push("/login");
      router.refresh();
    } else {
      toast.error(res.error || "Failed to log out");
      setIsLoggingOut(false);
    }
  };

  const getUserInitials = () => {
    if (!currentUser?.fullName) return "AD";
    const parts = currentUser.fullName.split(" ");
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return currentUser.fullName.substring(0, 2).toUpperCase();
  };

  return (
    <header className="h-16 px-8 border-b border-neutral-800/80 bg-[#111111]/80 backdrop-blur-md flex items-center justify-between sticky top-0 z-30">
      {/* Page Title & Breadcrumb */}
      <div>
        <h1 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
          {title || "Dashboard Overview"}
        </h1>
        {subtitle && (
          <p className="text-xs text-neutral-400 font-medium">{subtitle}</p>
        )}
      </div>

      {/* Top Controls */}
      <div className="flex items-center gap-3">
        {/* Role Simulator Selector for Testing RBAC Tiers */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-2 border-neutral-700 bg-neutral-900/80 text-xs font-semibold hover:border-amber-500/50 text-neutral-300 hover:text-white"
            >
              <Shield className="h-3.5 w-3.5 text-amber-400" />
              Role: <span className="text-amber-400 font-bold">{activeRole}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-neutral-900 border-neutral-800">
            <DropdownMenuLabel className="text-xs text-neutral-400">
              Simulate User Role (RBAC View)
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-neutral-800" />
            <DropdownMenuItem
              onClick={() => handleRoleSwitch("OWNER")}
              className="text-xs cursor-pointer focus:bg-amber-500/20 focus:text-amber-300"
            >
              <span className="font-bold">OWNER</span> (Super Admin / Full Financials)
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleRoleSwitch("ADMIN")}
              className="text-xs cursor-pointer focus:bg-amber-500/20 focus:text-amber-300"
            >
              <span className="font-bold">ADMIN</span> (Operations Manager)
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleRoleSwitch("EMPLOYEE", "SCRIPT_WRITER")}
              className="text-xs cursor-pointer focus:bg-amber-500/20 focus:text-amber-300"
            >
              <span className="font-bold">SCRIPT WRITER</span> (Assigned drafts)
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleRoleSwitch("EMPLOYEE", "SHOOT_MANAGER")}
              className="text-xs cursor-pointer focus:bg-amber-500/20 focus:text-amber-300"
            >
              <span className="font-bold">SHOOT MANAGER</span> (Logistics/Roster)
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleRoleSwitch("EMPLOYEE", "EDITOR")}
              className="text-xs cursor-pointer focus:bg-amber-500/20 focus:text-amber-300"
            >
              <span className="font-bold">EDITOR</span> (Video Queue & Urgency)
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleRoleSwitch("CLIENT")}
              className="text-xs cursor-pointer focus:bg-amber-500/20 focus:text-amber-300 text-cyan-400"
            >
              <span className="font-bold">CLIENT</span> (Isolated Portal View)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Global Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 relative text-neutral-400 hover:text-white hover:bg-neutral-800"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-amber-500 ring-2 ring-[#111111]" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 bg-neutral-900 border-neutral-800 p-2">
            <div className="flex items-center justify-between px-2 py-1.5 border-b border-neutral-800">
              <span className="text-xs font-bold text-white">Agency Alerts</span>
              <Badge variant="warning" className="text-[10px] px-1.5 py-0">
                2 New
              </Badge>
            </div>
            <div className="py-2 space-y-2">
              <div className="p-2 rounded bg-neutral-800/40 text-xs border border-neutral-800">
                <p className="font-semibold text-amber-400">Client Approval Received</p>
                <p className="text-neutral-400 text-[11px]">
                  Nike Summer UGC #3 approved by client. Auto-moved to Final Delivery.
                </p>
              </div>
              <div className="p-2 rounded bg-neutral-800/40 text-xs border border-neutral-800">
                <p className="font-semibold text-blue-400">Shoot Scheduled Tomorrow</p>
                <p className="text-neutral-400 text-[11px]">
                  Location: Bandra Studio. Creator: Sarah Jenkins confirmed.
                </p>
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Profile & Logout Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 pl-2 pr-2.5 gap-2 border border-neutral-800 hover:border-neutral-700 bg-neutral-900/60 hover:bg-neutral-800"
            >
              <div className="h-5 w-5 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-[10px] font-bold text-amber-400">
                {getUserInitials()}
              </div>
              <span className="text-xs font-semibold text-neutral-200 max-w-[110px] truncate hidden md:inline">
                {currentUser?.fullName || "Account"}
              </span>
              <ChevronDown className="h-3 w-3 text-neutral-500" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-neutral-900 border-neutral-800 p-2">
            <DropdownMenuLabel className="p-2">
              <div className="flex flex-col space-y-1">
                <p className="text-xs font-bold text-white leading-none truncate">
                  {currentUser?.fullName || "Super Admin"}
                </p>
                <p className="text-[11px] leading-none text-neutral-400 truncate">
                  {currentUser?.email || "owner@leadyfy.io"}
                </p>
                <div className="pt-1">
                  <Badge variant="outline" className="text-[9px] border-amber-500/30 text-amber-400 px-1 py-0">
                    {currentUser?.role || "OWNER"}
                  </Badge>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-neutral-800" />
            <DropdownMenuItem
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="text-xs cursor-pointer text-red-400 focus:bg-red-500/20 focus:text-red-300 gap-2 font-semibold"
            >
              <LogOut className="h-3.5 w-3.5" />
              {isLoggingOut ? "Logging out..." : "Log Out"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Dynamic Actions passed by Page */}
        {actions}
      </div>
    </header>
  );
}
