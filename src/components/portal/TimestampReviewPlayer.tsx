"use client";

import { useState, useRef } from "react";
import {
  Play,
  Pause,
  Clock,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Send,
  Video,
  Download,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { formatSecondsToTime, formatDate } from "@/lib/utils";
import {
  submitVideoFeedbackAction,
  processClientDecisionAction,
} from "@/actions/portal.actions";
import { toast } from "sonner";

interface FeedbackItem {
  id: string;
  timestampInVideo: number;
  comment: string;
  createdAt: Date | string;
}

interface VideoProps {
  video: {
    id: string;
    title: string;
    pipelineStatus: string;
    draftVideoUrl?: string | null;
    finalDeliveryUrl?: string | null;
    revisionCount: number;
    feedbackLogs?: FeedbackItem[];
  };
}

export function TimestampReviewPlayer({ video }: VideoProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(30);
  const [feedbackInput, setFeedbackInput] = useState("");
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [revisionNotes, setRevisionNotes] = useState("");
  const [revisionModalOpen, setRevisionModalOpen] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>(
    video.feedbackLogs || []
  );
  const [currentStatus, setCurrentStatus] = useState(video.pipelineStatus);

  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
            })
            .catch((err) => {
              console.warn("Video playback prevented or source unsupported:", err);
              setIsPlaying(false);
            });
        }
      }
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const jumpToTime = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = seconds;
      setCurrentTime(seconds);
    }
  };

  const handleAddFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackInput.trim()) return;

    setSubmittingFeedback(true);
    try {
      const res = await submitVideoFeedbackAction({
        videoId: video.id,
        timestampInVideo: Math.round(currentTime * 10) / 10,
        comment: feedbackInput.trim(),
      });

      if (res.success) {
        toast.success(`Feedback marker added at ${formatSecondsToTime(currentTime)}!`);
        setFeedbacks([
          {
            id: `temp-${Date.now()}`,
            timestampInVideo: currentTime,
            comment: feedbackInput.trim(),
            createdAt: new Date(),
          },
          ...feedbacks,
        ]);
        setFeedbackInput("");
      } else {
        toast.error(res.error || "Failed to submit feedback");
      }
    } catch {
      toast.error("Error submitting feedback");
    } finally {
      setSubmittingFeedback(false);
    }
  };

  const handleApprove = async () => {
    try {
      const res = await processClientDecisionAction({
        videoId: video.id,
        action: "APPROVE",
      });

      if (res.success) {
        toast.success("Video Approved! Order delivery quota updated.");
        setCurrentStatus("FINAL_APPROVED");
      } else {
        toast.error(res.error || "Approval failed");
      }
    } catch {
      toast.error("Error approving video");
    }
  };

  const handleRequestRevision = async () => {
    if (!revisionNotes.trim()) {
      toast.error("Please enter revision instructions for the editor");
      return;
    }

    try {
      const res = await processClientDecisionAction({
        videoId: video.id,
        action: "REQUEST_REVISION",
        revisionNotes: revisionNotes.trim(),
      });

      if (res.success) {
        toast.success("Revision requested! Video reassigned to editor with priority.");
        setCurrentStatus("REVISION");
        setRevisionModalOpen(false);
      } else {
        toast.error(res.error || "Failed to submit revision request");
      }
    } catch {
      toast.error("Error submitting revision request");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Video Player + Controls (2 Columns) */}
      <div className="lg:col-span-2 space-y-4">
        <Card className="border-neutral-800 bg-[#121212] overflow-hidden">
          <div className="relative aspect-video bg-black flex items-center justify-center group">
            {video.draftVideoUrl && !videoError ? (
              <video
                ref={videoRef}
                src={video.draftVideoUrl}
                playsInline
                preload="metadata"
                onTimeUpdate={handleTimeUpdate}
                onError={() => {
                  console.warn("Video stream unsupported or CORS restricted. Switching to fallback viewer.");
                  setVideoError(true);
                }}
                onLoadedMetadata={() => {
                  if (videoRef.current) setDuration(videoRef.current.duration || 30);
                }}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="text-center p-8 space-y-3">
                <Video className="h-12 w-12 text-amber-500/80 mx-auto" />
                <div>
                  <h4 className="text-sm font-semibold text-white">Draft Video Cloud Preview</h4>
                  <p className="text-neutral-400 text-xs mt-1">
                    {video.draftVideoUrl
                      ? "Cloud video asset attached. You can review timestamps or open directly."
                      : "Draft video preview rendering in progress."}
                  </p>
                </div>
                {video.draftVideoUrl && (
                  <a
                    href={video.draftVideoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button size="sm" variant="dark" className="border-neutral-700 text-xs text-amber-400 gap-1.5 mt-1">
                      <Download className="h-3.5 w-3.5" /> Open / Download Video File
                    </Button>
                  </a>
                )}
              </div>
            )}

            {/* Custom Overlay Controls */}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 flex flex-col gap-2">
              {/* Scrub bar */}
              <input
                type="range"
                min={0}
                max={duration}
                step={0.1}
                value={currentTime}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setCurrentTime(val);
                  if (videoRef.current) videoRef.current.currentTime = val;
                }}
                className="w-full accent-amber-500 cursor-pointer h-1.5 bg-neutral-700 rounded-lg"
              />

              <div className="flex items-center justify-between text-xs text-neutral-300">
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={togglePlay}
                    className="h-8 w-8 text-white hover:bg-neutral-800"
                  >
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  <span className="font-mono text-amber-400 font-bold">
                    {formatSecondsToTime(currentTime)} / {formatSecondsToTime(duration)}
                  </span>
                </div>

                <Badge variant="pipelineReview" className="text-[10px]">
                  {currentStatus.replace(/_/g, " ")}
                </Badge>
              </div>
            </div>
          </div>

          {/* Action Decision Bar */}
          <CardContent className="p-4 border-t border-neutral-800 bg-neutral-950 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-white">{video.title}</h3>
              <p className="text-xs text-neutral-400">
                Revision Count: <strong className="text-amber-400">{video.revisionCount}</strong>
              </p>
            </div>

            <div className="flex items-center gap-2">
              {currentStatus === "FINAL_APPROVED" || currentStatus === "DELIVERED" ? (
                <div className="flex items-center gap-2">
                  <Badge variant="pipelineApproved" className="text-xs">
                    Approved by Client
                  </Badge>
                  {video.finalDeliveryUrl && (
                    <a
                      href={video.finalDeliveryUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs gap-1.5">
                        <Download className="h-3.5 w-3.5" /> Download Final 4K Render
                      </Button>
                    </a>
                  )}
                </div>
              ) : (
                <>
                  {/* Request Revision Dialog */}
                  <Dialog open={revisionModalOpen} onOpenChange={setRevisionModalOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="border-neutral-700 text-xs text-red-400 hover:bg-neutral-800">
                        Request Revision
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-neutral-900 border-neutral-800 text-neutral-100">
                      <DialogHeader>
                        <DialogTitle className="text-white flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-red-400" />
                          Request Video Revision
                        </DialogTitle>
                        <DialogDescription className="text-xs text-neutral-400">
                          Explain the required cuts, subtitle tweaks, or pacing changes. The editor will be notified immediately.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-2">
                        <textarea
                          rows={4}
                          placeholder="e.g. Please increase subtitle size during the hook, and fade music down at 0:12..."
                          value={revisionNotes}
                          onChange={(e) => setRevisionNotes(e.target.value)}
                          className="w-full rounded-md border border-neutral-800 bg-neutral-950 p-3 text-sm text-neutral-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                        />
                      </div>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setRevisionModalOpen(false)}
                          className="border-neutral-800 text-neutral-300"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleRequestRevision}
                          className="bg-red-600 hover:bg-red-500 text-white font-semibold"
                        >
                          Send Revision to Editor
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  {/* Approve Video Button */}
                  <Button
                    onClick={handleApprove}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs gap-1.5 shadow-md shadow-emerald-600/20"
                  >
                    <CheckCircle2 className="h-4 w-4" /> Approve Video
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Timestamped Feedback Log (1 Column) */}
      <div className="space-y-4">
        <Card className="border-neutral-800 bg-[#121212] flex flex-col h-full">
          <CardHeader className="pb-3 border-b border-neutral-800">
            <CardTitle className="text-sm flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-amber-400" />
              Timestamped Comments ({feedbacks.length})
            </CardTitle>
            <CardDescription className="text-xs">
              Leave exact notes on specific video frames.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-4 flex-1 flex flex-col justify-between space-y-4">
            {/* Feedback List */}
            <div className="space-y-2.5 overflow-y-auto max-h-[350px]">
              {feedbacks.length === 0 ? (
                <p className="text-xs text-neutral-500 text-center py-8">
                  No timestamped markers yet. Pause the video and add a note below!
                </p>
              ) : (
                feedbacks.map((fb) => (
                  <div
                    key={fb.id}
                    onClick={() => jumpToTime(fb.timestampInVideo)}
                    className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-amber-500/40 cursor-pointer transition-all space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <Badge variant="default" className="text-[10px] font-mono px-1.5 py-0">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatSecondsToTime(fb.timestampInVideo)}
                      </Badge>
                      <span className="text-[10px] text-neutral-500">
                        {formatDate(fb.createdAt)}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-200">{fb.comment}</p>
                  </div>
                ))
              )}
            </div>

            {/* Add Comment Input */}
            <form onSubmit={handleAddFeedback} className="space-y-2 pt-2 border-t border-neutral-800">
              <div className="flex items-center justify-between text-xs text-neutral-400">
                <span>Marker Timestamp:</span>
                <span className="font-mono text-amber-400 font-bold">
                  {formatSecondsToTime(currentTime)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  placeholder="e.g. Change transition effect here..."
                  value={feedbackInput}
                  onChange={(e) => setFeedbackInput(e.target.value)}
                  className="bg-neutral-950 border-neutral-800 text-xs"
                />
                <Button
                  type="submit"
                  disabled={submittingFeedback || !feedbackInput.trim()}
                  size="sm"
                  className="bg-amber-500 hover:bg-amber-400 text-black font-bold h-9"
                >
                  <Send className="h-3.5 w-3.5" />
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
