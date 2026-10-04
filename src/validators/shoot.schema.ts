import { z } from "zod";

export const ShootStatusEnum = z.enum([
  "SCHEDULED",
  "CONFIRMED",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
  "RESHOOT_REQUIRED",
]);

export const CreateShootSchema = z.object({
  clientId: z.string().uuid("Valid client must be selected"),
  orderId: z.string().uuid("Valid order must be selected"),
  scheduledAt: z.string().or(z.date()).transform((v) => new Date(v)),
  durationHours: z.coerce.number().min(1).default(4),
  location: z.string().min(2, "Shoot location is required"),
  assignedCreatorId: z.string().uuid().optional().nullable(),
  cameramanName: z.string().optional().nullable(),
  shootManagerId: z.string().uuid().optional().nullable(),
  shootingAssistant: z.string().optional().nullable(),
  rawFootageFolderUrl: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  status: ShootStatusEnum.default("SCHEDULED"),
});

export const UpdateShootChecklistsSchema = z.object({
  id: z.string().uuid("Invalid Shoot ID"),
  preShootChecklist: z
    .object({
      scriptApproved: z.boolean(),
      creatorConfirmed: z.boolean(),
      locationPermitted: z.boolean(),
      productReceived: z.boolean(),
      teamBriefed: z.boolean(),
    })
    .optional(),
  postShootVerification: z
    .object({
      footageUploaded: z.boolean(),
      rawIntegrityChecked: z.boolean(),
      reshootFlagged: z.boolean(),
    })
    .optional(),
  status: ShootStatusEnum.optional(),
  rawFootageFolderUrl: z.string().optional(),
});

export type CreateShootInput = z.infer<typeof CreateShootSchema>;
export type UpdateShootChecklistsInput = z.infer<typeof UpdateShootChecklistsSchema>;
