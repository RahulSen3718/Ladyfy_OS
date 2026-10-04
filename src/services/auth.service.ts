import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { AuthUserSession, EmployeeSubRole, UserRole } from "@/types/rbac.types";
import { LoginInput, SignupInput } from "@/validators/auth.schema";
import { AUTH_COOKIE_NAME, DEMO_ACCOUNTS } from "@/lib/auth-constants";

export { AUTH_COOKIE_NAME, DEMO_ACCOUNTS };

export class AuthService {
  /**
   * Set user session in HTTP-only cookie
   */
  static async setSessionCookie(session: AuthUserSession, rememberMe: boolean = true) {
    const cookieStore = await cookies();
    const encodedSession = Buffer.from(JSON.stringify(session)).toString("base64");

    const maxAge = rememberMe ? 60 * 60 * 24 * 7 : 60 * 60 * 24; // 7 days or 1 day

    cookieStore.set(AUTH_COOKIE_NAME, encodedSession, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge,
      path: "/",
    });
  }

  /**
   * Clear user session cookie
   */
  static async clearSessionCookie() {
    const cookieStore = await cookies();
    cookieStore.delete(AUTH_COOKIE_NAME);
  }

  /**
   * Get current authenticated user session
   */
  static async getSession(): Promise<AuthUserSession | null> {
    try {
      const cookieStore = await cookies();
      const sessionCookie = cookieStore.get(AUTH_COOKIE_NAME)?.value;

      if (!sessionCookie) return null;

      const decoded = Buffer.from(sessionCookie, "base64").toString("utf-8");
      const session: AuthUserSession = JSON.parse(decoded);

      if (!session || !session.id || !session.email) {
        return null;
      }

      return session;
    } catch {
      return null;
    }
  }

  /**
   * Login with email and password
   */
  static async login(data: LoginInput): Promise<AuthUserSession> {
    const email = data.email.toLowerCase().trim();

    // 1. Try to find user in database
    let user: any = null;
    try {
      user = await prisma.user.findUnique({
        where: { email },
        include: {
          employee: true,
          client: true,
        },
      });
    } catch {
      // DB lookup catch
    }

    // 2. If user doesn't exist, check if it's one of the demo accounts
    const demoMatch = DEMO_ACCOUNTS.find((d) => d.email.toLowerCase() === email);

    if (!user && demoMatch) {
      try {
        user = await prisma.user.create({
          data: {
            supabaseId: `sb-${demoMatch.role.toLowerCase()}-${Date.now()}`,
            email: demoMatch.email,
            fullName: demoMatch.fullName,
            role: demoMatch.role,
            isActive: true,
            ...(demoMatch.role === "EMPLOYEE" && demoMatch.subRole
              ? {
                  employee: {
                    create: {
                      subRole: demoMatch.subRole,
                      department: "Operations",
                    },
                  },
                }
              : {}),
            ...(demoMatch.role === "CLIENT"
              ? {
                  client: {
                    create: {
                      clientName: demoMatch.fullName,
                      companyName: "Zenith Apparel Pvt Ltd",
                      brandName: "Zenith Wear",
                      email: demoMatch.email,
                      phone: "+91 98201 12345",
                    },
                  },
                }
              : {}),
          },
          include: {
            employee: true,
            client: true,
          },
        });
      } catch {
        // Fallback to static demo session
      }
    }

    if (!user && !demoMatch) {
      throw new Error("No account found with this email. Please check your credentials or create an account.");
    }

    // Build session object
    const session: AuthUserSession = {
      id: user?.id || demoMatch?.id || "demo-user-id",
      supabaseId: user?.supabaseId || `sb-${email}`,
      email: user?.email || email,
      fullName: user?.fullName || demoMatch?.fullName || "Agency User",
      role: (user?.role as UserRole) || demoMatch?.role || "OWNER",
      employeeSubRole: (user?.employee?.subRole as EmployeeSubRole) || demoMatch?.subRole || null,
      employeeId: user?.employee?.id || null,
      clientId: user?.client?.id || null,
      isActive: user ? user.isActive : true,
    };

    await this.setSessionCookie(session, data.rememberMe ?? true);
    return session;
  }

  /**
   * 1-Click Demo Login
   */
  static async demoLogin(identifier: string): Promise<AuthUserSession> {
    const demo = DEMO_ACCOUNTS.find(
      (d) =>
        d.id === identifier ||
        d.role === identifier ||
        d.subRole === identifier ||
        d.email === identifier
    ) || DEMO_ACCOUNTS[0];

    return this.login({
      email: demo.email,
      password: "demopassword123",
      rememberMe: true,
    });
  }

  /**
   * Register new user and sign in
   */
  static async signup(data: SignupInput): Promise<AuthUserSession> {
    const email = data.email.toLowerCase().trim();

    // Check if user already exists
    try {
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        throw new Error("An account with this email already exists. Please sign in.");
      }
    } catch (err: any) {
      if (err.message && err.message.includes("already exists")) {
        throw err;
      }
    }

    // Create user in Prisma
    let createdUser: any = null;
    try {
      createdUser = await prisma.user.create({
        data: {
          supabaseId: `sb-user-${Date.now()}`,
          email,
          fullName: data.fullName.trim(),
          phone: data.phone || null,
          role: data.role as UserRole,
          isActive: true,
          ...(data.role === "EMPLOYEE" && data.employeeSubRole
            ? {
                employee: {
                  create: {
                    subRole: data.employeeSubRole as EmployeeSubRole,
                    department:
                      data.employeeSubRole === "SALES"
                        ? "Growth & Sales"
                        : data.employeeSubRole === "SCRIPT_WRITER"
                        ? "Creative Scripting"
                        : data.employeeSubRole === "SHOOT_MANAGER"
                        ? "Production Logistics"
                        : "Post-Production",
                  },
                },
              }
            : {}),
          ...(data.role === "CLIENT"
            ? {
                client: {
                  create: {
                    clientName: data.fullName.trim(),
                    companyName: data.companyName || `${data.fullName}'s Brand`,
                    brandName: data.brandName || "Brand",
                    email,
                    phone: data.phone || "+91 99999 00000",
                  },
                },
              }
            : {}),
        },
        include: {
          employee: true,
          client: true,
        },
      });
    } catch {
      // Fallback if DB is unavailable
      createdUser = {
        id: `usr-${Date.now()}`,
        supabaseId: `sb-${Date.now()}`,
        email,
        fullName: data.fullName,
        role: data.role,
        isActive: true,
        employee: data.role === "EMPLOYEE" ? { id: `emp-${Date.now()}`, subRole: data.employeeSubRole } : null,
        client: data.role === "CLIENT" ? { id: `cli-${Date.now()}` } : null,
      };
    }

    const session: AuthUserSession = {
      id: createdUser.id,
      supabaseId: createdUser.supabaseId,
      email: createdUser.email,
      fullName: createdUser.fullName,
      role: createdUser.role as UserRole,
      employeeSubRole: (createdUser.employee?.subRole as EmployeeSubRole) || null,
      employeeId: createdUser.employee?.id || null,
      clientId: createdUser.client?.id || null,
      isActive: true,
    };

    await this.setSessionCookie(session, true);
    return session;
  }

  /**
   * Switch active role for testing / simulator
   */
  static async switchRole(role: UserRole, subRole?: EmployeeSubRole | null): Promise<AuthUserSession> {
    const currentSession = await this.getSession();

    const updatedSession: AuthUserSession = {
      id: currentSession?.id || `usr-simulated-${Date.now()}`,
      supabaseId: currentSession?.supabaseId || `sb-simulated`,
      email: currentSession?.email || `user@leadyfy.io`,
      fullName: currentSession?.fullName || "Simulated Operator",
      role,
      employeeSubRole: role === "EMPLOYEE" ? subRole || "SALES" : null,
      clientId: role === "CLIENT" ? currentSession?.clientId || "demo-client-id" : null,
      employeeId: role === "EMPLOYEE" ? currentSession?.employeeId || "demo-emp-id" : null,
      isActive: true,
    };

    await this.setSessionCookie(updatedSession, true);
    return updatedSession;
  }
}
