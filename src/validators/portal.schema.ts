import { z } from "zod";

export const ClientVideoFeedbackSchema = z.object({
  videoId: z.string().uuid("Invalid video ID"),
  timestampInVideo: z.number().min(0).default(0),
  comment: z.string().min(2, "Feedback comment is required"),
});

export const ClientVideoDecisionSchema = z.object({
  videoId: z.string().uuid("Invalid video ID"),
  action: z.enum(["APPROVE", "REQUEST_REVISION"]),
  revisionNotes: z.string().optional(),
});

export const CreateSupportTicketSchema = z.object({
  clientId: z.string().uuid("Invalid client ID"),
  subject: z.string().min(3, "Subject is required"),
  description: z.string().min(5, "Description is required"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).default("MEDIUM"),
});

export type ClientVideoFeedbackInput = z.infer<typeof ClientVideoFeedbackSchema>;
export type ClientVideoDecisionInput = z.infer<typeof ClientVideoDecisionSchema>;
export type CreateSupportTicketInput = z.infer<typeof CreateSupportTicketSchema>;
