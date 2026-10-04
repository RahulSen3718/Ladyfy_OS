"use server";

import { revalidatePath } from "next/cache";
import {
  RecordPaymentSchema,
  RecordExpenseSchema,
  RecordCreatorPayoutSchema,
} from "@/validators/financial.schema";
import { FinancialService } from "@/services/financial.service";

export async function recordPaymentAction(formData: unknown) {
  try {
    const validated = RecordPaymentSchema.parse(formData);
    const payment = await FinancialService.recordPayment(validated);
    revalidatePath("/financials");
    revalidatePath("/dashboard");
    revalidatePath("/clients");
    return { success: true, data: payment };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || "Failed to record payment",
    };
  }
}

export async function recordExpenseAction(formData: unknown) {
  try {
    const validated = RecordExpenseSchema.parse(formData);
    const expense = await FinancialService.recordExpense(validated);
    revalidatePath("/financials");
    revalidatePath("/dashboard");
    return { success: true, data: expense };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || "Failed to record expense",
    };
  }
}

export async function recordCreatorPayoutAction(formData: unknown) {
  try {
    const validated = RecordCreatorPayoutSchema.parse(formData);
    const payout = await FinancialService.recordCreatorPayout(validated);
    revalidatePath("/financials");
    revalidatePath("/dashboard");
    return { success: true, data: payout };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || "Failed to record creator payout",
    };
  }
}
