"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { AuthService } from "@/services/auth.service";
import { LoginSchema, SignupSchema, DemoLoginSchema } from "@/validators/auth.schema";
import { EmployeeSubRole, UserRole } from "@/types/rbac.types";

export async function loginAction(formData: unknown) {
  try {
    const validated = LoginSchema.parse(formData);
    const session = await AuthService.login(validated);

    revalidatePath("/");
    revalidatePath("/dashboard");
    revalidatePath("/portal");

    const destination = session.role === "CLIENT" ? "/portal" : "/dashboard";
    return { success: true, session, destination };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || "Failed to sign in. Please check your credentials.",
    };
  }
}

export async function signupAction(formData: unknown) {
  try {
    const validated = SignupSchema.parse(formData);
    const session = await AuthService.signup(validated);

    revalidatePath("/");
    revalidatePath("/dashboard");
    revalidatePath("/portal");

    const destination = session.role === "CLIENT" ? "/portal" : "/dashboard";
    return { success: true, session, destination };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || "Failed to create account. Please try again.",
    };
  }
}

export async function demoLoginAction(identifier: string) {
  try {
    const validated = DemoLoginSchema.parse({ identifier });
    const session = await AuthService.demoLogin(validated.identifier);

    revalidatePath("/");
    revalidatePath("/dashboard");
    revalidatePath("/portal");

    const destination = session.role === "CLIENT" ? "/portal" : "/dashboard";
    return { success: true, session, destination };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || "Demo login failed",
    };
  }
}

export async function logoutAction() {
  try {
    await AuthService.clearSessionCookie();
    revalidatePath("/");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to log out" };
  }
}

export async function switchRoleAction(role: UserRole, subRole?: EmployeeSubRole | null) {
  try {
    const session = await AuthService.switchRole(role, subRole);
    revalidatePath("/");
    revalidatePath("/dashboard");
    revalidatePath("/portal");
    return { success: true, session };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to switch role" };
  }
}

export async function getCurrentSessionAction() {
  try {
    const session = await AuthService.getSession();
    return { success: true, session };
  } catch (err: any) {
    return { success: false, error: err?.message || "No active session" };
  }
}
