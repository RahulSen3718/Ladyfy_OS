import { CheckSquare, Plus, AlertCircle, Clock, CheckCircle2, User } from "lucide-react";
import { Header } from "@/components/shared/Header";
import { StatsCard } from "@/components/shared/StatsCard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TaskService } from "@/services/task.service";
import { formatDate } from "@/lib/utils";

const PRIORITY_BADGES: Record<string, { label: string; variant: string }> = {
  URGENT: { label: "Urgent", variant: "urgencyOverdue" },
  HIGH: { label: "High", variant: "warning" },
  MEDIUM: { label: "Medium", variant: "info" },
  LOW: { label: "Low", variant: "secondary" },
};

const STATUS_COLUMNS = [
  { id: "TO_DO", label: "To Do", variant: "secondary" },
  { id: "IN_PROGRESS", label: "In Progress", variant: "warning" },
  { id: "DONE", label: "Done", variant: "success" },
];

export default async function TasksPage() {
  const tasks = await TaskService.getTasks();
  const taskList = tasks as any[];

  const urgentTasks = taskList.filter((t) => t.priority === "URGENT" && t.status !== "DONE").length;
  const inProgressTasks = taskList.filter((t) => t.status === "IN_PROGRESS").length;
  const completedTasks = taskList.filter((t) => t.status === "DONE").length;

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title="Internal Operational Task Management"
        subtitle="Cross-department action items, priority flags, assignment workflows, and operational bottleneck resolution"
        actions={
          <Button size="sm" className="bg-amber-500 hover:bg-amber-400 text-black font-semibold gap-1.5 text-xs">
            <Plus className="h-4 w-4" /> Create Task
          </Button>
        }
      />

      <div className="p-8 space-y-6">
        {/* Metric Summaries */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Tasks"
            value={taskList.length}
            subtitle="Internal agency action items"
            icon={CheckSquare}
            amberAccent={true}
          />
          <StatsCard
            title="Urgent Bottlenecks"
            value={urgentTasks}
            subtitle="Requires immediate action"
            icon={AlertCircle}
            highlight={urgentTasks > 0}
          />
          <StatsCard
            title="In Progress"
            value={inProgressTasks}
            subtitle="Currently being worked on"
            icon={Clock}
          />
          <StatsCard
            title="Completed"
            value={completedTasks}
            subtitle="Successfully closed tasks"
            icon={CheckCircle2}
          />
        </div>

        {/* 3-Column Task Board */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {STATUS_COLUMNS.map((column) => {
            const columnTasks = taskList.filter((t) => t.status === column.id);

            return (
              <div
                key={column.id}
                className="flex flex-col rounded-xl bg-[#121212] border border-neutral-800/80 overflow-hidden"
              >
                <div className="p-3.5 border-b border-neutral-800 bg-neutral-900/90 flex items-center justify-between">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    {column.label}
                  </span>
                  <Badge variant={column.variant as any} className="text-[10px] px-1.5 py-0">
                    {columnTasks.length}
                  </Badge>
                </div>

                <div className="p-3 space-y-3 min-h-[450px]">
                  {columnTasks.length === 0 ? (
                    <div className="h-32 border border-dashed border-neutral-800/80 rounded-lg flex items-center justify-center text-xs text-neutral-600">
                      No tasks in this stage
                    </div>
                  ) : (
                    columnTasks.map((task) => {
                      const priorityMeta = PRIORITY_BADGES[task.priority] || {
                        label: task.priority,
                        variant: "secondary",
                      };

                      return (
                        <Card
                          key={task.id}
                          className="border-neutral-800 bg-neutral-900/90 hover:border-neutral-700 transition-all"
                        >
                          <CardContent className="p-4 space-y-2.5">
                            <div className="flex items-center justify-between">
                              <Badge variant={priorityMeta.variant as any} className="text-[9px]">
                                {priorityMeta.label}
                              </Badge>
                              {task.deadline && (
                                <span className="text-[10px] font-mono text-neutral-400">
                                  Due: {formatDate(task.deadline)}
                                </span>
                              )}
                            </div>

                            <h4 className="text-xs font-bold text-white leading-snug">
                              {task.title}
                            </h4>

                            {task.description && (
                              <p className="text-[11px] text-neutral-400 line-clamp-2">
                                {task.description}
                              </p>
                            )}

                            <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between text-[11px] text-neutral-400">
                              <span className="flex items-center gap-1 text-neutral-300">
                                <User className="h-3 w-3 text-amber-400" /> {task.assignee?.fullName || "Unassigned"}
                              </span>
                              <span className="text-[10px] text-neutral-500">
                                by {task.creator?.fullName}
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
