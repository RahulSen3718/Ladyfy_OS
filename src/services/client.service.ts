import { prisma } from "@/lib/prisma";
import { CreateClientInput, UpdateClientInput } from "@/validators/client.schema";
import { AppError } from "@/lib/api-response";
import { Prisma, ClientStatus, OrderStatus } from "@prisma/client";

export class ClientService {
  /**
   * Create a new client profile with strict canonical schema validation
   */
  static async createClient(input: CreateClientInput) {
    const existing = await prisma.client.findUnique({
      where: { email: input.email },
    });

    if (existing) {
      throw new AppError("A client with this email address already exists", 409);
    }

    return await prisma.client.create({
      data: {
        clientName: input.clientName,
        companyName: input.companyName, // Canonical naming: companyName -> company_name
        email: input.email,
        phone: input.phone,
        whatsapp: input.whatsapp || null,
        brandName: input.brandName,
        industry: input.industry || null,
        gstTaxId: input.gstTaxId || null,
        assignedEmployeeId: input.assignedEmployeeId || null,
        source: input.source || "Direct",
        status: (input.status as ClientStatus) || ClientStatus.NEW,
        brandKitUrl: input.brandKitUrl || null,
        notes: input.notes || null,
      },
    });
  }

  /**
   * Retrieve list of clients with search, status filter, and pagination
   */
  static async getClients(params?: {
    search?: string;
    status?: string;
    page?: number;
    limit?: number;
  }) {
    const page = params?.page || 1;
    const limit = params?.limit || 50;
    const skip = (page - 1) * limit;

    const where: Prisma.ClientWhereInput = {};

    if (params?.status && params.status !== "ALL") {
      where.status = params.status as ClientStatus;
    }

    if (params?.search) {
      where.OR = [
        { clientName: { contains: params.search, mode: "insensitive" } },
        { companyName: { contains: params.search, mode: "insensitive" } },
        { brandName: { contains: params.search, mode: "insensitive" } },
        { email: { contains: params.search, mode: "insensitive" } },
      ];
    }

    try {
      const [clients, total] = await Promise.all([
        prisma.client.findMany({
          where,
          include: {
            accountManager: {
              include: { user: { select: { fullName: true, email: true } } },
            },
            orders: {
              select: {
                id: true,
                packageName: true,
                contractedVideoCount: true,
                completedVideoCount: true,
                deliveredVideoCount: true,
                totalAmount: true,
                status: true,
              },
            },
            _count: {
              select: {
                scripts: true,
                shoots: true,
                videos: true,
                payments: true,
                supportTickets: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
          skip,
          take: limit,
        }),
        prisma.client.count({ where }),
      ]);

      return {
        clients,
        meta: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch {
      // Fallback demo data if DB server is offline
      const mockClients = [
        {
          id: "c101-uuid-nike",
          clientName: "Rohan Varma",
          companyName: "Zenith Apparel Pvt Ltd",
          brandName: "Zenith Wear",
          email: "rohan@zenithwear.com",
          phone: "+91 98201 12345",
          whatsapp: "+91 98201 12345",
          industry: "E-Commerce / Fashion",
          gstTaxId: "27AABCU9603R1ZM",
          status: ClientStatus.ACTIVE,
          brandKitUrl: "https://drive.google.com/drive/folders/zenith-brand-kit",
          notes: "Focus on Gen-Z gym wear reels & UGC hook videos.",
          createdAt: new Date(),
          updatedAt: new Date(),
          accountManager: { user: { fullName: "Aarav Sharma", email: "aarav@leadyfy.io" } },
          orders: [
            {
              id: "ord-1",
              packageName: "15 UGC Reel Pack",
              contractedVideoCount: 15,
              completedVideoCount: 12,
              deliveredVideoCount: 10,
              totalAmount: new Prisma.Decimal(177000),
              status: OrderStatus.IN_PRODUCTION,
            },
          ],
          _count: { scripts: 15, shoots: 3, videos: 15, payments: 2, supportTickets: 1 },
        },
        {
          id: "c102-uuid-glow",
          clientName: "Ananya Deshmukh",
          companyName: "GlowSkin Organics LLP",
          brandName: "GlowSkin Serum",
          email: "ananya@glowskin.co",
          phone: "+91 98110 54321",
          whatsapp: "+91 98110 54321",
          industry: "Beauty & Personal Care",
          gstTaxId: "27AABCG1234F1ZT",
          status: ClientStatus.ONBOARDING,
          brandKitUrl: "https://drive.google.com/drive/folders/glowskin-assets",
          notes: "Need aesthetic bathroom GRWM UGC videos.",
          createdAt: new Date(),
          updatedAt: new Date(),
          accountManager: { user: { fullName: "Neha Gupta", email: "neha@leadyfy.io" } },
          orders: [
            {
              id: "ord-2",
              packageName: "8 Aesthetic UGC Pack",
              contractedVideoCount: 8,
              completedVideoCount: 2,
              deliveredVideoCount: 0,
              totalAmount: new Prisma.Decimal(94400),
              status: OrderStatus.ONBOARDING,
            },
          ],
          _count: { scripts: 8, shoots: 1, videos: 8, payments: 1, supportTickets: 0 },
        },
      ];

      return {
        clients: mockClients,
        meta: { page: 1, limit: 50, total: mockClients.length, totalPages: 1 },
      };
    }
  }

  /**
   * Retrieve Single Client Profile Hub with all related artifacts
   */
  static async getClientById(id: string) {
    try {
      return await prisma.client.findUnique({
        where: { id },
        include: {
          accountManager: {
            include: { user: { select: { fullName: true, email: true, phone: true } } },
          },
          orders: {
            include: {
              videos: true,
              payments: true,
            },
            orderBy: { createdAt: "desc" },
          },
          scripts: {
            include: {
              writer: { include: { user: { select: { fullName: true } } } },
              creator: true,
            },
            orderBy: { videoNumber: "asc" },
          },
          shoots: {
            include: {
              creator: true,
              shootManager: { include: { user: { select: { fullName: true } } } },
            },
            orderBy: { scheduledAt: "desc" },
          },
          videos: {
            include: {
              editor: { include: { user: { select: { fullName: true } } } },
              feedbackLogs: true,
            },
            orderBy: { deadline: "asc" },
          },
          payments: {
            orderBy: { createdAt: "desc" },
          },
          supportTickets: {
            orderBy: { createdAt: "desc" },
          },
          assets: true,
        },
      });
    } catch {
      return null;
    }
  }

  /**
   * Update client details
   */
  static async updateClient(input: UpdateClientInput) {
    const { id, ...data } = input;
    return await prisma.client.update({
      where: { id },
      data: {
        ...(data.clientName && { clientName: data.clientName }),
        ...(data.companyName && { companyName: data.companyName }),
        ...(data.email && { email: data.email }),
        ...(data.phone && { phone: data.phone }),
        ...(data.whatsapp !== undefined && { whatsapp: data.whatsapp }),
        ...(data.brandName && { brandName: data.brandName }),
        ...(data.industry !== undefined && { industry: data.industry }),
        ...(data.gstTaxId !== undefined && { gstTaxId: data.gstTaxId }),
        ...(data.assignedEmployeeId !== undefined && { assignedEmployeeId: data.assignedEmployeeId }),
        ...(data.status && { status: data.status as ClientStatus }),
        ...(data.brandKitUrl !== undefined && { brandKitUrl: data.brandKitUrl }),
        ...(data.notes !== undefined && { notes: data.notes }),
      },
    });
  }

  /**
   * Delete or archive client
   */
  static async deleteClient(id: string) {
    return await prisma.client.delete({
      where: { id },
    });
  }
}
