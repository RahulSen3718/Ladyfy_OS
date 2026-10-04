"use server";

import { revalidatePath } from "next/cache";
import { CreateVideoSchema, AdvancePipelineSchema } from "@/validators/video.schema";
import { VideoPipelineService } from "@/services/video-pipeline.service";

export async function createVideoAction(formData: unknown) {
  try {
    const validated = CreateVideoSchema.parse(formData);
    const video = await VideoPipelineService.createVideo(validated);
    revalidatePath("/production");
    revalidatePath("/dashboard");
    revalidatePath("/orders");
    return { success: true, data: video };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || "Failed to create video pipeline item",
    };
  }
}

export async function advancePipelineAction(formData: unknown) {
  try {
    const validated = AdvancePipelineSchema.parse(formData);
    const updated = await VideoPipelineService.advancePipeline(validated);
    revalidatePath("/production");
    revalidatePath("/dashboard");
    revalidatePath("/orders");
    revalidatePath("/portal");
    return { success: true, data: updated };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || "Failed to advance pipeline state",
    };
  }
}
