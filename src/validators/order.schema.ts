import { z } from "zod";

export const OrderStatusEnum = z.enum([
  "NEW",
  "ONBOARDING",
  "IN_PRODUCTION",
  "PARTIALLY_DELIVERED",
  "COMPLETED",
  "ON_HOLD",
  "CANCELLED",
]);

export const CreateOrderSchema = z.object({
  clientId: z.string().uuid("Valid client must be selected"),
  packageName: z.string().min(2, "Package name is required"),
  contractedVideoCount: z.coerce.number().int().min(1, "At least 1 video required"),
  pricing: z.coerce.number().positive("Base pricing must be greater than 0"),
  gstRate: z.coerce.number().min(0).default(18.0),
  startDate: z.string().or(z.date()).transform((val) => new Date(val)),
  dueDate: z.string().or(z.date()).transform((val) => new Date(val)),
  assignedTeamId: z.string().optional().nullable(),
  status: OrderStatusEnum.default("NEW"),
});

export const UpdateOrderSchema = CreateOrderSchema.partial().extend({
  id: z.string().uuid("Invalid Order ID"),
});

export type CreateOrderInput = z.infer<typeof CreateOrderSchema>;
export type UpdateOrderInput = z.infer<typeof UpdateOrderSchema>;
