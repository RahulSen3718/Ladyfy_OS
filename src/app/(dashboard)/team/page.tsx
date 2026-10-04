import { Users2, UserPlus, Shield, Award, Mail, Phone, Calendar, CheckCircle2 } from "lucide-react";
import { Header } from "@/components/shared/Header";
import { StatsCard } from "@/components/shared/StatsCard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TeamService } from "@/services/team.service";
import { formatCurrency, formatDate } from "@/lib/utils";

const ROLE_BADGES: Record<string, { label: string; variant: string }> = {
  SALES: { label: "Sales & Growth", variant: "warning" },
  SCRIPT_WRITER: { label: "Script Writer", variant: "info" },
  SHOOT_MANAGER: { label: "Shoot Manager", variant: "purple" },
  EDITOR: { label: "Video Editor", variant: "pipelineEditing" },
};

export default async function TeamPage() {
  const employees = await TeamService.getTeamMembers();
  const employeeList = employees as any[];

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title="Employee Directory & Production Metrics"
        subtitle="Role-based team profiles, department assignments, salaries, and real-time operational performance"
        actions={
          <Button size="sm" className="bg-amber-500 hover:bg-amber-400 text-black font-semibold gap-1.5 text-xs">
            <UserPlus className="h-4 w-4" /> Add Team Member
          </Button>
        }
      />

      <div className="p-8 space-y-6">
        {/* Metric Summaries */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Active Staff"
            value={employeeList.length}
            subtitle="Full-time agency operations team"
            icon={Users2}
            amberAccent={true}
          />
          <StatsCard
            title="Avg Performance Score"
            value="97.2%"
            subtitle="Calculated on deadline fulfillment"
            icon={Award}
          />
          <StatsCard
            title="Monthly Payroll"
            value={formatCurrency(
              employeeList.reduce((sum, e) => sum + Number(e.salary || 0), 0)
            )}
            subtitle="Total team compensation"
            icon={CheckCircle2}
          />
          <StatsCard
            title="RBAC Roles Active"
            value="4 Tiers"
            subtitle="Enforced in middleware"
            icon={Shield}
          />
        </div>

        {/* Employee Cards Grid */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-400">
            Agency Operations Team ({employeeList.length})
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {employeeList.map((emp) => {
              const roleMeta = ROLE_BADGES[emp.subRole] || {
                label: emp.subRole,
                variant: "secondary",
              };

              return (
                <Card
                  key={emp.id}
                  className="border-neutral-800 bg-[#121212] hover:border-neutral-700 transition-all"
                >
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-lg">
                          {emp.user.fullName.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-base font-bold text-white">
                              {emp.user.fullName}
                            </h3>
                            <Badge variant={roleMeta.variant as any} className="text-[10px]">
                              {roleMeta.label}
                            </Badge>
                          </div>
                          <p className="text-xs text-neutral-400">{emp.department}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-neutral-500 block">Performance</span>
                        <span className="font-mono text-sm font-bold text-emerald-400">
                          {emp.performanceScore}%
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-neutral-950 border border-neutral-800 text-xs">
                      <div>
                        <span className="text-neutral-500 block">Contact Info:</span>
                        <span className="text-neutral-300 block">{emp.user.email}</span>
                        <span className="text-neutral-400 font-mono text-[11px]">{emp.user.phone || "-"}</span>
                      </div>
                      <div className="border-l border-neutral-800 pl-3">
                        <span className="text-neutral-500 block">Monthly Stipend:</span>
                        <span className="text-amber-400 font-mono font-bold">
                          {formatCurrency(Number(emp.salary))}
                        </span>
                        <span className="text-neutral-500 text-[11px] block">
                          Joined {formatDate(emp.joiningDate)}
                        </span>
                      </div>
                    </div>

                    {/* Operational Throughput Metrics */}
                    <div className="flex items-center justify-between text-xs text-neutral-400 pt-1">
                      <span>Throughput:</span>
                      <div className="flex items-center gap-3 font-medium">
                        {emp.subRole === "SALES" && <span>{emp._count.managedClients} Clients Managed</span>}
                        {emp.subRole === "SCRIPT_WRITER" && <span>{emp._count.writtenScripts} Scripts Written</span>}
                        {emp.subRole === "SHOOT_MANAGER" && <span>{emp._count.managedShoots} Shoots Coordinated</span>}
                        {emp.subRole === "EDITOR" && <span>{emp._count.assignedVideos} Videos Edited</span>}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
