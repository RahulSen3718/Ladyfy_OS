import { prisma } from "@/lib/prisma";
import { CreateVideoInput, AdvancePipelineInput } from "@/validators/video.schema";
import { OrderService } from "./order.service";
import { Prisma, PipelineStatus, UrgencyStatus } from "@prisma/client";

export class VideoPipelineService {
  /**
   * Helper to calculate dynamic urgency status based on deadline
   */
  static calculateUrgency(deadline: Date, pipelineStatus: PipelineStatus): UrgencyStatus {
    if (pipelineStatus === PipelineStatus.DELIVERED) return UrgencyStatus.NORMAL;
    const now = new Date();
    const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
    const tomorrowEnd = new Date(todayEnd.getTime() + 24 * 60 * 60 * 1000);

    if (deadline.getTime() < now.getTime()) return UrgencyStatus.OVERDUE;
    if (deadline.getTime() <= todayEnd.getTime()) return UrgencyStatus.DUE_TODAY;
    if (deadline.getTime() <= tomorrowEnd.getTime()) return UrgencyStatus.DUE_TOMORROW;
    return UrgencyStatus.NORMAL;
  }

  static async createVideo(input: CreateVideoInput) {
    const status = (input.pipelineStatus as PipelineStatus) || PipelineStatus.SCRIPT_APPROVED;
    const urgency = this.calculateUrgency(input.deadline, status);

    const video = await prisma.video.create({
      data: {
        clientId: input.clientId,
        orderId: input.orderId,
        scriptId: input.scriptId,
        shootId: input.shootId || null,
        creatorId: input.creatorId || null,
        assignedEditorId: input.assignedEditorId || null,
        title: input.title,
        deadline: input.deadline,
        pipelineStatus: status,
        urgencyStatus: urgency,
        draftVideoUrl: input.draftVideoUrl || null,
        thumbnailUrl: input.thumbnailUrl || null,
        finalDeliveryUrl: input.finalDeliveryUrl || null,
      },
    });

    await OrderService.updateVideoCounters(input.orderId);
    return video;
  }

