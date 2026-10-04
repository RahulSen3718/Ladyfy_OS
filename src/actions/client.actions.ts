"use server";

import { revalidatePath } from "next/cache";
import { CreateClientSchema, UpdateClientSchema } from "@/validators/client.schema";
import { ClientService } from "@/services/client.service";

export async function createClientAction(formData: unknown) {
  try {
    const validated = CreateClientSchema.parse(formData);
    const client = await ClientService.createClient(validated);
    revalidatePath("/clients");
    revalidatePath("/dashboard");
    return { success: true, data: client };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || "Failed to create client",
    };
  }
}

export async function updateClientAction(formData: unknown) {
  try {
    const validated = UpdateClientSchema.parse(formData);
    const updated = await ClientService.updateClient(validated);
    revalidatePath("/clients");
    revalidatePath(`/clients/${validated.id}`);
    return { success: true, data: updated };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || "Failed to update client",
    };
  }
}

export async function deleteClientAction(id: string) {
  try {
    await ClientService.deleteClient(id);
    revalidatePath("/clients");
    return { success: true };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || "Failed to delete client",
    };
  }
}
