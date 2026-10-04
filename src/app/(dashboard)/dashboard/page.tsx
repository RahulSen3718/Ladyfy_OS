import {
  Users,
  Film,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  Clapperboard,
  FileEdit,
  Clock,
  CheckCircle2,
  ArrowUpRight,
  Sparkles,
  Calendar,
  Layers,
  ChevronRight,
  Plus,
} from "lucide-react";
import { Header } from "@/components/shared/Header";
import { StatsCard } from "@/components/shared/StatsCard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { DashboardService } from "@/services/dashboard.service";
import Link from "next/link";

export default async function DashboardPage() {
  const metrics = await DashboardService.getExecutiveMetrics();

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title="Executive & Operations Dashboard"
        subtitle="Real-time agency throughput, video pipelines, and financial ledger"
        actions={
          <div className="flex items-center gap-2">
            <Link href="/clients">
              <Button size="sm" className="bg-amber-500 hover:bg-amber-400 text-black font-semibold gap-1.5 shadow-md shadow-amber-500/10">
                <Plus className="h-4 w-4" /> Add Client
              </Button>
            </Link>
            <Link href="/production">
              <Button size="sm" variant="dark" className="gap-1.5 border-neutral-700">
                <Film className="h-4 w-4 text-amber-400" /> Video Pipeline
              </Button>
            </Link>
          </div>
        }
      />

      <div className="p-8 space-y-8">
        {/* TOP ROW: EXECUTIVE KPI CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatsCard
            title="Estimated Net Profit"
            value={formatCurrency(metrics.financials.estimatedNetProfit)}
            subtitle="Formula: Revenue - Expenses - Payouts"
            icon={TrendingUp}
            amberAccent={true}
            trend={{ value: "+18.4% vs last mo", isPositive: true }}
          />

          <StatsCard
            title="Total Revenue Collected"
            value={formatCurrency(metrics.financials.totalRevenue)}
            subtitle={`Pending Receivables: ${formatCurrency(metrics.financials.pendingReceivables)}`}
            icon={DollarSign}
            trend={{ value: "+12.1%", isPositive: true }}
          />

          <StatsCard
            title="Videos Delivered (Month)"
            value={metrics.production.deliveredThisMonth}
            subtitle={`${metrics.production.activeOrders} active client orders`}
            icon={Film}
            trend={{ value: "+28% throughput", isPositive: true }}
          />

          <StatsCard
            title="Active Client Brands"
            value={metrics.clients.totalActive}
            subtitle={`${metrics.clients.newThisMonth} onboarded this month`}
            icon={Users}
          />
        </div>

        {/* 9-STEP PRODUCTION PIPELINE OVERVIEW */}
        <Card className="border-neutral-800 bg-[#121212]">
          <CardHeader className="pb-3 border-b border-neutral-800/80">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <Film className="h-4 w-4 text-amber-400" />
                  Live Video Production Pipeline (State Machine)
                </CardTitle>
                <CardDescription className="text-xs">
                  Linear, state-enforced operational progression from script sign-off to final cloud delivery.
                </CardDescription>
              </div>
              <Link href="/production">
                <Button variant="ghost" size="sm" className="text-xs text-amber-400 hover:text-amber-300 gap-1">
                  Open Kanban Board <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-5">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-3">
              {[
                { step: "1. Script Approved", count: 4, variant: "pipelineScript", icon: FileEdit },
                { step: "2. Shoot Pending", count: metrics.production.upcomingShoots, variant: "pipelineShoot", icon: Calendar },
                { step: "3. Raw Received", count: 3, variant: "pipelineRaw", icon: Layers },
                { step: "4. Video Editing", count: metrics.production.inEditing, variant: "pipelineEditing", icon: Film, highlight: true },
                { step: "5. Internal QA", count: 2, variant: "pipelineQa", icon: CheckCircle2 },
                { step: "6. Client Review", count: metrics.production.pendingClientReview, variant: "pipelineReview", icon: Users },
                { step: "7. Revision", count: metrics.production.underRevision, variant: "pipelineRevision", icon: AlertTriangle },
                { step: "8. Final Approved", count: 5, variant: "pipelineApproved", icon: Sparkles },
                { step: "9. Delivered", count: metrics.production.deliveredThisMonth, variant: "pipelineDelivered", icon: CheckCircle2 },
              ].map((stage, idx) => {
                const Icon = stage.icon;
                return (
                  <div
                    key={stage.step}
                    className="flex flex-col justify-between p-3 rounded-lg bg-neutral-900/90 border border-neutral-800 hover:border-neutral-700 transition-all group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold text-neutral-400 truncate">
                        {stage.step}
                      </span>
                      <Icon className="h-3.5 w-3.5 text-neutral-500 group-hover:text-amber-400 transition-colors" />
                    </div>
                    <div className="flex items-baseline justify-between">
                      <span className="text-xl font-bold font-mono text-white">
                        {stage.count}
                      </span>
                      <Badge variant={stage.variant as any} className="text-[9px] px-1 py-0">
                        {stage.count} items
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* 2-COLUMN OPERATIONAL CONTROL WIDGETS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Column 1: Today's Shoots & Schedule */}
          <Card className="border-neutral-800 bg-[#121212] lg:col-span-1">
            <CardHeader className="pb-3 border-b border-neutral-800">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Clapperboard className="h-4 w-4 text-amber-400" />
                  Today&apos;s Shoots & Logistics
                </CardTitle>
                <Badge variant="warning" className="text-[10px]">
                  2 Shoots
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div className="p-3 rounded-lg bg-neutral-900/90 border border-neutral-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-white">
                    GlowSkin Serum UGC #4
                  </span>
                  <Badge variant="success" className="text-[10px]">
                    Confirmed
                  </Badge>
                </div>
                <p className="text-[11px] text-neutral-400">
                  <span className="text-amber-400 font-medium">Creator:</span> Priya S. • <span className="text-neutral-300">Location:</span> Studio A (Bandra)
                </p>
                <div className="flex items-center justify-between text-[11px] text-neutral-500 pt-1 border-t border-neutral-800">
                  <span>Manager: Rahul V.</span>
                  <span className="text-neutral-300 font-mono">11:00 AM - 3:00 PM</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-neutral-900/90 border border-neutral-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-white">
                    FitPulse Protein Bar Ad
                  </span>
                  <Badge variant="info" className="text-[10px]">
                    In Progress
                  </Badge>
                </div>
                <p className="text-[11px] text-neutral-400">
                  <span className="text-amber-400 font-medium">Creator:</span> Aryan K. • <span className="text-neutral-300">Location:</span> Cult Gym (Andheri)
                </p>
                <div className="flex items-center justify-between text-[11px] text-neutral-500 pt-1 border-t border-neutral-800">
                  <span>Manager: Simran M.</span>
                  <span className="text-neutral-300 font-mono">2:30 PM - 6:00 PM</span>
                </div>
              </div>

              <Link href="/shoots">
                <Button variant="outline" size="sm" className="w-full text-xs border-neutral-800 hover:bg-neutral-800 text-neutral-300">
                  View Full Shoot Calendar
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Column 2: Bottleneck Trackers & Urgent Actions */}
          <Card className="border-neutral-800 bg-[#121212] lg:col-span-1">
            <CardHeader className="pb-3 border-b border-neutral-800">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-400" />
                  Urgent Bottlenecks & Approvals
                </CardTitle>
                <Badge variant="destructive" className="text-[10px]">
                  3 Urgent
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div className="p-3 rounded-lg bg-red-950/20 border border-red-500/30 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-red-300 flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-red-400" />
                    Overdue Video Edit (24h+)
                  </span>
                  <Badge variant="urgencyOverdue" className="text-[9px]">
                    OVERDUE
                  </Badge>
                </div>
                <p className="text-[11px] text-neutral-300">
                  BoldWear Reel #2 • Assigned to: Ankit (Editor)
                </p>
                <p className="text-[10px] text-neutral-500">
                  Client due date was yesterday at 6:00 PM
                </p>
              </div>

              <div className="p-3 rounded-lg bg-amber-950/20 border border-amber-500/30 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-amber-300 flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 text-amber-400" />
                    Client Action Pending
                  </span>
                  <Badge variant="urgencyToday" className="text-[9px]">
                    REVIEW
                  </Badge>
                </div>
                <p className="text-[11px] text-neutral-300">
                  Zenith App Showcase • Sent for client sign-off 3 days ago
                </p>
                <p className="text-[10px] text-neutral-500">
                  Auto-reminder sent to client WhatsApp
                </p>
              </div>

              <div className="p-3 rounded-lg bg-neutral-900 border border-neutral-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-neutral-200">
                    Pending Script Approval
                  </span>
                  <Badge variant="pipelineScript" className="text-[9px]">
                    SCRIPT
                  </Badge>
                </div>
                <p className="text-[11px] text-neutral-400">
                  FreshBites Hook Test #1 • Writer: Devika
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Column 3: Live System Activity Stream */}
          <Card className="border-neutral-800 bg-[#121212] lg:col-span-1">
            <CardHeader className="pb-3 border-b border-neutral-800">
              <CardTitle className="text-sm flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-400" />
                Live Operational Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div className="space-y-3 text-xs">
                <div className="flex gap-3 items-start">
                  <div className="h-6 w-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <p className="text-neutral-200 font-medium">
                      Video Delivered to Client
                    </p>
                    <p className="text-[11px] text-neutral-500">
                      UrbanEats UGC Promo #1 Google Drive link published
                    </p>
                    <span className="text-[10px] text-neutral-600">12 mins ago</span>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <div className="h-6 w-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                    <DollarSign className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <p className="text-neutral-200 font-medium">
                      Inbound Payment Logged: ₹75,000
                    </p>
                    <p className="text-[11px] text-neutral-500">
                      Client: Apex Athletics (Package: 10 UGC Videos)
                    </p>
                    <span className="text-[10px] text-neutral-600">45 mins ago</span>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <div className="h-6 w-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0 mt-0.5">
                    <FileEdit className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <p className="text-neutral-200 font-medium">
                      Script Assigned to Writer
                    </p>
                    <p className="text-[11px] text-neutral-500">
                      Writer Devika assigned to NuBody Collagen Hook #2
                    </p>
                    <span className="text-[10px] text-neutral-600">2 hours ago</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
