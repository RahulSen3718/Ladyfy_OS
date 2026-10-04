"use server";

import { revalidatePath } from "next/cache";
import { CreateShootSchema, UpdateShootChecklistsSchema } from "@/validators/shoot.schema";
import { ShootService } from "@/services/shoot.service";

export async function createShootAction(formData: unknown) {
  try {
    const validated = CreateShootSchema.parse(formData);
    const shoot = await ShootService.createShoot(validated);
    revalidatePath("/shoots");
    revalidatePath("/dashboard");
    return { success: true, data: shoot };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || "Failed to schedule shoot",
    };
  }
}

export async function updateShootChecklistAction(formData: unknown) {
  try {
    const validated = UpdateShootChecklistsSchema.parse(formData);
    const updated = await ShootService.updateChecklist(validated);
    revalidatePath("/shoots");
    return { success: true, data: updated };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || "Failed to update shoot checklist",
    };
  }
}
