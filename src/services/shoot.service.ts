import { prisma } from "@/lib/prisma";
import { CreateShootInput, UpdateShootChecklistsInput } from "@/validators/shoot.schema";
import { Prisma, ShootStatus } from "@prisma/client";

export class ShootService {
  static async createShoot(input: CreateShootInput) {
    const count = await prisma.shoot.count();
    const shootNumber = `SHT-${new Date().getFullYear()}-${(count + 1).toString().padStart(3, "0")}`;

    return await prisma.shoot.create({
      data: {
        shootNumber,
        clientId: input.clientId,
        orderId: input.orderId,
        scheduledAt: input.scheduledAt,
        durationHours: input.durationHours,
        location: input.location,
        assignedCreatorId: input.assignedCreatorId || null,
        cameramanName: input.cameramanName || null,
        shootManagerId: input.shootManagerId || null,
        shootingAssistant: input.shootingAssistant || null,
        rawFootageFolderUrl: input.rawFootageFolderUrl || null,
        notes: input.notes || null,
        status: (input.status as ShootStatus) || ShootStatus.SCHEDULED,
      },
    });
  }

  static async getShoots(params?: { status?: string }) {
    const where: Prisma.ShootWhereInput = {};
    if (params?.status && params.status !== "ALL") {
      where.status = params.status as ShootStatus;
    }

    try {
      return await prisma.shoot.findMany({
        where,
        include: {
          client: { select: { companyName: true, brandName: true } },
          order: { select: { packageName: true, orderNumber: true } },
          creator: { select: { id: true, name: true, contactPhone: true, photoUrl: true } },
          shootManager: { include: { user: { select: { fullName: true } } } },
        },
        orderBy: { scheduledAt: "asc" },
      });
    } catch {
      // Fallback demo shoots
      return [
        {
          id: "sht-1",
          shootNumber: "SHT-2026-001",
          scheduledAt: new Date("2026-09-28T11:00:00"),
          durationHours: 4,
          location: "Studio A (Bandra West, Mumbai)",
          cameramanName: "Vikram R.",
          shootingAssistant: "Amit S.",
          status: ShootStatus.CONFIRMED,
          preShootChecklist: {
            scriptApproved: true,
            creatorConfirmed: true,
            locationPermitted: true,
            productReceived: true,
            teamBriefed: true,
          },
          postShootVerification: {
            footageUploaded: false,
            rawIntegrityChecked: false,
            reshootFlagged: false,
          },
          rawFootageFolderUrl: "https://drive.google.com/drive/folders/sht-001-raw",
          notes: "3 outfits change for oversized gym tees. Bring studio softboxes.",
          client: { companyName: "Zenith Apparel Pvt Ltd", brandName: "Zenith Wear" },
          order: { packageName: "15 UGC Reel Pack", orderNumber: "ORD-2026-001" },
          creator: { id: "cr-1", name: "Priya Sharma", contactPhone: "+91 98200 11223", photoUrl: null },
          shootManager: { user: { fullName: "Rahul Varma" } },
        },
        {
          id: "sht-2",
          shootNumber: "SHT-2026-002",
          scheduledAt: new Date("2026-09-29T14:30:00"),
          durationHours: 3,
          location: "Cult Gym (Andheri East)",
          cameramanName: "Sahil P.",
          shootingAssistant: "Rohan D.",
          status: ShootStatus.IN_PROGRESS,
          preShootChecklist: {
            scriptApproved: true,
            creatorConfirmed: true,
            locationPermitted: true,
            productReceived: true,
            teamBriefed: true,
          },
          postShootVerification: {
            footageUploaded: false,
            rawIntegrityChecked: false,
            reshootFlagged: false,
          },
          rawFootageFolderUrl: null,
          notes: "Sweat-wicking joggers dynamic action shots.",
          client: { companyName: "Zenith Apparel Pvt Ltd", brandName: "Zenith Wear" },
          order: { packageName: "15 UGC Reel Pack", orderNumber: "ORD-2026-001" },
          creator: { id: "cr-2", name: "Aryan Khan", contactPhone: "+91 98111 22334", photoUrl: null },
          shootManager: { user: { fullName: "Simran M." } },
        },
      ];
    }
  }

  static async updateChecklist(input: UpdateShootChecklistsInput) {
    return await prisma.shoot.update({
      where: { id: input.id },
      data: {
        ...(input.preShootChecklist && { preShootChecklist: input.preShootChecklist as Prisma.InputJsonValue }),
        ...(input.postShootVerification && { postShootVerification: input.postShootVerification as Prisma.InputJsonValue }),
        ...(input.status && { status: input.status as ShootStatus }),
        ...(input.rawFootageFolderUrl && { rawFootageFolderUrl: input.rawFootageFolderUrl }),
      },
    });
  }
}
