"use server";

import { revalidatePath } from "next/cache";
import { CreateScriptSchema } from "@/validators/script.schema";
import { ScriptService } from "@/services/script.service";

export async function createScriptAction(formData: unknown) {
  try {
    const validated = CreateScriptSchema.parse(formData);
    const script = await ScriptService.createScript(validated);
    revalidatePath("/scripts");
    revalidatePath("/clients");
    return { success: true, data: script };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || "Failed to create script",
    };
  }
}

export async function updateScriptStatusAction(id: string, status: any, comments?: string) {
  try {
    const updated = await ScriptService.updateScriptStatus(id, status, comments);
    revalidatePath("/scripts");
    revalidatePath("/clients");
    return { success: true, data: updated };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || "Failed to update script status",
    };
  }
}
