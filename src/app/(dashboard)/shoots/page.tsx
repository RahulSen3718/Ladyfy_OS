import { Clapperboard, Plus, Calendar, Clock, MapPin, User, CheckSquare, ShieldCheck, Video, ExternalLink, ArrowRight } from "lucide-react";
import { Header } from "@/components/shared/Header";
import { StatsCard } from "@/components/shared/StatsCard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShootService } from "@/services/shoot.service";
import { formatDate, formatDateTime } from "@/lib/utils";
import Link from "next/link";

const SHOOT_STATUS_BADGES: Record<string, { label: string; variant: string }> = {
  SCHEDULED: { label: "Scheduled", variant: "info" },
  CONFIRMED: { label: "Confirmed", variant: "success" },
  IN_PROGRESS: { label: "In Progress", variant: "warning" },
  COMPLETED: { label: "Completed", variant: "pipelineApproved" },
  CANCELLED: { label: "Cancelled", variant: "destructive" },
  RESHOOT_REQUIRED: { label: "Reshoot Required", variant: "urgencyOverdue" },
};

export default async function ShootsPage() {
  const shoots = await ShootService.getShoots();
  const shootList = shoots as any[];

  const confirmedShoots = shootList.filter((s) => s.status === "CONFIRMED" || s.status === "SCHEDULED").length;
  const inProgressShoots = shootList.filter((s) => s.status === "IN_PROGRESS").length;
  const completedShoots = shootList.filter((s) => s.status === "COMPLETED").length;

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title="Shoot Scheduling & Production Logistics"
        subtitle="Live shoots calendar, creator assignments, technical staffing, pre-shoot checklists, and post-shoot footage verification"
        actions={
          <Button size="sm" className="bg-amber-500 hover:bg-amber-400 text-black font-semibold gap-1.5 text-xs">
            <Plus className="h-4 w-4" /> Schedule New Shoot
          </Button>
        }
      />

      <div className="p-8 space-y-6">
        {/* Metric Summaries */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Shoots"
            value={shootList.length}
            subtitle="Scheduled across all brands"
            icon={Clapperboard}
            amberAccent={true}
          />
          <StatsCard
            title="Upcoming & Confirmed"
            value={confirmedShoots}
            subtitle="Pre-shoot verified"
            icon={Calendar}
          />
          <StatsCard
            title="Shoots In Progress"
            value={inProgressShoots}
            subtitle="Currently on set"
            icon={Clock}
          />
          <StatsCard
            title="Completed & Uploaded"
            value={completedShoots}
            subtitle="Footage passed to editors"
            icon={ShieldCheck}
          />
        </div>

        {/* Shoots Cards */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-400">
            Active Shoot Logistics & Verification ({shootList.length})
          </h2>

          <div className="grid grid-cols-1 gap-5">
            {shootList.map((shoot) => {
              const statusMeta = SHOOT_STATUS_BADGES[shoot.status] || {
                label: shoot.status,
                variant: "secondary",
              };
              const preChecklist = shoot.preShootChecklist || {};
              const postChecklist = shoot.postShootVerification || {};

              return (
                <Card
                  key={shoot.id}
                  className="border-neutral-800 bg-[#121212] hover:border-neutral-700 transition-all"
                >
                  <CardContent className="p-6 space-y-4">
                    {/* Top Row: Shoot Header & Logistics */}
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2.5">
                          <span className="text-xs font-mono font-bold text-amber-400">
                            {shoot.shootNumber}
                          </span>
                          <Badge variant={statusMeta.variant as any} className="text-[10px]">
                            {statusMeta.label}
                          </Badge>
                          <span className="text-xs text-neutral-400">
                            Duration: <strong className="text-white font-mono">{shoot.durationHours} Hours</strong>
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-white mt-1">
                          {shoot.client.companyName} ({shoot.client.brandName}) — {shoot.order.packageName}
                        </h3>
                        <p className="text-xs text-neutral-400 flex items-center gap-1.5 mt-0.5">
                          <MapPin className="h-3.5 w-3.5 text-amber-400" /> {shoot.location}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-xs text-neutral-500 block">Scheduled Date & Time</span>
                        <span className="text-base font-bold font-mono text-amber-400">
                          {formatDateTime(shoot.scheduledAt)}
                        </span>
                      </div>
                    </div>

                    {/* Middle Row: Team & Creator Assignments */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-lg bg-neutral-950 border border-neutral-800 text-xs">
                      <div>
                        <span className="text-neutral-500 block">Assigned Creator:</span>
                        <span className="font-bold text-amber-400">
                          {shoot.creator?.name || "Unassigned"}
                        </span>
                        {shoot.creator?.contactPhone && (
                          <span className="text-[11px] text-neutral-400 block">{shoot.creator.contactPhone}</span>
                        )}
                      </div>

                      <div className="border-t sm:border-t-0 sm:border-l border-neutral-800 pt-2 sm:pt-0 sm:pl-3">
                        <span className="text-neutral-500 block">Camera & Assistant:</span>
                        <span className="font-medium text-neutral-200">
                          {shoot.cameramanName || "TBD"} (Camera) • {shoot.shootingAssistant || "TBD"} (Asst)
                        </span>
                      </div>

                      <div className="border-t sm:border-t-0 sm:border-l border-neutral-800 pt-2 sm:pt-0 sm:pl-3">
                        <span className="text-neutral-500 block">Shoot Manager:</span>
                        <span className="font-medium text-neutral-200">
                          {shoot.shootManager?.user?.fullName || "Aarav Sharma"}
                        </span>
                      </div>
                    </div>

                    {/* Bottom Row: Pre-Shoot & Post-Shoot Checklists */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      {/* Pre-Shoot Checklist */}
                      <div className="p-3 rounded-lg bg-neutral-900/80 border border-neutral-800 space-y-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block">
                          Pre-Shoot Verification Checklist
                        </span>
                        <div className="grid grid-cols-2 gap-1.5 text-xs text-neutral-300">
                          <span className="flex items-center gap-1.5">
                            <span className={`h-2 w-2 rounded-full ${preChecklist.scriptApproved ? "bg-emerald-500" : "bg-red-500"}`} />
                            Script Approved
                          </span>
                          <span className="flex items-center gap-1.5">
                            <span className={`h-2 w-2 rounded-full ${preChecklist.creatorConfirmed ? "bg-emerald-500" : "bg-red-500"}`} />
                            Creator Confirmed
                          </span>
                          <span className="flex items-center gap-1.5">
                            <span className={`h-2 w-2 rounded-full ${preChecklist.locationPermitted ? "bg-emerald-500" : "bg-red-500"}`} />
                            Location Permitted
                          </span>
                          <span className="flex items-center gap-1.5">
                            <span className={`h-2 w-2 rounded-full ${preChecklist.productReceived ? "bg-emerald-500" : "bg-red-500"}`} />
                            Product Received
                          </span>
                        </div>
                      </div>

                      {/* Post-Shoot Verification */}
                      <div className="p-3 rounded-lg bg-neutral-900/80 border border-neutral-800 space-y-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block">
                          Post-Shoot Verification & Raw Footage
                        </span>
                        <div className="flex items-center justify-between text-xs">
                          <span className="flex items-center gap-1.5 text-neutral-300">
                            <span className={`h-2 w-2 rounded-full ${postChecklist.footageUploaded ? "bg-emerald-500" : "bg-neutral-600"}`} />
                            Footage Uploaded & Verified
                          </span>
                          {shoot.rawFootageFolderUrl ? (
                            <a
                              href={shoot.rawFootageFolderUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Button size="sm" variant="dark" className="h-7 text-xs border-neutral-700 text-amber-400 gap-1">
                                <ExternalLink className="h-3 w-3" /> Raw Drive Folder
                              </Button>
                            </a>
                          ) : (
                            <span className="text-[11px] text-neutral-500">Awaiting Upload</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
