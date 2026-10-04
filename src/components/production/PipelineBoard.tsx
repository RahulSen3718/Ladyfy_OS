"use client";

import { useState } from "react";
import {
  Film,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  User,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Download,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { advancePipelineAction } from "@/actions/video.actions";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

export interface VideoItem {
  id: string;
  title: string;
  deadline: Date | string;
  pipelineStatus: string;
  urgencyStatus: string;
  dynamicUrgency: string;
  revisionCount: number;
  draftVideoUrl?: string | null;
  finalDeliveryUrl?: string | null;
  client: { companyName: string; brandName: string };
  order: { packageName: string; orderNumber: string };
  script?: { title: string; videoNumber: number } | null;
  creator?: { name: string; photoUrl?: string | null } | null;
  editor?: { user: { fullName: string; email: string } } | null;
}

const PIPELINE_STAGES = [
  { id: "SCRIPT_APPROVED", label: "1. Script Approved", variant: "pipelineScript" },
  { id: "SHOOT_PENDING", label: "2. Shoot Pending", variant: "pipelineShoot" },
  { id: "RAW_FOOTAGE_RECEIVED", label: "3. Raw Received", variant: "pipelineRaw" },
  { id: "VIDEO_EDITING", label: "4. Video Editing", variant: "pipelineEditing" },
  { id: "INTERNAL_QA", label: "5. Internal QA", variant: "pipelineQa" },
  { id: "CLIENT_REVIEW", label: "6. Client Review", variant: "pipelineReview" },
  { id: "REVISION", label: "7. Revision", variant: "pipelineRevision" },
  { id: "FINAL_APPROVED", label: "8. Final Approved", variant: "pipelineApproved" },
  { id: "DELIVERED", label: "9. Delivered", variant: "pipelineDelivered" },
];

const NEXT_STAGE_MAP: Record<string, string> = {
  SCRIPT_APPROVED: "SHOOT_PENDING",
  SHOOT_PENDING: "RAW_FOOTAGE_RECEIVED",
  RAW_FOOTAGE_RECEIVED: "VIDEO_EDITING",
  VIDEO_EDITING: "INTERNAL_QA",
  INTERNAL_QA: "CLIENT_REVIEW",
  CLIENT_REVIEW: "FINAL_APPROVED",
  REVISION: "INTERNAL_QA",
  FINAL_APPROVED: "DELIVERED",
};

export function PipelineBoard({ initialVideos }: { initialVideos: VideoItem[] }) {
  const [videos, setVideos] = useState<VideoItem[]>(initialVideos);
  const [filterUrgency, setFilterUrgency] = useState<string>("ALL");

  const handleAdvance = async (videoId: string, currentStatus: string) => {
    const nextStatus = NEXT_STAGE_MAP[currentStatus];
    if (!nextStatus) return;

    try {
      const res = await advancePipelineAction({
        videoId,
        targetStatus: nextStatus as any,
      });

      if (res.success) {
        toast.success(`Video advanced to ${nextStatus.replace(/_/g, " ")}`);
        setVideos((prev) =>
          prev.map((v) =>
            v.id === videoId ? { ...v, pipelineStatus: nextStatus } : v
          )
        );
      } else {
        toast.error(res.error || "Failed to advance stage");
      }
    } catch {
      toast.error("Error updating pipeline");
    }
  };

  const filteredVideos = videos.filter((v) => {
    if (filterUrgency === "ALL") return true;
    return v.dynamicUrgency === filterUrgency;
  });

  return (
    <div className="space-y-6">
      {/* Urgency Filter Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-neutral-900/60 border border-neutral-800">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
            Editor Urgency Filter:
          </span>
          <div className="flex items-center gap-1.5">
            {["ALL", "OVERDUE", "DUE_TODAY", "DUE_TOMORROW"].map((urgency) => (
              <Button
                key={urgency}
                variant={filterUrgency === urgency ? "amber" : "outline"}
                size="sm"
                onClick={() => setFilterUrgency(urgency)}
                className="text-xs h-7 border-neutral-800"
              >
                {urgency === "ALL" ? "All Projects" : urgency.replace(/_/g, " ")}
              </Button>
            ))}
          </div>
        </div>

        <span className="text-xs text-neutral-400 font-mono">
          Showing {filteredVideos.length} active deliverables
        </span>
      </div>

      {/* Horizontal 9-Stage Kanban Board */}
      <div className="flex gap-4 overflow-x-auto pb-6">
        {PIPELINE_STAGES.map((stage) => {
          const stageVideos = filteredVideos.filter(
            (v) => v.pipelineStatus === stage.id
          );

          return (
            <div
              key={stage.id}
              className="w-80 shrink-0 flex flex-col rounded-xl bg-[#121212] border border-neutral-800/80 overflow-hidden"
            >
              {/* Column Header */}
              <div className="p-3.5 border-b border-neutral-800 bg-neutral-900/90 flex items-center justify-between">
                <span className="text-xs font-bold text-white tracking-tight">
                  {stage.label}
                </span>
                <Badge variant={stage.variant as any} className="text-[10px] px-1.5 py-0">
                  {stageVideos.length}
                </Badge>
              </div>

              {/* Video Cards Container */}
              <div className="p-3 space-y-3 min-h-[500px] overflow-y-auto max-h-[calc(100vh-280px)]">
                {stageVideos.length === 0 ? (
                  <div className="h-32 border border-dashed border-neutral-800/80 rounded-lg flex items-center justify-center text-xs text-neutral-600">
                    No deliverables
                  </div>
                ) : (
                  stageVideos.map((video) => (
                    <Card
                      key={video.id}
                      className={`border-neutral-800 bg-neutral-900/90 hover:border-neutral-700 transition-all ${
                        video.dynamicUrgency === "OVERDUE"
                          ? "border-red-500/50 shadow-md shadow-red-500/10"
                          : ""
                      }`}
                    >
                      <CardContent className="p-4 space-y-3">
                        {/* Top: Urgency & Client */}
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-amber-400 truncate max-w-[150px]">
                            {video.client.brandName}
                          </span>
                          {video.dynamicUrgency === "OVERDUE" ? (
                            <Badge variant="urgencyOverdue" className="text-[9px]">
                              OVERDUE
                            </Badge>
                          ) : video.dynamicUrgency === "DUE_TODAY" ? (
                            <Badge variant="urgencyToday" className="text-[9px]">
                              DUE TODAY
                            </Badge>
                          ) : video.dynamicUrgency === "DUE_TOMORROW" ? (
                            <Badge variant="urgencyTomorrow" className="text-[9px]">
                              TOMORROW
                            </Badge>
                          ) : null}
                        </div>

                        {/* Title */}
                        <h4 className="text-xs font-bold text-white leading-snug">
                          {video.title}
                        </h4>

                        {/* Staff Tags */}
                        <div className="text-[11px] text-neutral-400 space-y-1 pt-1 border-t border-neutral-800">
                          <div className="flex items-center justify-between">
                            <span>Creator:</span>
                            <span className="text-neutral-200 font-medium">{video.creator?.name || "Unassigned"}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Editor:</span>
                            <span className="text-neutral-200 font-medium">{video.editor?.user?.fullName || "Unassigned"}</span>
                          </div>
                          <div className="flex items-center justify-between text-neutral-500">
                            <span>Deadline:</span>
                            <span className="font-mono text-neutral-400">{formatDate(video.deadline)}</span>
                          </div>
                        </div>

                        {/* Actions & State Transitions */}
                        <div className="pt-2 border-t border-neutral-800 flex items-center justify-between gap-2">
                          {video.draftVideoUrl && (
                            <a
                              href={video.draftVideoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1"
                            >
                              <ExternalLink className="h-3 w-3" /> Draft
                            </a>
                          )}

                          {NEXT_STAGE_MAP[video.pipelineStatus] && (
                            <Button
                              size="sm"
                              onClick={() => handleAdvance(video.id, video.pipelineStatus)}
                              className="h-7 text-[11px] bg-amber-500 hover:bg-amber-400 text-black font-semibold ml-auto gap-1 px-2"
                            >
                              Advance <ChevronRight className="h-3 w-3" />
                            </Button>
                          )}

                          {video.pipelineStatus === "DELIVERED" && (
                            <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                              <CheckCircle2 className="h-3.5 w-3.5" /> Delivered
                            </span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
