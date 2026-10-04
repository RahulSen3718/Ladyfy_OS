import { z } from "zod";

export const PaymentStatusEnum = z.enum(["UNPAID", "PARTIALLY_PAID", "PAID", "OVERDUE"]);
export const PaymentMethodEnum = z.enum(["BANK_TRANSFER", "UPI", "STRIPE", "CASH", "OTHER"]);
export const ExpenseCategoryEnum = z.enum([
  "SALARIES",
  "OFFICE",
  "STUDIO",
  "EQUIPMENT",
  "FUEL",
  "PAYOUTS",
  "MARKETING",
  "MISC",
]);
export const PayoutStatusEnum = z.enum(["PENDING", "APPROVED", "PAID"]);

export const RecordPaymentSchema = z.object({
  clientId: z.string().uuid("Invalid client ID"),
  orderId: z.string().uuid("Invalid order ID"),
  invoiceAmount: z.coerce.number().positive(),
  amountReceived: z.coerce.number().min(0),
  paymentDate: z.string().or(z.date()).optional().nullable(),
  paymentMethod: PaymentMethodEnum.default("BANK_TRANSFER"),
  transactionRef: z.string().optional().nullable(),
  status: PaymentStatusEnum.default("UNPAID"),
  receiptUrl: z.string().url().optional().or(z.literal("")).nullable(),
  notes: z.string().optional().nullable(),
});

export const RecordExpenseSchema = z.object({
  category: ExpenseCategoryEnum,
  amount: z.coerce.number().positive("Amount must be positive"),
  expenseDate: z.string().or(z.date()).transform((v) => new Date(v)),
  description: z.string().min(2, "Description is required"),
  receiptFileUrl: z.string().url().optional().or(z.literal("")).nullable(),
});

export const RecordCreatorPayoutSchema = z.object({
  creatorId: z.string().uuid("Invalid Creator ID"),
  orderId: z.string().uuid("Invalid Order ID"),
  videoId: z.string().uuid().optional().nullable(),
  videoCount: z.coerce.number().min(1).default(1),
  contractedRate: z.coerce.number().positive(),
  paymentDate: z.string().or(z.date()).optional().nullable(),
  transactionReference: z.string().optional().nullable(),
  status: PayoutStatusEnum.default("PENDING"),
  notes: z.string().optional().nullable(),
});

export type RecordPaymentInput = z.infer<typeof RecordPaymentSchema>;
export type RecordExpenseInput = z.infer<typeof RecordExpenseSchema>;
export type RecordCreatorPayoutInput = z.infer<typeof RecordCreatorPayoutSchema>;
