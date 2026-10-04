import { prisma } from "@/lib/prisma";
import {
  CreateCreatorInput,
  BookCreatorAvailabilityInput,
} from "@/validators/creator.schema";
import { AppError } from "@/lib/api-response";
import { Prisma, CreatorStatus, AvailabilityStatus } from "@prisma/client";

export class CreatorService {
  static async createCreator(input: CreateCreatorInput) {
    return await prisma.creator.create({
      data: {
        name: input.name,
        photoUrl: input.photoUrl || null,
        gender: input.gender || null,
        ageGroup: input.ageGroup || null,
        languages: input.languages || ["English"],
        location: input.location || null,
        niches: input.niches || [],
        demographics: input.demographics || null,
        contactPhone: input.contactPhone,
        contactEmail: input.contactEmail || null,
        ratesPerVideo: new Prisma.Decimal(input.ratesPerVideo),
        bankUpiInfo: input.bankUpiInfo || null,
        portfolioLinks: input.portfolioLinks || [],
        status: (input.status as CreatorStatus) || CreatorStatus.ACTIVE,
      },
    });
  }

  static async getCreators(params?: { niche?: string; status?: string }) {
    const where: Prisma.CreatorWhereInput = {};
    if (params?.status && params.status !== "ALL") {
      where.status = params.status as CreatorStatus;
    }
    if (params?.niche) where.niches = { has: params.niche };

    try {
      return await prisma.creator.findMany({
        where,
        include: {
          availabilities: {
            where: { date: { gte: new Date() } },
            orderBy: { date: "asc" },
          },
          _count: {
            select: {
              scripts: true,
              shoots: true,
              videos: true,
              payouts: true,
            },
          },
        },
        orderBy: { name: "asc" },
      });
    } catch {
      // Fallback demo creators
      return [
        {
          id: "cr-1",
          name: "Priya Sharma",
          photoUrl: null,
          gender: "Female",
          ageGroup: "22-26",
          languages: ["English", "Hindi"],
          location: "Mumbai, Maharashtra",
          niches: ["Fitness", "Fashion", "Lifestyle"],
          demographics: "Tier 1 Urban Gen-Z & Millennial",
          contactPhone: "+91 98200 11223",
          contactEmail: "priya.creator@gmail.com",
          ratesPerVideo: new Prisma.Decimal(6500),
          bankUpiInfo: "priya@okhdfcbank",
          portfolioLinks: ["https://instagram.com/priyasharma.ugc"],
          rating: 4.9,
          status: CreatorStatus.ACTIVE,
          availabilities: [
            { id: "av-1", date: new Date("2026-09-28"), timeSlot: "MORNING", status: AvailabilityStatus.BOOKED },
            { id: "av-2", date: new Date("2026-09-30"), timeSlot: "FULL_DAY", status: AvailabilityStatus.AVAILABLE },
          ],
          _count: { scripts: 4, shoots: 3, videos: 4, payouts: 2 },
        },
        {
          id: "cr-2",
          name: "Aryan Khan",
          photoUrl: null,
          gender: "Male",
          ageGroup: "24-28",
          languages: ["Hindi", "English"],
          location: "Delhi NCR",
          niches: ["Gym", "Tech", "Men's Grooming"],
          demographics: "Male Fitness Enthusiasts (18-35)",
          contactPhone: "+91 98111 22334",
          contactEmail: "aryan.fitness@gmail.com",
          ratesPerVideo: new Prisma.Decimal(7000),
          bankUpiInfo: "aryan@icici",
          portfolioLinks: ["https://tiktok.com/@aryankhan.fits"],
          rating: 4.8,
          status: CreatorStatus.ACTIVE,
          availabilities: [
            { id: "av-3", date: new Date("2026-09-29"), timeSlot: "AFTERNOON", status: AvailabilityStatus.AVAILABLE },
          ],
          _count: { scripts: 6, shoots: 5, videos: 5, payouts: 4 },
        },
        {
          id: "cr-3",
          name: "Simran Kaur",
          photoUrl: null,
          gender: "Female",
          ageGroup: "20-24",
          languages: ["English", "Punjabi"],
          location: "Chandigarh / Mumbai",
          niches: ["Skincare", "Beauty", "GRWM"],
          demographics: "Female Skincare & D2C Shoppers",
          contactPhone: "+91 98722 33445",
          contactEmail: "simran.glow@gmail.com",
          ratesPerVideo: new Prisma.Decimal(6000),
          bankUpiInfo: "simran@paytm",
          portfolioLinks: ["https://instagram.com/simran_ugc"],
          rating: 5.0,
          status: CreatorStatus.ACTIVE,
          availabilities: [],
          _count: { scripts: 3, shoots: 2, videos: 3, payouts: 1 },
        },
      ];
    }
  }

  /**
   * Book Creator Availability with Double-Booking Prevention Rule
   */
  static async bookAvailability(input: BookCreatorAvailabilityInput) {
    const existingBooking = await prisma.creatorAvailability.findUnique({
      where: {
        creatorId_date_timeSlot: {
          creatorId: input.creatorId,
          date: input.date,
          timeSlot: input.timeSlot,
        },
      },
    });

    if (existingBooking && existingBooking.status === AvailabilityStatus.BOOKED) {
      throw new AppError(
        `Creator is already BOOKED for ${input.timeSlot} on ${input.date.toDateString()}. Double-booking is prohibited.`,
        409
      );
    }

    return await prisma.creatorAvailability.upsert({
      where: {
        creatorId_date_timeSlot: {
          creatorId: input.creatorId,
          date: input.date,
          timeSlot: input.timeSlot,
        },
      },
      update: {
        status: input.status as AvailabilityStatus,
        shootId: input.shootId || null,
      },
      create: {
        creatorId: input.creatorId,
        date: input.date,
        timeSlot: input.timeSlot,
        status: input.status as AvailabilityStatus,
        shootId: input.shootId || null,
      },
    });
  }
}
