"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ExternalLink, ShieldCheck, LifeBuoy, ArrowLeft, Building2, LogOut, User } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { logoutAction, getCurrentSessionAction } from "@/actions/auth.actions";
import { AuthUserSession } from "@/types/rbac.types";

export function PortalHeader() {
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

  return (
    <header className="h-16 px-6 sm:px-12 border-b border-neutral-800/80 bg-[#111111]/90 backdrop-blur-md flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-black font-black text-lg shadow-lg shadow-cyan-500/20">
          C
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-base tracking-tight text-white">
              LEADYFY<span className="text-cyan-400 font-normal">.PORTAL</span>
            </span>
            <Badge variant="pipelineReview" className="text-[10px] px-1.5 py-0">
              CLIENT ACCESS
            </Badge>
          </div>
          <p className="text-[11px] text-neutral-400">
            {currentUser?.fullName ? `Logged in: ${currentUser.fullName}` : "Isolated Client Deliverables & Sign-Off Hub"}
          </p>
        </div>
      </div>

      {/* Client Top Controls */}
      <div className="flex items-center gap-3">
        <span className="text-xs text-emerald-400 flex items-center gap-1.5 font-medium hidden sm:flex">
          <ShieldCheck className="h-4 w-4" /> Secure Client Portal
        </span>

        {currentUser?.role !== "CLIENT" && (
          <Link href="/dashboard">
            <Button
              variant="outline"
              size="sm"
              className="text-xs border-neutral-700 bg-neutral-900 text-neutral-300 hover:text-white gap-1.5"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Return to Agency View
            </Button>
          </Link>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="text-xs border-neutral-800 bg-neutral-900/90 text-neutral-300 hover:text-red-400 hover:border-red-500/40 gap-1.5"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">{isLoggingOut ? "Logging out..." : "Log Out"}</span>
        </Button>
      </div>
    </header>
  );
}
