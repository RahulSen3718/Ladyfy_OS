"use server";

import { revalidatePath } from "next/cache";
import { CreateOrderSchema, UpdateOrderSchema } from "@/validators/order.schema";
import { OrderService } from "@/services/order.service";

export async function createOrderAction(formData: unknown) {
  try {
    const validated = CreateOrderSchema.parse(formData);
    const order = await OrderService.createOrder(validated);
    revalidatePath("/orders");
    revalidatePath("/clients");
    revalidatePath("/dashboard");
    return { success: true, data: order };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || "Failed to create order",
    };
  }
}
