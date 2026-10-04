import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(4, "Password must be at least 4 characters"),
  rememberMe: z.boolean().optional().default(true),
});

export type LoginInput = z.infer<typeof LoginSchema>;

export const SignupSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["OWNER", "ADMIN", "EMPLOYEE", "CLIENT"]).default("EMPLOYEE"),
  employeeSubRole: z
    .enum(["SALES", "SCRIPT_WRITER", "SHOOT_MANAGER", "EDITOR"])
    .optional(),
  companyName: z.string().optional(),
  brandName: z.string().optional(),
  phone: z.string().optional(),
});

export type SignupInput = z.infer<typeof SignupSchema>;

export const DemoLoginSchema = z.object({
  identifier: z.string().min(1, "Identifier is required"),
});

export type DemoLoginInput = z.infer<typeof DemoLoginSchema>;
