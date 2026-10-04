import { prisma } from "@/lib/prisma";
import { Prisma, EmployeeSubRole } from "@prisma/client";

export class TeamService {
  static async getTeamMembers() {
    try {
      return await prisma.employee.findMany({
        include: {
          user: { select: { fullName: true, email: true, phone: true, avatarUrl: true, isActive: true } },
          _count: {
            select: {
              managedClients: true,
              writtenScripts: true,
              managedShoots: true,
              assignedVideos: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });
    } catch {
      // Fallback demo employee team
      return [
        {
          id: "emp-1",
          subRole: EmployeeSubRole.SALES,
          salary: new Prisma.Decimal(65000),
          joiningDate: new Date("2026-01-15"),
          department: "Growth & Sales",
          performanceScore: 98.5,
          user: { fullName: "Aarav Sharma", email: "aarav@leadyfy.io", phone: "+91 98100 00111", isActive: true },
          _count: { managedClients: 8, writtenScripts: 4, managedShoots: 0, assignedVideos: 0 },
        },
        {
          id: "emp-2",
          subRole: EmployeeSubRole.SCRIPT_WRITER,
          salary: new Prisma.Decimal(50000),
          joiningDate: new Date("2026-02-01"),
          department: "Creative Writing",
          performanceScore: 96.0,
          user: { fullName: "Devika Sen", email: "devika@leadyfy.io", phone: "+91 98100 00222", isActive: true },
          _count: { managedClients: 0, writtenScripts: 24, managedShoots: 0, assignedVideos: 0 },
        },
        {
          id: "emp-3",
          subRole: EmployeeSubRole.SHOOT_MANAGER,
          salary: new Prisma.Decimal(55000),
          joiningDate: new Date("2026-03-01"),
          department: "Production Logistics",
          performanceScore: 94.0,
          user: { fullName: "Rahul Varma", email: "rahul@leadyfy.io", phone: "+91 98100 00333", isActive: true },
          _count: { managedClients: 0, writtenScripts: 0, managedShoots: 18, assignedVideos: 0 },
        },
        {
          id: "emp-4",
          subRole: EmployeeSubRole.EDITOR,
          salary: new Prisma.Decimal(60000),
          joiningDate: new Date("2026-01-20"),
          department: "Post-Production",
          performanceScore: 99.0,
          user: { fullName: "Ankit Roy", email: "ankit@leadyfy.io", phone: "+91 98100 00444", isActive: true },
          _count: { managedClients: 0, writtenScripts: 0, managedShoots: 0, assignedVideos: 32 },
        },
      ];
    }
  }
}
