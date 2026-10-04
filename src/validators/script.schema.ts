import { z } from "zod";

export const ScriptStatusEnum = z.enum([
  "DRAFT",
  "ASSIGNED",
  "IN_REVIEW",
  "SENT_TO_CLIENT",
  "REVISION_REQUIRED",
  "APPROVED",
  "READY_FOR_SHOOT",
]);

export const CreateScriptSchema = z.object({
  clientId: z.string().uuid("Valid client must be selected"),
  orderId: z.string().uuid("Valid order must be selected"),
  videoNumber: z.coerce.number().int().min(1).default(1),
  title: z.string().min(2, "Script title is required"),
  writerId: z.string().optional().nullable(),
  creatorId: z.string().optional().nullable(),
  language: z.string().default("English"),
  scriptText: z.string().min(10, "Script body must be at least 10 characters"),
  referenceLinks: z.string().optional().nullable(),
  deadline: z.string().or(z.date()).optional().nullable(),
  status: ScriptStatusEnum.default("DRAFT"),
  clientComments: z.string().optional().nullable(),
});

export const UpdateScriptSchema = CreateScriptSchema.partial().extend({
  id: z.string().uuid("Invalid script ID"),
  incrementRevision: z.boolean().optional(),
});

export type CreateScriptInput = z.infer<typeof CreateScriptSchema>;
export type UpdateScriptInput = z.infer<typeof UpdateScriptSchema>;
