import { redirect } from "next/navigation";
import { AuthService } from "@/services/auth.service";

export default async function RootPage() {
  const session = await AuthService.getSession();

  if (!session) {
    redirect("/login");
  }

  if (session.role === "CLIENT") {
    redirect("/portal");
  }

  redirect("/dashboard");
}
