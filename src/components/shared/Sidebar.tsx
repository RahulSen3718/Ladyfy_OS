"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Package,
  FileText,
  UserCheck,
  Clapperboard,
  Film,
  Users2,
  CheckSquare,
  DollarSign,
  LifeBuoy,
  ShieldAlert,
  ExternalLink,
  ChevronRight,
  Flame,
  LogOut,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { logoutAction, getCurrentSessionAction } from "@/actions/auth.actions";
import { AuthUserSession } from "@/types/rbac.types";

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  countKey?: string;
  highlight?: boolean;
  isExternal?: boolean;
}

interface NavGroup {
  category: string;
  items: NavItem[];
}

const NAVIGATION_ITEMS: NavGroup[] = [
  {
    category: "Operations Core",
    items: [
      { name: "Executive Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { name: "Clients Directory", href: "/clients", icon: Users, countKey: "clients" },
      { name: "Orders & Packages", href: "/orders", icon: Package },
      { name: "Scripting Hub", href: "/scripts", icon: FileText },
      { name: "Creators Roster", href: "/creators", icon: UserCheck },
      { name: "Shoots & Calendar", href: "/shoots", icon: Clapperboard },
      { name: "Production Pipeline", href: "/production", icon: Film, highlight: true },
    ],
  },
  {
    category: "Management & Finance",
    items: [
      { name: "Financials & Ledger", href: "/financials", icon: DollarSign },
      { name: "Team & Performance", href: "/team", icon: Users2 },
      { name: "Internal Tasks", href: "/tasks", icon: CheckSquare },
      { name: "Support Tickets", href: "/tickets", icon: LifeBuoy },
    ],
  },
  {
    category: "External Portals",
    items: [
      { name: "Client Portal (Isolated)", href: "/portal", icon: ExternalLink, isExternal: true },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<AuthUserSession | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    async function loadUser() {
      const res = await getCurrentSessionAction();
      if (res.success && res.session) {
        setCurrentUser(res.session);
      }
    }
    loadUser();
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    const res = await logoutAction();
    if (res.success) {
      toast.success("Logged out successfully");
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
    <aside className="w-64 shrink-0 bg-[#111111] border-r border-neutral-800/80 flex flex-col justify-between h-screen sticky top-0 z-40 select-none">
      {/* Brand Header */}
      <div>
        <div className="h-16 flex items-center px-6 border-b border-neutral-800/80 gap-3">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-black font-black text-xl shadow-lg shadow-amber-500/20">
            L
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight text-white">
                LEADYFY<span className="text-amber-500 font-normal">.OS</span>
              </span>
              <Badge variant="default" className="text-[10px] px-1.5 py-0 bg-amber-500/10 text-amber-400 border border-amber-500/30">
                PROD
              </Badge>
            </div>
            <p className="text-[11px] text-neutral-400 font-medium">
              Agency Operations SaaS
            </p>
          </div>
        </div>

        {/* Navigation Section */}
        <nav className="p-4 space-y-6 overflow-y-auto max-h-[calc(100vh-140px)]">
          {NAVIGATION_ITEMS.map((group) => (
            <div key={group.category} className="space-y-1">
              <h4 className="px-3 text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                {group.category}
              </h4>
              <div className="mt-1 space-y-1">
                {group.items.map((item) => {
                  const isActive =
                    item.href === "/dashboard"
                      ? pathname === "/dashboard" || pathname === "/"
                      : pathname.startsWith(item.href);
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all group",
                        isActive
                          ? "bg-amber-500/15 text-amber-400 border border-amber-500/30 font-semibold"
                          : "text-neutral-300 hover:text-white hover:bg-neutral-800/60"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Icon
                          className={cn(
                            "h-4 w-4 transition-transform group-hover:scale-110",
                            isActive ? "text-amber-400" : "text-neutral-400"
                          )}
                        />
                        <span>{item.name}</span>
                      </div>
                      {item.highlight && (
                        <span className="flex h-2 w-2 rounded-full bg-amber-500 shadow-[0_0_8px_#F59E0B]" />
                      )}
                      {item.isExternal && (
                        <ChevronRight className="h-3.5 w-3.5 opacity-50" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Footer Role / Mode Status & Quick Logout */}
      <div className="p-4 border-t border-neutral-800/80 bg-[#0E0E0E]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="h-8 w-8 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center font-bold text-xs text-amber-400 shrink-0">
              {getUserInitials()}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">
                {currentUser?.fullName || "Agency Admin"}
              </p>
              <p className="text-[10px] text-neutral-400 truncate">
                {currentUser?.role === "EMPLOYEE"
                  ? currentUser?.employeeSubRole || "Staff"
                  : currentUser?.role || "OWNER"}
              </p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            disabled={isLoggingOut}
            title="Log Out"
            className="h-8 w-8 text-neutral-400 hover:text-red-400 hover:bg-neutral-800 shrink-0"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </aside>
  );
}
