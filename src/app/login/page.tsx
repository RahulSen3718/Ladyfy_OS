"use client";

import { useState, useTransition, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Lock,
  Mail,
  User,
  Building2,
  Sparkles,
  ArrowRight,
  Eye,
  EyeOff,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Briefcase,
  Layers,
  ChevronRight,
  Laptop,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { loginAction, signupAction, demoLoginAction } from "@/actions/auth.actions";
import { DEMO_ACCOUNTS } from "@/lib/auth-constants";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") === "signup" ? "signup" : "login";
  const redirectTarget = searchParams.get("redirect") || "/dashboard";

  const [activeTab, setActiveTab] = useState<"login" | "signup">(initialTab);
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [demoPendingId, setDemoPendingId] = useState<string | null>(null);

  // Sign In Form State
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);

  // Sign Up Form State
  const [fullName, setFullName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [accountType, setAccountType] = useState<"EMPLOYEE" | "CLIENT">("EMPLOYEE");
  const [employeeSubRole, setEmployeeSubRole] = useState<
    "SALES" | "SCRIPT_WRITER" | "SHOOT_MANAGER" | "EDITOR"
  >("SALES");
  const [companyName, setCompanyName] = useState("");
  const [brandName, setBrandName] = useState("");

  const handleCredentialsLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      toast.error("Please fill in both email and password.");
      return;
    }

    startTransition(async () => {
      const res = await loginAction({
        email: loginEmail,
        password: loginPassword,
        rememberMe,
      });

      if (res.success && res.destination) {
        toast.success(`Welcome back, ${res.session?.fullName || "User"}!`);
        router.push(redirectTarget !== "/dashboard" ? redirectTarget : res.destination);
        router.refresh();
      } else {
        toast.error(res.error || "Authentication failed.");
      }
    });
  };

  const handleDemoLogin = (demo: typeof DEMO_ACCOUNTS[0]) => {
    setDemoPendingId(demo.id);
    startTransition(async () => {
      const res = await demoLoginAction(demo.id);
      if (res.success && res.destination) {
        toast.success(`Logged in as ${demo.fullName} (${demo.title})`);
        router.push(redirectTarget !== "/dashboard" ? redirectTarget : res.destination);
        router.refresh();
      } else {
        toast.error(res.error || "Demo login failed");
        setDemoPendingId(null);
      }
    });
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !signupEmail || !signupPassword) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (signupPassword.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    startTransition(async () => {
      const res = await signupAction({
        fullName,
        email: signupEmail,
        password: signupPassword,
        role: accountType,
        employeeSubRole: accountType === "EMPLOYEE" ? employeeSubRole : undefined,
        companyName: accountType === "CLIENT" ? companyName : undefined,
        brandName: accountType === "CLIENT" ? brandName : undefined,
      });

      if (res.success && res.destination) {
        toast.success(`Account created! Welcome to Leadyfy OS, ${fullName}`);
        router.push(res.destination);
        router.refresh();
      } else {
        toast.error(res.error || "Sign up failed.");
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-neutral-100 flex flex-col justify-between selection:bg-amber-500/30 selection:text-amber-200 relative overflow-hidden">
      {/* Background Decorative Gradients & Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-gradient-to-b from-amber-500/10 via-amber-600/5 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-amber-500/5 blur-3xl pointer-events-none -z-10" />
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-cyan-500/5 blur-3xl pointer-events-none -z-10" />

      {/* Top Brand Navbar */}
      <header className="px-6 sm:px-12 py-6 flex items-center justify-between border-b border-neutral-800/40 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center text-black font-black text-xl shadow-lg shadow-amber-500/25 ring-1 ring-amber-400/50">
            L
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-xl tracking-tight text-white">
                LEADYFY<span className="text-amber-500 font-normal">.OS</span>
              </span>
              <Badge variant="default" className="text-[10px] px-1.5 py-0 bg-amber-500/10 text-amber-400 border border-amber-500/30">
                v2.6 Enterprise
              </Badge>
            </div>
            <p className="text-[11px] text-neutral-400 font-medium hidden sm:block">
              Unified Operations SaaS for UGC & Digital Marketing Agencies
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-neutral-400 bg-neutral-900/80 px-3 py-1.5 rounded-full border border-neutral-800">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <span className="font-medium text-neutral-300">Protected Cloud OS</span>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8 my-auto">
        <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left / Main Auth Card */}
          <div className="lg:col-span-7 bg-[#121212]/90 border border-neutral-800/90 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 rounded-t-2xl" />

            {/* Header Tabs */}
            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-extrabold text-white tracking-tight">
                    {activeTab === "login" ? "Sign In to Operations" : "Create Agency Account"}
                  </h1>
                  <p className="text-xs text-neutral-400 mt-1">
                    {activeTab === "login"
                      ? "Enter your agency credentials or choose a 1-click demo profile."
                      : "Set up your operator or client workspace on Leadyfy OS."}
                  </p>
                </div>
              </div>

              {/* Tab Selector */}
              <div className="grid grid-cols-2 p-1 bg-neutral-950 rounded-xl border border-neutral-800 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setActiveTab("login")}
                  className={`py-2 px-4 rounded-lg transition-all ${
                    activeTab === "login"
                      ? "bg-amber-500 text-black shadow-md font-bold"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("signup")}
                  className={`py-2 px-4 rounded-lg transition-all ${
                    activeTab === "signup"
                      ? "bg-amber-500 text-black shadow-md font-bold"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  Create Account
                </button>
              </div>
            </div>

            {/* TAB 1: LOGIN FORM */}
            {activeTab === "login" && (
              <form onSubmit={handleCredentialsLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-neutral-300">Work Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-neutral-500" />
                    <Input
                      type="email"
                      placeholder="e.g. owner@leadyfy.io or your email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="pl-9 bg-neutral-950 border-neutral-800 text-sm h-10 text-white placeholder:text-neutral-600 focus-visible:border-amber-500 focus-visible:ring-amber-500"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-semibold text-neutral-300">Password</Label>
                    <span className="text-[11px] text-amber-400/80 hover:text-amber-400 cursor-pointer">
                      Forgot Password?
                    </span>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-neutral-500" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="pl-9 pr-10 bg-neutral-950 border-neutral-800 text-sm h-10 text-white placeholder:text-neutral-600 focus-visible:border-amber-500 focus-visible:ring-amber-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-neutral-500 hover:text-neutral-300"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs py-1">
                  <label className="flex items-center gap-2 cursor-pointer text-neutral-300">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-neutral-700 bg-neutral-900 text-amber-500 focus:ring-amber-500 accent-amber-500"
                    />
                    Keep me signed in for 7 days
                  </label>
                </div>

                <Button
                  type="submit"
                  disabled={isPending}
                  className="w-full h-11 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-sm shadow-lg shadow-amber-500/20 gap-2 transition-all mt-2"
                >
                  {isPending && !demoPendingId ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      Authenticating...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Sign In to Dashboard <ArrowRight className="h-4 w-4" />
                    </span>
                  )}
                </Button>
              </form>
            )}

            {/* TAB 2: SIGNUP FORM */}
            {activeTab === "signup" && (
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-neutral-300">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-neutral-500" />
                    <Input
                      type="text"
                      placeholder="e.g. Vikram Singhania"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="pl-9 bg-neutral-950 border-neutral-800 text-sm h-10 text-white placeholder:text-neutral-600"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-neutral-300">Work Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-neutral-500" />
                    <Input
                      type="email"
                      placeholder="name@company.com"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      className="pl-9 bg-neutral-950 border-neutral-800 text-sm h-10 text-white placeholder:text-neutral-600"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-neutral-300">Create Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-neutral-500" />
                    <Input
                      type="password"
                      placeholder="At least 6 characters"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      className="pl-9 bg-neutral-950 border-neutral-800 text-sm h-10 text-white placeholder:text-neutral-600"
                      required
                    />
                  </div>
                </div>

                {/* Account Type Selector */}
                <div className="space-y-2 pt-1">
                  <Label className="text-xs font-semibold text-neutral-300">Account Type</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setAccountType("EMPLOYEE")}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        accountType === "EMPLOYEE"
                          ? "border-amber-500/80 bg-amber-500/10 text-white"
                          : "border-neutral-800 bg-neutral-950 text-neutral-400 hover:border-neutral-700"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-amber-400" />
                        <span className="text-xs font-bold text-white">Agency Team</span>
                      </div>
                      <p className="text-[10px] text-neutral-400 mt-1">
                        Operations, Sales, Creator Lead, Editor
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setAccountType("CLIENT")}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        accountType === "CLIENT"
                          ? "border-cyan-500/80 bg-cyan-500/10 text-white"
                          : "border-neutral-800 bg-neutral-950 text-neutral-400 hover:border-neutral-700"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-cyan-400" />
                        <span className="text-xs font-bold text-white">Brand / Client</span>
                      </div>
                      <p className="text-[10px] text-neutral-400 mt-1">
                        Isolated Portal to review & approve videos
                      </p>
                    </button>
                  </div>
                </div>

                {/* Sub-Role Selector for Employee */}
                {accountType === "EMPLOYEE" && (
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-neutral-300">Department / Role</Label>
                    <select
                      value={employeeSubRole}
                      onChange={(e) => setEmployeeSubRole(e.target.value as any)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg h-10 px-3 text-xs text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="SALES">Growth & Client Sales (Aarav Team)</option>
                      <option value="SCRIPT_WRITER">Creative Scripting & Hooks (Devika Team)</option>
                      <option value="SHOOT_MANAGER">Shoot Logistics & Creators (Rahul Team)</option>
                      <option value="EDITOR">Post-Production Video Editor (Ankit Team)</option>
                    </select>
                  </div>
                )}

                {/* Company info for Client */}
                {accountType === "CLIENT" && (
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <Label className="text-xs font-semibold text-neutral-300">Company Name</Label>
                      <Input
                        type="text"
                        placeholder="e.g. Zenith Apparel Pvt Ltd"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="bg-neutral-950 border-neutral-800 text-xs h-9 text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs font-semibold text-neutral-300">Brand Name</Label>
                      <Input
                        type="text"
                        placeholder="e.g. Zenith Wear"
                        value={brandName}
                        onChange={(e) => setBrandName(e.target.value)}
                        className="bg-neutral-950 border-neutral-800 text-xs h-9 text-white"
                      />
                    </div>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isPending}
                  className="w-full h-11 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-sm shadow-lg shadow-amber-500/20 gap-2 transition-all mt-2"
                >
                  {isPending ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      Creating Account...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Create Account & Launch OS <ArrowRight className="h-4 w-4" />
                    </span>
                  )}
                </Button>
              </form>
            )}
          </div>

          {/* Right Side: 1-Click Quick Demo Access Card */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-[#141414]/90 border border-neutral-800/90 rounded-2xl p-5 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-800/80 mb-3">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-amber-400 animate-pulse" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    1-Click Demo Profiles
                  </span>
                </div>
                <Badge variant="outline" className="text-[10px] border-amber-500/30 text-amber-400">
                  Instant Test Login
                </Badge>
              </div>

              <p className="text-xs text-neutral-400 mb-3 leading-relaxed">
                Click any pre-configured agency profile to instantly log in with exact RBAC permissions:
              </p>

              {/* Demo Accounts List */}
              <div className="space-y-2">
                {DEMO_ACCOUNTS.map((demo) => {
                  const isLoading = isPending && demoPendingId === demo.id;

                  return (
                    <button
                      key={demo.id}
                      type="button"
                      disabled={isPending}
                      onClick={() => handleDemoLogin(demo)}
                      className="w-full p-2.5 rounded-xl bg-neutral-900/80 hover:bg-neutral-800/90 border border-neutral-800/80 hover:border-amber-500/40 text-left transition-all flex items-center justify-between group disabled:opacity-50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-neutral-950 border border-neutral-700/60 flex items-center justify-center text-base shrink-0 group-hover:scale-105 transition-transform">
                          {demo.avatar}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-xs font-bold text-white truncate">
                              {demo.fullName}
                            </p>
                            <span
                              className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                                demo.badgeColor === "amber"
                                  ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                                  : demo.badgeColor === "cyan"
                                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                                  : "bg-neutral-800 text-neutral-300 border border-neutral-700"
                              }`}
                            >
                              {demo.role === "EMPLOYEE" ? demo.subRole : demo.role}
                            </span>
                          </div>
                          <p className="text-[11px] text-neutral-400 truncate">
                            {demo.title}
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0 ml-2">
                        {isLoading ? (
                          <div className="h-4 w-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-neutral-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Feature Highlights */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 border border-neutral-800 text-xs text-neutral-400 space-y-2">
              <div className="flex items-center gap-2 text-white font-semibold">
                <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                Live Features Activated
              </div>
              <ul className="space-y-1 text-[11px]">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3 w-3 text-emerald-400 shrink-0" />
                  <span>Real-time Video Pipeline with Urgent Cut tags</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3 w-3 text-emerald-400 shrink-0" />
                  <span>Interactive Client Review Player with frame timestamps</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3 w-3 text-emerald-400 shrink-0" />
                  <span>Full Financial Ledger with 18% GST automatic calculator</span>
                </li>
              </ul>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-4 border-t border-neutral-800/40 text-center text-xs text-neutral-500 bg-neutral-950/60 backdrop-blur-sm">
        <p>Leadyfy OS &bull; Internal Enterprise Operations & UGC SaaS Platform &bull; All Rights Reserved</p>
      </footer>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center text-neutral-400 text-sm">Loading Leadyfy OS...</div>}>
      <LoginContent />
    </Suspense>
  );
}
