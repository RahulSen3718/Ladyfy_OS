import { LifeBuoy, Plus, CheckCircle2, Clock, AlertCircle, Building2, User } from "lucide-react";
import { Header } from "@/components/shared/Header";
import { StatsCard } from "@/components/shared/StatsCard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export default async function TicketsPage() {
  let tickets: any[] = [];
  try {
    tickets = await prisma.supportTicket.findMany({
      include: {
        client: { select: { companyName: true, brandName: true } },
        createdBy: { select: { fullName: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  } catch {
    tickets = [
      {
        id: "t-1",
        ticketNumber: "TCK-2026-001",
        subject: "Requested subtitle color adjustment on Reel #3",
        description: "Client requested white font with yellow drop shadow for better readability.",
        priority: "MEDIUM",
        status: "RESOLVED",
        createdAt: new Date("2026-09-24"),
        client: { companyName: "Zenith Apparel Pvt Ltd", brandName: "Zenith Wear" },
        createdBy: { fullName: "Rohan Varma", email: "rohan@zenithwear.com" },
      },
      {
        id: "t-2",
        ticketNumber: "TCK-2026-002",
        subject: "Google Drive link access permission required",
        description: "Brand team is unable to view the 4K raw folder due to view permissions.",
        priority: "HIGH",
        status: "IN_PROGRESS",
        createdAt: new Date("2026-09-26"),
        client: { companyName: "GlowSkin Organics LLP", brandName: "GlowSkin Serum" },
        createdBy: { fullName: "Ananya Deshmukh", email: "ananya@glowskin.co" },
      },
    ];
  }

  const openTickets = tickets.filter((t) => t.status === "OPEN" || t.status === "IN_PROGRESS").length;
  const resolvedTickets = tickets.filter((t) => t.status === "RESOLVED").length;

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title="Client Support Tickets & Inquiries"
        subtitle="In-portal client queries, revision discussions, and account manager resolution tracking"
      />

      <div className="p-8 space-y-6">
        {/* Metric Summaries */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatsCard
            title="Total Tickets Logged"
            value={tickets.length}
            subtitle="Client support history"
            icon={LifeBuoy}
            amberAccent={true}
          />
          <StatsCard
            title="Active Tickets"
            value={openTickets}
            subtitle="Awaiting account manager resolution"
            icon={Clock}
          />
          <StatsCard
            title="Resolved Tickets"
            value={resolvedTickets}
            subtitle="Successfully closed tickets"
            icon={CheckCircle2}
          />
        </div>

        {/* Tickets List */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-400">
            Client Inquiries ({tickets.length})
          </h2>

          <div className="space-y-3">
            {tickets.map((ticket) => (
              <Card
                key={ticket.id}
                className="border-neutral-800 bg-[#121212] hover:border-neutral-700 transition-all"
              >
                <CardContent className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-xs font-bold text-amber-400">
                        {ticket.ticketNumber}
                      </span>
                      <Badge
                        variant={ticket.status === "RESOLVED" ? "success" : "warning"}
                        className="text-[10px]"
                      >
                        {ticket.status}
                      </Badge>
                      <Badge variant="secondary" className="text-[10px]">
                        {ticket.priority} Priority
                      </Badge>
                    </div>
                    <h3 className="text-sm font-bold text-white">
                      {ticket.subject}
                    </h3>
                    <p className="text-xs text-neutral-400">
                      {ticket.description}
                    </p>
                    <p className="text-[11px] text-neutral-500 pt-1">
                      Client: <strong className="text-neutral-300">{ticket.client?.companyName}</strong> ({ticket.createdBy?.fullName}) • Logged on {formatDate(ticket.createdAt)}
                    </p>
                  </div>

                  <Button
                    variant="dark"
                    size="sm"
                    className="text-xs border-neutral-700 hover:border-amber-500/40 text-neutral-200"
                  >
                    Manage Ticket
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
