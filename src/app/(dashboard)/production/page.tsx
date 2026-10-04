import { Film, Plus, Clock, CheckCircle2, AlertTriangle, Layers, Calendar, Sparkles } from "lucide-react";
import { Header } from "@/components/shared/Header";
import { StatsCard } from "@/components/shared/StatsCard";
import { PipelineBoard } from "@/components/production/PipelineBoard";
import { VideoPipelineService } from "@/services/video-pipeline.service";

export default async function ProductionPage() {
  const rawVideos = await VideoPipelineService.getVideos();
  const videos = JSON.parse(JSON.stringify(rawVideos));

  const totalInPipeline = videos.filter((v: any) => v.pipelineStatus !== "DELIVERED").length;
  const inEditing = videos.filter((v: any) => v.pipelineStatus === "VIDEO_EDITING").length;
  const inClientReview = videos.filter((v: any) => v.pipelineStatus === "CLIENT_REVIEW").length;
  const overdueCount = videos.filter((v: any) => v.dynamicUrgency === "OVERDUE").length;

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title="9-Step Linear Video Production Pipeline"
        subtitle="Linear state machine enforcement: Script Approved → Shoot → Raw → Edit → QA → Client Review → Revision → Approved → Delivered"
      />

      <div className="p-8 space-y-6">
        {/* Metric Summaries */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Active In Production"
            value={totalInPipeline}
            subtitle="Across all agency pipelines"
            icon={Film}
            amberAccent={true}
          />
          <StatsCard
            title="In Video Editing"
            value={inEditing}
            subtitle="Assigned to agency editors"
            icon={Layers}
          />
          <StatsCard
            title="Client Review Stage"
            value={inClientReview}
            subtitle="Awaiting client sign-off"
            icon={Clock}
          />
          <StatsCard
            title="Overdue Deliverables"
            value={overdueCount}
            subtitle="Immediate editor attention required"
            icon={AlertTriangle}
            highlight={overdueCount > 0}
          />
        </div>

        {/* 9-Stage Kanban Board */}
        <PipelineBoard initialVideos={videos as any} />
      </div>
    </div>
  );
}
