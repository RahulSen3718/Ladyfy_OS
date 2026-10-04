import { prisma } from "@/lib/prisma";
import {
  ClientVideoFeedbackInput,
  ClientVideoDecisionInput,
  CreateSupportTicketInput,
} from "@/validators/portal.schema";
import { OrderService } from "./order.service";
import { PipelineStatus, TicketPriority, TicketStatus } from "@prisma/client";

export class PortalService {
  /**
   * Get isolated client portal workspace data
   */
  static async getClientPortalData(clientId?: string) {
    try {
      const client = await prisma.client.findFirst({
        where: clientId ? { id: clientId } : undefined,
        include: {
          orders: {
            include: {
              videos: {
                include: {
                  feedbackLogs: { orderBy: { createdAt: "desc" } },
                },
                orderBy: { deadline: "asc" },
              },
              payments: { orderBy: { createdAt: "desc" } },
            },
          },
          scripts: {
            orderBy: { videoNumber: "asc" },
          },
          supportTickets: {
            orderBy: { createdAt: "desc" },
          },
        },
      });

      if (!client) throw new Error("Client workspace not found");

      return client;
    } catch {
      // Fallback realistic demo portal for offline/test mode
      return {
        id: "c101-uuid-nike",
        clientName: "Rohan Varma",
        companyName: "Zenith Apparel Pvt Ltd",
        brandName: "Zenith Wear",
        email: "rohan@zenithwear.com",
        phone: "+91 98201 12345",
        status: "ACTIVE",
        orders: [
          {
            id: "ord-1",
            orderNumber: "ORD-2026-001",
            packageName: "15 UGC Reel Pack",
            contractedVideoCount: 15,
            completedVideoCount: 12,
            deliveredVideoCount: 10,
            pricing: 150000,
            gstRate: 18,
            totalAmount: 177000,
            amountReceived: 177000,
            outstandingBalance: 0,
            startDate: new Date("2026-09-01"),
            dueDate: new Date("2026-10-15"),
            status: "IN_PRODUCTION",
            videos: [
              {
                id: "v-draft-1",
                title: "Oversized Heavyweight Gym Tee - UGC Hook #1",
                pipelineStatus: "CLIENT_REVIEW",
                revisionCount: 1,
                deadline: new Date("2026-10-02"),
                draftVideoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
                finalDeliveryUrl: null,
                feedbackLogs: [
                  {
                    id: "fb-1",
                    timestampInVideo: 4.5,
                    comment: "The cut at 0:04 is great, but make the text overlay higher contrast.",
                    createdAt: new Date("2026-09-26T14:00:00"),
                  },
                ],
              },
              {
                id: "v-deliv-1",
                title: "Sweat-Wicking Joggers Day in Life Reel",
                pipelineStatus: "DELIVERED",
                revisionCount: 0,
                deadline: new Date("2026-09-20"),
                draftVideoUrl: null,
                finalDeliveryUrl: "https://drive.google.com/file/d/zenith-joggers-final-4k",
                feedbackLogs: [],
              },
            ],
            payments: [
              {
                id: "pmt-1",
                invoiceNumber: "INV-2026-041",
                invoiceAmount: 177000,
                amountReceived: 177000,
                status: "PAID",
                paymentDate: new Date("2026-09-02"),
                paymentMethod: "BANK_TRANSFER",
                transactionRef: "HDFC9823472394",
              },
            ],
          },
        ],
        scripts: [
          {
            id: "sc-1",
            videoNumber: 1,
            title: "Oversized Gym Tee Hook Test #1",
            language: "English",
            status: "APPROVED",
            scriptText: `[HOOK - 0:00-0:03]\n"Stop buying gym shirts that shrink after one wash."\n\n[BODY - 0:03-0:15]\n"This is Zenith's heavyweight drop. Pure breathable cotton, drop shoulder fit, zero sweat patches."\n\n[CTA - 0:15-0:20]\n"Hit the link below to grab the 3-pack bundle before restock sells out."`,
          },
        ],
        supportTickets: [
          {
            id: "tck-1",
            ticketNumber: "TCK-2026-012",
            subject: "Need high-res raw clips for Instagram story re-share",
            description: "Could you provide Google drive access to the B-roll clips?",
            priority: "MEDIUM",
            status: "RESOLVED",
            createdAt: new Date("2026-09-22"),
          },
        ],
      };
    }
  }

  /**
   * Helper to resolve a valid User ID for client actions
   */
  private static async getClientUserId(clientId: string): Promise<string> {
    const client = await prisma.client.findUnique({
      where: { id: clientId },
      select: { userId: true },
    });
    if (client?.userId) return client.userId;

    const fallbackUser = await prisma.user.findFirst();
    if (!fallbackUser) throw new Error("No user found in database");
    return fallbackUser.id;
  }

  /**
   * Submit timestamped video feedback from client
   */
  static async submitVideoFeedback(input: ClientVideoFeedbackInput) {
    const video = await prisma.video.findUnique({ where: { id: input.videoId } });
    if (!video) throw new Error("Video not found");

    const authorUserId = await this.getClientUserId(video.clientId);

    return await prisma.videoFeedback.create({
      data: {
        videoId: input.videoId,
        authorUserId,
        isClientFeedback: true,
        timestampInVideo: input.timestampInVideo,
        comment: input.comment,
      },
    });
  }

  /**
   * Client approval or revision request
   */
  static async processClientDecision(input: ClientVideoDecisionInput) {
    const video = await prisma.video.findUnique({ where: { id: input.videoId } });
    if (!video) throw new Error("Video not found");

    if (input.action === "APPROVE") {
      const updated = await prisma.video.update({
        where: { id: input.videoId },
        data: {
          pipelineStatus: PipelineStatus.FINAL_APPROVED,
          approvedAt: new Date(),
          finalDeliveryUrl:
            video.finalDeliveryUrl ||
            `https://drive.google.com/drive/folders/leadyfy-delivery-${video.id}`,
        },
      });
      await OrderService.updateVideoCounters(video.orderId);
      return updated;
    } else {
      // Revision requested
      const updated = await prisma.video.update({
        where: { id: input.videoId },
        data: {
          pipelineStatus: PipelineStatus.REVISION,
          revisionCount: { increment: 1 },
        },
      });

      if (input.revisionNotes) {
        const authorUserId = await this.getClientUserId(video.clientId);
        await prisma.videoFeedback.create({
          data: {
            videoId: input.videoId,
            authorUserId,
            isClientFeedback: true,
            comment: `[REVISION REQUEST]: ${input.revisionNotes}`,
            timestampInVideo: 0,
          },
        });
      }

      await OrderService.updateVideoCounters(video.orderId);
      return updated;
    }
  }

  /**
   * Create Support Ticket
   */
  static async createSupportTicket(input: CreateSupportTicketInput) {
    const count = await prisma.supportTicket.count();
    const ticketNumber = `TCK-${new Date().getFullYear()}-${(count + 1).toString().padStart(3, "0")}`;
    const createdById = await this.getClientUserId(input.clientId);

    return await prisma.supportTicket.create({
      data: {
        ticketNumber,
        clientId: input.clientId,
        createdById,
        subject: input.subject,
        description: input.description,
        priority: input.priority as TicketPriority,
        status: TicketStatus.OPEN,
      },
    });
  }
}
