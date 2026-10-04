import { prisma } from "@/lib/prisma";
import { CreateScriptInput } from "@/validators/script.schema";
import { Prisma, ScriptStatus } from "@prisma/client";

export class ScriptService {
  static async createScript(input: CreateScriptInput) {
    return await prisma.script.create({
      data: {
        clientId: input.clientId,
        orderId: input.orderId,
        videoNumber: input.videoNumber,
        title: input.title,
        writerId: input.writerId || null,
        creatorId: input.creatorId || null,
        language: input.language || "English",
        scriptText: input.scriptText,
        referenceLinks: input.referenceLinks || null,
        deadline: input.deadline ? new Date(input.deadline) : null,
        status: (input.status as ScriptStatus) || ScriptStatus.DRAFT,
        clientComments: input.clientComments || null,
      },
    });
  }

  static async getScripts(params?: { clientId?: string; status?: string; writerId?: string }) {
    const where: Prisma.ScriptWhereInput = {};
    if (params?.clientId) where.clientId = params.clientId;
    if (params?.status && params.status !== "ALL") {
      where.status = params.status as ScriptStatus;
    }
    if (params?.writerId) where.writerId = params.writerId;

    try {
      return await prisma.script.findMany({
        where,
        include: {
          client: { select: { companyName: true, brandName: true } },
          order: { select: { packageName: true, orderNumber: true } },
          writer: { include: { user: { select: { fullName: true } } } },
          creator: { select: { name: true, photoUrl: true } },
        },
        orderBy: [{ orderId: "asc" }, { videoNumber: "asc" }],
      });
    } catch {
      // Fallback demo scripts
      return [
        {
          id: "s1-uuid",
          videoNumber: 1,
          title: "Oversized Heavyweight Gym Tee - Hook Test #1",
          language: "English",
          scriptText: `[HOOK - 0:00-0:03]\n(Creator looks in gym mirror holding ordinary tee, sighs)\n"Stop buying gym shirts that shrink after one wash."\n\n[BODY - 0:03-0:15]\n(Cut to wearing Zenith 240GSM Oversized Tee)\n"This is Zenith's heavyweight drop. Pure breathable cotton, drop shoulder fit, zero sweat patches."\n\n[CTA - 0:15-0:20]\n"Hit the link below to grab the 3-pack bundle before restock sells out."`,
          referenceLinks: "https://tiktok.com/@example/gym-hook-1",
          deadline: new Date("2026-10-01"),
          revisionCount: 1,
          status: ScriptStatus.READY_FOR_SHOOT,
          clientComments: "Loved the hook! Approved for production.",
          client: { companyName: "Zenith Apparel Pvt Ltd", brandName: "Zenith Wear" },
          order: { packageName: "15 UGC Reel Pack", orderNumber: "ORD-2026-001" },
          writer: { user: { fullName: "Devika Sen" } },
          creator: { name: "Priya Sharma", photoUrl: null },
        },
        {
          id: "s2-uuid",
          videoNumber: 2,
          title: "Sweat-Wicking Joggers - Day in the Life Reel",
          language: "Hindi",
          scriptText: `[HOOK - 0:00-0:03]\n"Ek aisi jogger jo gym aur airport dono me stylish lage?"\n\n[BODY - 0:03-0:15]\n(B-roll doing deadlifts then walking into a cafe)\n"4-way stretch fabric with deep zippered pockets."\n\n[CTA - 0:15-0:20]\n"Order today on zenithwear.com and get 20% off code UGC20."`,
          referenceLinks: null,
          deadline: new Date("2026-10-03"),
          revisionCount: 0,
          status: ScriptStatus.APPROVED,
          clientComments: null,
          client: { companyName: "Zenith Apparel Pvt Ltd", brandName: "Zenith Wear" },
          order: { packageName: "15 UGC Reel Pack", orderNumber: "ORD-2026-001" },
          writer: { user: { fullName: "Aarav Sharma" } },
          creator: { name: "Aryan Khan", photoUrl: null },
        },
        {
          id: "s3-uuid",
          videoNumber: 1,
          title: "Aesthetic Morning GRWM + Vitamin C Serum",
          language: "English",
          scriptText: `[HOOK - 0:00-0:03]\n(Close up on dull skin vs glowing cheek)\n"If your skin feels dull every morning, you're missing this step."\n\n[BODY - 0:03-0:15]\n(Applying 3 drops of GlowSkin Serum)\n"15% active ethyl ascorbic acid. Absorbs in 10 seconds with zero stickiness."\n\n[CTA - 0:15-0:20]\n"Tap shop now to get your morning glow back."`,
          referenceLinks: "https://instagram.com/reel/glowskin-sample",
          deadline: new Date("2026-10-05"),
          revisionCount: 2,
          status: ScriptStatus.IN_REVIEW,
          clientComments: "Please emphasize the non-sticky formula more in body.",
          client: { companyName: "GlowSkin Organics LLP", brandName: "GlowSkin Serum" },
          order: { packageName: "8 Aesthetic UGC Pack", orderNumber: "ORD-2026-002" },
          writer: { user: { fullName: "Devika Sen" } },
          creator: { name: "Simran Kaur", photoUrl: null },
        },
      ];
    }
  }

  static async updateScriptStatus(id: string, status: ScriptStatus, clientComments?: string) {
    return await prisma.script.update({
      where: { id },
      data: {
        status,
        ...(clientComments !== undefined && { clientComments }),
        ...(status === ScriptStatus.REVISION_REQUIRED ? { revisionCount: { increment: 1 } } : {}),
      },
    });
  }
}