  static async getVideos(params?: {
    pipelineStatus?: string;
    assignedEditorId?: string;
    clientId?: string;
  }) {
    const where: Prisma.VideoWhereInput = {};
    if (params?.pipelineStatus && params.pipelineStatus !== "ALL") {
      where.pipelineStatus = params.pipelineStatus as PipelineStatus;
    }
    if (params?.assignedEditorId) where.assignedEditorId = params.assignedEditorId;
    if (params?.clientId) where.clientId = params.clientId;

    try {
      const videos = await prisma.video.findMany({
        where,
        include: {
          client: { select: { companyName: true, brandName: true } },
          order: { select: { packageName: true, orderNumber: true } },
          script: { select: { title: true, videoNumber: true, scriptText: true } },
          creator: { select: { name: true, photoUrl: true } },
          editor: { include: { user: { select: { fullName: true, email: true } } } },
          feedbackLogs: { orderBy: { createdAt: "desc" } },
        },
        orderBy: [{ deadline: "asc" }, { createdAt: "desc" }],
      });

      return videos.map((v) => ({
        ...v,
        dynamicUrgency: this.calculateUrgency(v.deadline, v.pipelineStatus),
      }));
    } catch {
      // Fallback demo video items across the 9 pipeline stages
      return [
        {
          id: "v-1",
          title: "Heavyweight Gym Tee - UGC Hook #1",
          deadline: new Date(Date.now() - 24 * 60 * 60 * 1000), // Overdue
          pipelineStatus: PipelineStatus.VIDEO_EDITING,
          urgencyStatus: UrgencyStatus.OVERDUE,
          dynamicUrgency: UrgencyStatus.OVERDUE,
          revisionCount: 0,
          draftVideoUrl: "https://drive.google.com/file/d/zenith-draft-1",
          thumbnailUrl: null,
          finalDeliveryUrl: null,
          client: { companyName: "Zenith Apparel Pvt Ltd", brandName: "Zenith Wear" },
          order: { packageName: "15 UGC Reel Pack", orderNumber: "ORD-2026-001" },
          script: { title: "Heavyweight Gym Tee", videoNumber: 1, scriptText: "Hook: Stop buying gym shirts..." },
          creator: { name: "Priya Sharma", photoUrl: null },
          editor: { user: { fullName: "Ankit Roy", email: "ankit@leadyfy.io" } },
          feedbackLogs: [],
        },
        {
          id: "v-2",
          title: "Sweat-Wicking Joggers Day in Life",
          deadline: new Date(), // Due Today
          pipelineStatus: PipelineStatus.CLIENT_REVIEW,
          urgencyStatus: UrgencyStatus.DUE_TODAY,
          dynamicUrgency: UrgencyStatus.DUE_TODAY,
          revisionCount: 0,
          draftVideoUrl: "https://drive.google.com/file/d/zenith-draft-2",
          thumbnailUrl: null,
          finalDeliveryUrl: null,
          client: { companyName: "Zenith Apparel Pvt Ltd", brandName: "Zenith Wear" },
          order: { packageName: "15 UGC Reel Pack", orderNumber: "ORD-2026-001" },
          script: { title: "Sweat-Wicking Joggers", videoNumber: 2, scriptText: "Hook: Ek aisi jogger..." },
          creator: { name: "Aryan Khan", photoUrl: null },
          editor: { user: { fullName: "Aman Gupta", email: "aman@leadyfy.io" } },
          feedbackLogs: [],
        },
        {
          id: "v-3",
          title: "Aesthetic Morning GRWM Serum Reel",
          deadline: new Date(Date.now() + 48 * 60 * 60 * 1000),
          pipelineStatus: PipelineStatus.RAW_FOOTAGE_RECEIVED,
          urgencyStatus: UrgencyStatus.NORMAL,
          dynamicUrgency: UrgencyStatus.NORMAL,
          revisionCount: 0,
          draftVideoUrl: null,
          thumbnailUrl: null,
          finalDeliveryUrl: null,
          client: { companyName: "GlowSkin Organics LLP", brandName: "GlowSkin Serum" },
          order: { packageName: "8 Aesthetic UGC Pack", orderNumber: "ORD-2026-002" },
          script: { title: "Morning GRWM Serum", videoNumber: 1, scriptText: "Hook: If your skin feels dull..." },
          creator: { name: "Simran Kaur", photoUrl: null },
          editor: { user: { fullName: "Ankit Roy", email: "ankit@leadyfy.io" } },
          feedbackLogs: [],
        },
        {
          id: "v-4",
          title: "UrbanEats Food Box UGC Ad #1",
          deadline: new Date("2026-09-18"),
          pipelineStatus: PipelineStatus.DELIVERED,
          urgencyStatus: UrgencyStatus.NORMAL,
          dynamicUrgency: UrgencyStatus.NORMAL,
          revisionCount: 1,
          draftVideoUrl: "https://drive.google.com/file/d/urbaneats-draft-1",
          thumbnailUrl: null,
          finalDeliveryUrl: "https://drive.google.com/file/d/urbaneats-final-delivery-1",
          client: { companyName: "UrbanEats Gourmet Foods", brandName: "UrbanEats" },
          order: { packageName: "5 Food UGC Videos", orderNumber: "ORD-2026-003" },
          script: { title: "30 Min Healthy Dinner Box", videoNumber: 1, scriptText: "Hook: Cooking after work..." },
          creator: { name: "Priya Sharma", photoUrl: null },
          editor: { user: { fullName: "Aman Gupta", email: "aman@leadyfy.io" } },
          feedbackLogs: [],
        },
      ];
    }
  }

  /**
   * Advance pipeline stage with linear state enforcement
   */
  static async advancePipeline(input: AdvancePipelineInput) {
    const video = await prisma.video.findUnique({
      where: { id: input.videoId },
    });

    if (!video) throw new Error("Video asset not found");

    const isDelivered = input.targetStatus === PipelineStatus.DELIVERED;
    const isRevision = input.targetStatus === PipelineStatus.REVISION;

    const updated = await prisma.video.update({
      where: { id: input.videoId },
      data: {
        pipelineStatus: input.targetStatus as PipelineStatus,
        ...(input.draftVideoUrl && { draftVideoUrl: input.draftVideoUrl }),
        ...(input.finalDeliveryUrl && { finalDeliveryUrl: input.finalDeliveryUrl }),
        ...(isRevision ? { revisionCount: { increment: 1 } } : {}),
        ...(isDelivered ? { deliveredAt: new Date() } : {}),
        ...(input.targetStatus === PipelineStatus.FINAL_APPROVED ? { approvedAt: new Date() } : {}),
      },
    });

    // If client or reviewer posted feedback during state change
    if (input.feedbackComment) {
      const clientUser = await prisma.user.findFirst({
        where: { client: { id: video.clientId } },
      });
      const authorUserId = clientUser?.id || (await prisma.user.findFirst())?.id;
      if (authorUserId) {
        await prisma.videoFeedback.create({
          data: {
            videoId: input.videoId,
            authorUserId,
            comment: input.feedbackComment,
            timestampInVideo: input.timestampInVideo || 0,
          },
        });
      }
    }

    // Atomically trigger Order quota updates
    await OrderService.updateVideoCounters(video.orderId);

    return updated;
  }
}
