import { FileText, Plus, CheckCircle2, Clock, MessageSquare, AlertCircle, Edit, ExternalLink, ArrowRight } from "lucide-react";
import { Header } from "@/components/shared/Header";
import { StatsCard } from "@/components/shared/StatsCard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScriptService } from "@/services/script.service";
import { ClientService } from "@/services/client.service";
import { OrderService } from "@/services/order.service";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

const SCRIPT_STATUS_BADGES: Record<string, { label: string; variant: string }> = {
  DRAFT: { label: "Draft", variant: "secondary" },
  ASSIGNED: { label: "Assigned", variant: "info" },
  IN_REVIEW: { label: "Internal Review", variant: "purple" },
  SENT_TO_CLIENT: { label: "Sent to Client", variant: "pipelineReview" },
  REVISION_REQUIRED: { label: "Revision Required", variant: "destructive" },
  APPROVED: { label: "Client Approved", variant: "success" },
  READY_FOR_SHOOT: { label: "Ready for Shoot", variant: "pipelineApproved" },
};

export default async function ScriptsPage() {
  const [scripts, clientsResult, orders] = await Promise.all([
    ScriptService.getScripts(),
    ClientService.getClients({ limit: 100 }),
    OrderService.getOrders(),
  ]);

  const scriptList = scripts as any[];
  const readyForShootCount = scriptList.filter((s) => s.status === "READY_FOR_SHOOT" || s.status === "APPROVED").length;
  const inReviewCount = scriptList.filter((s) => s.status === "IN_REVIEW" || s.status === "SENT_TO_CLIENT").length;
  const revisionCount = scriptList.filter((s) => s.status === "REVISION_REQUIRED").length;

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title="Manual Scripting Operations Hub"
        subtitle="Operational script drafting, writer assignments, client feedback cycles, and shoot-ready sign-offs"
        actions={
          <Button size="sm" className="bg-amber-500 hover:bg-amber-400 text-black font-semibold gap-1.5 text-xs">
            <Plus className="h-4 w-4" /> Draft New Script
          </Button>
        }
      />

      <div className="p-8 space-y-6">
        {/* Metric Summaries */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Script Repository"
            value={scriptList.length}
            subtitle="Across all brand campaigns"
            icon={FileText}
            amberAccent={true}
          />
          <StatsCard
            title="Ready For Shoot"
            value={readyForShootCount}
            subtitle="Approved by client & locked"
            icon={CheckCircle2}
          />
          <StatsCard
            title="In Client Review"
            value={inReviewCount}
            subtitle="Awaiting client sign-off"
            icon={Clock}
          />
          <StatsCard
            title="Revisions Pending"
            value={revisionCount}
            subtitle="Feedback loop in progress"
            icon={AlertCircle}
          />
        </div>

        {/* Script Workflow Pipeline Cards */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-400">
            Script Drafting & Revision Queue ({scriptList.length})
          </h2>

          <div className="grid grid-cols-1 gap-4">
            {scriptList.map((script) => {
              const statusMeta = SCRIPT_STATUS_BADGES[script.status] || {
                label: script.status,
                variant: "secondary",
              };

              return (
                <Card
                  key={script.id}
                  className="border-neutral-800 bg-[#121212] hover:border-neutral-700 transition-all"
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                      {/* Left: Script Title & Context */}
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2.5">
                          <span className="text-xs font-mono font-bold text-amber-400">
                            Video #{script.videoNumber}
                          </span>
                          <Badge variant={statusMeta.variant as any} className="text-[10px]">
                            {statusMeta.label}
                          </Badge>
                          <span className="text-xs text-neutral-400 font-medium">
                            Language: <strong className="text-neutral-200">{script.language}</strong>
                          </span>
                          {script.revisionCount > 0 && (
                            <Badge variant="destructive" className="text-[10px]">
                              Rev #{script.revisionCount}
                            </Badge>
                          )}
                        </div>

                        <h3 className="text-base font-bold text-white">
                          {script.title}
                        </h3>

                        <p className="text-xs text-neutral-400">
                          Client: <strong className="text-neutral-200">{script.client.companyName}</strong> ({script.client.brandName}) • Package: {script.order.packageName}
                        </p>

                        {/* Script Excerpt Preview */}
                        <div className="p-3 rounded-lg bg-neutral-950/80 border border-neutral-800 text-xs text-neutral-300 font-mono whitespace-pre-wrap max-h-24 overflow-y-auto">
                          {script.scriptText}
                        </div>

                        {/* Client Feedback Note if present */}
                        {script.clientComments && (
                          <div className="p-2.5 rounded-lg bg-amber-950/20 border border-amber-500/30 text-xs text-amber-300 flex items-start gap-2">
                            <MessageSquare className="h-4 w-4 shrink-0 mt-0.5 text-amber-400" />
                            <div>
                              <strong className="font-semibold text-white">Client Feedback:</strong> {script.clientComments}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Right: Meta & Actions */}
                      <div className="flex flex-col justify-between items-end gap-4 min-w-[200px] self-stretch">
                        <div className="text-right text-xs space-y-1">
                          <p className="text-neutral-400">
                            Writer: <strong className="text-neutral-200">{script.writer?.user?.fullName || "Unassigned"}</strong>
                          </p>
                          <p className="text-neutral-400">
                            Creator Match: <strong className="text-amber-400">{script.creator?.name || "Not matched"}</strong>
                          </p>
                          {script.deadline && (
                            <p className="text-neutral-500 text-[11px]">
                              Deadline: {formatDate(script.deadline)}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="dark"
                            size="sm"
                            className="text-xs border-neutral-700 hover:border-amber-500/40 text-neutral-200 gap-1.5"
                          >
                            <Edit className="h-3.5 w-3.5 text-amber-400" /> Edit Script
                          </Button>
                          <Link href={`/production`}>
                            <Button
                              size="sm"
                              className="bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs gap-1"
                            >
                              Shoot Pipeline <ArrowRight className="h-3.5 w-3.5" />
                            </Button>
                          </Link>
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
