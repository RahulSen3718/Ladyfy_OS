import { z } from "zod";

export const PipelineStatusEnum = z.enum([
  "SCRIPT_APPROVED",
  "SHOOT_PENDING",
  "RAW_FOOTAGE_RECEIVED",
  "VIDEO_EDITING",
  "INTERNAL_QA",
  "CLIENT_REVIEW",
  "REVISION",
  "FINAL_APPROVED",
  "DELIVERED",
]);

export const UrgencyStatusEnum = z.enum([
  "NORMAL",
  "DUE_TOMORROW",
  "DUE_TODAY",
  "OVERDUE",
]);

export const CreateVideoSchema = z.object({
  clientId: z.string().uuid("Valid client must be selected"),
  orderId: z.string().uuid("Valid order must be selected"),
  scriptId: z.string().uuid("Valid script must be selected"),
  shootId: z.string().uuid().optional().nullable(),
  creatorId: z.string().uuid().optional().nullable(),
  assignedEditorId: z.string().uuid().optional().nullable(),
  title: z.string().min(2, "Video deliverable title is required"),
  deadline: z.string().or(z.date()).transform((v) => new Date(v)),
  pipelineStatus: PipelineStatusEnum.default("SCRIPT_APPROVED"),
  draftVideoUrl: z.string().url("Must be valid URL").optional().or(z.literal("")).nullable(),
  thumbnailUrl: z.string().url("Must be valid URL").optional().or(z.literal("")).nullable(),
  finalDeliveryUrl: z.string().url("Must be valid URL").optional().or(z.literal("")).nullable(),
});

export const AdvancePipelineSchema = z.object({
  videoId: z.string().uuid("Invalid Video ID"),
  targetStatus: PipelineStatusEnum,
  draftVideoUrl: z.string().optional(),
  finalDeliveryUrl: z.string().optional(),
  feedbackComment: z.string().optional(),
  timestampInVideo: z.number().optional(),
});

export type CreateVideoInput = z.infer<typeof CreateVideoSchema>;
export type AdvancePipelineInput = z.infer<typeof AdvancePipelineSchema>;
