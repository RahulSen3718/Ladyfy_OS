import { z } from "zod";

export const CreatorStatusEnum = z.enum(["ACTIVE", "INACTIVE", "BLACKLISTED"]);
export const AvailabilityStatusEnum = z.enum(["AVAILABLE", "BOOKED", "UNAVAILABLE", "ON_HOLD"]);

export const CreateCreatorSchema = z.object({
  name: z.string().min(2, "Creator name is required"),
  photoUrl: z.string().url("Must be valid photo URL").optional().or(z.literal("")).nullable(),
  gender: z.string().optional().nullable(),
  ageGroup: z.string().optional().nullable(),
  languages: z.array(z.string()).default(["English"]),
  location: z.string().optional().nullable(),
  niches: z.array(z.string()).default([]),
  demographics: z.string().optional().nullable(),
  contactPhone: z.string().min(8, "Contact phone is required"),
  contactEmail: z.string().email().optional().or(z.literal("")).nullable(),
  ratesPerVideo: z.coerce.number().min(0, "Rate per video is required"),
  bankUpiInfo: z.string().optional().nullable(),
  portfolioLinks: z.array(z.string()).default([]),
  status: CreatorStatusEnum.default("ACTIVE"),
});

export const BookCreatorAvailabilitySchema = z.object({
  creatorId: z.string().uuid("Invalid Creator ID"),
  date: z.string().or(z.date()).transform((v) => new Date(v)),
  timeSlot: z.string().min(1, "Time slot is required (e.g. MORNING, AFTERNOON, FULL_DAY)"),
  status: AvailabilityStatusEnum.default("BOOKED"),
  shootId: z.string().uuid().optional().nullable(),
});

export const UpdateCreatorSchema = CreateCreatorSchema.partial().extend({
  id: z.string().uuid("Invalid Creator ID"),
});

export type CreateCreatorInput = z.infer<typeof CreateCreatorSchema>;
export type UpdateCreatorInput = z.infer<typeof UpdateCreatorSchema>;
export type BookCreatorAvailabilityInput = z.infer<typeof BookCreatorAvailabilitySchema>;
