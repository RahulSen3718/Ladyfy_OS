import { prisma } from "@/lib/prisma";
import { Prisma, TaskStatus, TaskPriority } from "@prisma/client";

export class TaskService {
  static async getTasks(params?: { status?: string; priority?: string }) {
    const where: Prisma.TaskWhereInput = {};
    if (params?.status && params.status !== "ALL") {
      where.status = params.status as TaskStatus;
    }
    if (params?.priority && params.priority !== "ALL") {
      where.priority = params.priority as TaskPriority;
    }

    try {
      return await prisma.task.findMany({
        where,
        include: {
          assignee: { select: { fullName: true, email: true } },
          creator: { select: { fullName: true } },
        },
        orderBy: [{ priority: "asc" }, { deadline: "asc" }],
      });
    } catch {
      // Fallback demo tasks
      return [
        {
          id: "tsk-1",
          title: "Follow up with Zenith Wear on Reel #3 revision approval",
          description: "Client requested subtitle color adjustment. Ensure editor renders updated file by 4 PM.",
          priority: TaskPriority.URGENT,
          status: TaskStatus.IN_PROGRESS,
          deadline: new Date(Date.now() + 4 * 60 * 60 * 1000),
          assignee: { fullName: "Aarav Sharma", email: "aarav@leadyfy.io" },
          creator: { fullName: "Agency Admin" },
        },
        {
          id: "tsk-2",
          title: "Confirm Bandra Studio lighting permit for tomorrow shoot",
          description: "Verify power backup and lighting grid availability for Priya Sharma's shoot.",
          priority: TaskPriority.HIGH,
          status: TaskStatus.TO_DO,
          deadline: new Date(Date.now() + 12 * 60 * 60 * 1000),
          assignee: { fullName: "Rahul Varma", email: "rahul@leadyfy.io" },
          creator: { fullName: "Agency Admin" },
        },
        {
          id: "tsk-3",
          title: "Prepare invoice for GlowSkin Organics 50% milestone balance",
          description: "First 4 drafts delivered. Dispatch milestone invoice for ₹47,200.",
          priority: TaskPriority.MEDIUM,
          status: TaskStatus.TO_DO,
          deadline: new Date(Date.now() + 48 * 60 * 60 * 1000),
          assignee: { fullName: "Aarav Sharma", email: "aarav@leadyfy.io" },
          creator: { fullName: "Agency Admin" },
        },
      ];
    }
  }

  static async updateTaskStatus(id: string, status: TaskStatus) {
    return await prisma.task.update({
      where: { id },
      data: { status },
    });
  }
}
