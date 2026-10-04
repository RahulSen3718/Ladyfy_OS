"use server";

import { revalidatePath } from "next/cache";
import { CreateCreatorSchema, BookCreatorAvailabilitySchema } from "@/validators/creator.schema";
import { CreatorService } from "@/services/creator.service";

export async function createCreatorAction(formData: unknown) {
  try {
    const validated = CreateCreatorSchema.parse(formData);
    const creator = await CreatorService.createCreator(validated);
    revalidatePath("/creators");
    return { success: true, data: creator };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || "Failed to add creator",
    };
  }
}

export async function bookCreatorAvailabilityAction(formData: unknown) {
  try {
    const validated = BookCreatorAvailabilitySchema.parse(formData);
    const booking = await CreatorService.bookAvailability(validated);
    revalidatePath("/creators");
    revalidatePath("/shoots");
    return { success: true, data: booking };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || "Booking failed",
    };
  }
}
