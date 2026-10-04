"use server";

import { revalidatePath } from "next/cache";
import {
  ClientVideoFeedbackSchema,
  ClientVideoDecisionSchema,
  CreateSupportTicketSchema,
} from "@/validators/portal.schema";
import { PortalService } from "@/services/portal.service";

export async function submitVideoFeedbackAction(formData: unknown) {
  try {
    const validated = ClientVideoFeedbackSchema.parse(formData);
    const feedback = await PortalService.submitVideoFeedback(validated);
    revalidatePath("/portal");
    revalidatePath("/production");
    return { success: true, data: feedback };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || "Failed to submit feedback",
    };
  }
}

export async function processClientDecisionAction(formData: unknown) {
  try {
    const validated = ClientVideoDecisionSchema.parse(formData);
    const result = await PortalService.processClientDecision(validated);
    revalidatePath("/portal");
    revalidatePath("/production");
    revalidatePath("/orders");
    return { success: true, data: result };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || "Failed to submit approval/revision decision",
    };
  }
}

export async function createSupportTicketAction(formData: unknown) {
  try {
    const validated = CreateSupportTicketSchema.parse(formData);
    const ticket = await PortalService.createSupportTicket(validated);
    revalidatePath("/portal");
    revalidatePath("/tickets");
    return { success: true, data: ticket };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || "Failed to submit ticket",
    };
  }
}
