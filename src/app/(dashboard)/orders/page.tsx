import { Package, Film, CheckCircle2, Clock, DollarSign, Plus, ArrowUpRight, AlertCircle } from "lucide-react";
import { Header } from "@/components/shared/Header";
import { StatsCard } from "@/components/shared/StatsCard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreateOrderModal } from "@/components/orders/CreateOrderModal";
import { OrderService } from "@/services/order.service";
import { ClientService } from "@/services/client.service";
import { formatCurrency, formatDate } from "@/lib/utils";
import Link from "next/link";

const ORDER_STATUS_BADGES: Record<string, { label: string; variant: string }> = {
  NEW: { label: "New", variant: "info" },
  ONBOARDING: { label: "Onboarding", variant: "purple" },
  IN_PRODUCTION: { label: "In Production", variant: "warning" },
  PARTIALLY_DELIVERED: { label: "Partially Delivered", variant: "pipelineReview" },
  COMPLETED: { label: "Completed", variant: "success" },
  ON_HOLD: { label: "On Hold", variant: "secondary" },
  CANCELLED: { label: "Cancelled", variant: "destructive" },
};

export default async function OrdersPage() {
  const [orders, clientsResult] = await Promise.all([
    OrderService.getOrders(),
    ClientService.getClients({ limit: 100 }),
  ]);

  const clientOptions = (clientsResult.clients as any[]).map((c) => ({
    id: c.id,
    companyName: c.companyName,
    brandName: c.brandName,
  }));

  const orderList = orders as any[];
  const totalContractedVideos = orderList.reduce((sum, o) => sum + Number(o.contractedVideoCount || 0), 0);
  const totalDeliveredVideos = orderList.reduce((sum, o) => sum + Number(o.deliveredVideoCount || 0), 0);
  const totalCompletedVideos = orderList.reduce((sum, o) => sum + Number(o.completedVideoCount || 0), 0);

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title="Packages & Order Commitments"
        subtitle="Commercial contracts, contracted video quotas, and live multi-stage delivery tracking"
        actions={<CreateOrderModal clients={clientOptions} />}
      />

      <div className="p-8 space-y-6">
        {/* Metric Summaries */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Contracted Quota"
            value={`${totalContractedVideos} Videos`}
            subtitle="Across all active agency packages"
            icon={Package}
            amberAccent={true}
          />
          <StatsCard
            title="Delivered to Clients"
            value={`${totalDeliveredVideos} Videos`}
            subtitle={`${Math.round((totalDeliveredVideos / (totalContractedVideos || 1)) * 100)}% fulfillment rate`}
            icon={CheckCircle2}
          />
          <StatsCard
            title="Completed & Approved"
            value={`${totalCompletedVideos} Videos`}
            subtitle="Ready or in final cloud delivery"
            icon={Film}
          />
          <StatsCard
            title="Remaining Quota"
            value={`${Math.max(0, totalContractedVideos - totalDeliveredVideos)} Videos`}
            subtitle="Active in editing & shoots"
            icon={Clock}
          />
        </div>

        {/* Orders Pipeline List */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-400">
            Active Commercial Packages ({orderList.length})
          </h2>

          <div className="grid grid-cols-1 gap-4">
            {orderList.map((order: any) => {
              const statusMeta = ORDER_STATUS_BADGES[order.status] || {
                label: order.status,
                variant: "secondary",
              };
              const counters = order.liveCounters;

              return (
                <Card
                  key={order.id}
                  className="border-neutral-800 bg-[#121212] hover:border-neutral-700 transition-all"
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                      {/* Left: Client & Order Info */}
                      <div className="space-y-1.5 min-w-[280px]">
                        <div className="flex items-center gap-2.5">
                          <span className="text-xs font-mono font-bold text-amber-400">
                            {order.orderNumber}
                          </span>
                          <Badge variant={statusMeta.variant as any} className="text-[10px]">
                            {statusMeta.label}
                          </Badge>
                        </div>
                        <h3 className="text-lg font-bold text-white">
                          {order.packageName}
                        </h3>
                        <p className="text-xs text-neutral-400">
                          Client: <strong className="text-neutral-200">{order.client.companyName}</strong> ({order.client.brandName})
                        </p>
                        <div className="flex items-center gap-3 text-[11px] text-neutral-500 pt-1">
                          <span>Start: {formatDate(order.startDate)}</span>
                          <span>•</span>
                          <span className="text-amber-400/90 font-medium">Due: {formatDate(order.dueDate)}</span>
                        </div>
                      </div>

                      {/* Middle: 5-Stage Live Production Counter */}
                      <div className="flex-1 w-full lg:max-w-xl">
                        <div className="flex items-center justify-between text-xs mb-2">
                          <span className="font-semibold text-neutral-300">
                            Live Production Quota
                          </span>
                          <span className="font-bold text-amber-400 font-mono">
                            {counters.delivered} / {counters.ordered} Delivered ({counters.progressPercentage}%)
                          </span>
                        </div>

                        {/* 5-Step Segmented Counter Display */}
                        <div className="grid grid-cols-5 gap-1.5 p-2 rounded-lg bg-neutral-950 border border-neutral-800 text-center text-[10px]">
                          <div>
                            <span className="text-neutral-400 block">1. Ordered</span>
                            <span className="font-bold font-mono text-white text-xs">{counters.ordered}</span>
                          </div>
                          <div className="border-l border-neutral-800">
                            <span className="text-blue-400 block">2. Assigned</span>
                            <span className="font-bold font-mono text-blue-400 text-xs">{counters.assigned}</span>
                          </div>
                          <div className="border-l border-neutral-800">
                            <span className="text-purple-400 block">3. Completed</span>
                            <span className="font-bold font-mono text-purple-400 text-xs">{counters.completed}</span>
                          </div>
                          <div className="border-l border-neutral-800">
                            <span className="text-emerald-400 block">4. Delivered</span>
                            <span className="font-bold font-mono text-emerald-400 text-xs">{counters.delivered}</span>
                          </div>
                          <div className="border-l border-neutral-800 bg-neutral-900/50 rounded">
                            <span className="text-amber-400 block font-semibold">5. Remaining</span>
                            <span className="font-bold font-mono text-amber-400 text-xs">{counters.remainingQuota}</span>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden mt-2">
                          <div
                            className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 transition-all"
                            style={{ width: `${counters.progressPercentage}%` }}
                          />
                        </div>
                      </div>

                      {/* Right: Commercials & Action */}
                      <div className="flex flex-col items-end justify-between self-stretch gap-3 min-w-[160px]">
                        <div className="text-right">
                          <span className="text-[11px] text-neutral-400 block">Total Contract</span>
                          <span className="text-base font-bold font-mono text-white">
                            {formatCurrency(Number(order.totalAmount))}
                          </span>
                          <span className="text-[10px] text-emerald-400 block font-medium">
                            Received: {formatCurrency(Number(order.amountReceived))}
                          </span>
                        </div>

                        <Link href={`/clients/${order.clientId}`}>
                          <Button
                            variant="dark"
                            size="sm"
                            className="text-xs border-neutral-700 hover:border-amber-500/40 text-neutral-200 gap-1"
                          >
                            Client Hub <ArrowUpRight className="h-3.5 w-3.5 text-amber-400" />
                          </Button>
                        </Link>
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
