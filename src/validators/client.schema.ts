import { z } from "zod";

export const ClientStatusEnum = z.enum([
  "LEAD",
  "NEW",
  "ONBOARDING",
  "ACTIVE",
  "ON_HOLD",
  "COMPLETED",
  "INACTIVE",
]);

export const CreateClientSchema = z.object({
  clientName: z.string().min(2, "Client contact name is required (min 2 characters)"),
  companyName: z.string().min(2, "Company name is required (min 2 characters)"), // Canonical naming
  email: z.string().email("Invalid email address"),
  phone: z.string().min(8, "Phone number is required"),
  whatsapp: z.string().optional().nullable(),
  brandName: z.string().min(2, "Brand name is required"),
  industry: z.string().optional().nullable(),
  gstTaxId: z.string().optional().nullable(),
  assignedEmployeeId: z.string().optional().nullable(),
  source: z.string().optional().default("Direct"),
  status: ClientStatusEnum.default("NEW"),
  brandKitUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")).nullable(),
  notes: z.string().optional().nullable(),
});

export const UpdateClientSchema = CreateClientSchema.partial().extend({
  id: z.string().uuid("Invalid Client ID"),
});

export type CreateClientInput = z.infer<typeof CreateClientSchema>;
export type UpdateClientInput = z.infer<typeof UpdateClientSchema>;
