import {
  DollarSign,
  TrendingUp,
  CreditCard,
  Receipt,
  Plus,
  ArrowUpRight,
  ShieldAlert,
  CheckCircle2,
  Clock,
  Building,
  UserCheck,
  ExternalLink,
} from "lucide-react";
import { Header } from "@/components/shared/Header";
import { StatsCard } from "@/components/shared/StatsCard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FinancialService } from "@/services/financial.service";
import { formatCurrency, formatDate } from "@/lib/utils";

const PAYMENT_STATUS_BADGES: Record<string, { label: string; variant: string }> = {
  PAID: { label: "Fully Paid", variant: "success" },
  PARTIALLY_PAID: { label: "Partially Paid", variant: "warning" },
  UNPAID: { label: "Unpaid", variant: "destructive" },
  OVERDUE: { label: "Overdue", variant: "urgencyOverdue" },
};

const PAYOUT_STATUS_BADGES: Record<string, { label: string; variant: string }> = {
  PAID: { label: "Disbursed", variant: "success" },
  APPROVED: { label: "Approved (Pending Batch)", variant: "info" },
  PENDING: { label: "Awaiting Verification", variant: "warning" },
};

export default async function FinancialsPage() {
  const financialData = await FinancialService.getFinancialOverview();
  const { metrics, payments, expenses, payouts } = financialData;

  const paymentList = payments as any[];
  const expenseList = expenses as any[];
  const payoutList = payouts as any[];

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title="Agency Financial Ledger & Executive Profitability"
        subtitle="End-to-end commercial accounting: Client Invoices, Categorized Expenses, Creator Payouts, and Net Profit"
        actions={
          <div className="flex items-center gap-2">
            <Button size="sm" variant="dark" className="border-neutral-700 text-xs gap-1.5 text-neutral-200">
              <Plus className="h-4 w-4 text-amber-400" /> Record Client Payment
            </Button>
            <Button size="sm" className="bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs gap-1.5 shadow-md shadow-amber-500/10">
              <Receipt className="h-4 w-4" /> Log Agency Expense
            </Button>
          </div>
        }
      />

      <div className="p-8 space-y-6">
        {/* EXECUTIVE PROFITABILITY KPI ROW */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Estimated Net Profit"
            value={formatCurrency(metrics.netProfit)}
            subtitle="Formula: Revenue - Expenses - Payouts"
            icon={TrendingUp}
            amberAccent={true}
            trend={{ value: "+21.4% margin", isPositive: true }}
          />
          <StatsCard
            title="Total Revenue Collected"
            value={formatCurrency(metrics.totalRevenue)}
            subtitle={`Pending Receivables: ${formatCurrency(metrics.totalReceivables)}`}
            icon={DollarSign}
            trend={{ value: "+14.2%", isPositive: true }}
          />
          <StatsCard
            title="Total Agency Expenses"
            value={formatCurrency(metrics.totalExpenses)}
            subtitle="Salaries, Studio, Gear & Fuel"
            icon={Receipt}
          />
          <StatsCard
            title="Creator Payouts Disbursed"
            value={formatCurrency(metrics.totalPayouts)}
            subtitle={`Pending: ${formatCurrency(metrics.pendingPayouts)}`}
            icon={UserCheck}
          />
        </div>

        {/* FINANCIAL TABS */}
        <Tabs defaultValue="payments" className="space-y-4">
          <TabsList className="bg-neutral-900 border border-neutral-800 p-1">
            <TabsTrigger value="payments" className="gap-2 text-xs">
              <CreditCard className="h-3.5 w-3.5 text-emerald-400" /> Client Receivables & Invoices ({paymentList.length})
            </TabsTrigger>
            <TabsTrigger value="payouts" className="gap-2 text-xs">
              <UserCheck className="h-3.5 w-3.5 text-amber-400" /> Creator Payouts Ledger ({payoutList.length})
            </TabsTrigger>
            <TabsTrigger value="expenses" className="gap-2 text-xs">
              <Receipt className="h-3.5 w-3.5 text-purple-400" /> Agency Expenses & Overheads ({expenseList.length})
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: CLIENT PAYMENTS */}
          <TabsContent value="payments">
            <Card className="border-neutral-800 bg-[#121212]">
              <CardHeader className="pb-3 border-b border-neutral-800">
                <CardTitle className="text-sm">Client Invoices & Receivables</CardTitle>
                <CardDescription className="text-xs">
                  Automated status tracking with delivery guardrails for unpaid balances.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                {paymentList.map((pmt) => {
                  const statusMeta = PAYMENT_STATUS_BADGES[pmt.status] || {
                    label: pmt.status,
                    variant: "secondary",
                  };

                  return (
                    <div
                      key={pmt.id}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl bg-neutral-900/80 border border-neutral-800 gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2.5">
                          <span className="font-mono text-xs font-bold text-amber-400">
                            {pmt.invoiceNumber}
                          </span>
                          <Badge variant={statusMeta.variant as any} className="text-[10px]">
                            {statusMeta.label}
                          </Badge>
                          <span className="text-xs text-neutral-400 font-mono">
                            Method: {pmt.paymentMethod}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-white">
                          {pmt.client?.companyName} ({pmt.client?.brandName})
                        </h4>
                        <p className="text-xs text-neutral-400">
                          Package: {pmt.order?.packageName} • Ref: {pmt.transactionRef || "N/A"}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-xs text-neutral-500 block">Invoice Total</span>
                        <span className="font-mono text-base font-bold text-white">
                          {formatCurrency(Number(pmt.invoiceAmount))}
                        </span>
                        <span className="text-xs text-emerald-400 block font-mono">
                          Received: {formatCurrency(Number(pmt.amountReceived))}
                        </span>
                        {Number(pmt.pendingBalance) > 0 && (
                          <span className="text-[11px] text-red-400 block font-mono font-bold">
                            Balance: {formatCurrency(Number(pmt.pendingBalance))}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 2: CREATOR PAYOUTS */}
          <TabsContent value="payouts">
            <Card className="border-neutral-800 bg-[#121212]">
              <CardHeader className="pb-3 border-b border-neutral-800">
                <CardTitle className="text-sm">Creator Compensation & Payouts</CardTitle>
                <CardDescription className="text-xs">
                  Guardrails enforce zero duplicate payments per completed video or shoot.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                {payoutList.map((payout) => {
                  const statusMeta = PAYOUT_STATUS_BADGES[payout.status] || {
                    label: payout.status,
                    variant: "secondary",
                  };

                  return (
                    <div
                      key={payout.id}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl bg-neutral-900/80 border border-neutral-800 gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2.5">
                          <span className="font-bold text-white text-sm">
                            {payout.creator?.name}
                          </span>
                          <Badge variant={statusMeta.variant as any} className="text-[10px]">
                            {statusMeta.label}
                          </Badge>
                          <span className="text-xs text-amber-400/90 font-mono">
                            {payout.videoCount} Video{payout.videoCount > 1 ? "s" : ""} @ {formatCurrency(Number(payout.contractedRate))}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-400">
                          Package: {payout.order?.packageName} • Video: {payout.video?.title || "Contracted Batch"}
                        </p>
                        <p className="text-[11px] text-neutral-500 font-mono">
                          UPI / Bank: <strong className="text-neutral-300">{payout.creator?.bankUpiInfo || "On File"}</strong> • Phone: {payout.creator?.contactPhone}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-xs text-neutral-500 block">Total Payout</span>
                        <span className="font-mono text-base font-bold text-amber-400">
                          {formatCurrency(Number(payout.totalPayoutAmount))}
                        </span>
                        {payout.paymentDate && (
                          <span className="text-[11px] text-neutral-400 block font-mono">
                            Paid on {formatDate(payout.paymentDate)}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 3: AGENCY EXPENSES */}
          <TabsContent value="expenses">
            <Card className="border-neutral-800 bg-[#121212]">
              <CardHeader className="pb-3 border-b border-neutral-800">
                <CardTitle className="text-sm">Agency Operational Expenses</CardTitle>
                <CardDescription className="text-xs">
                  Categorized overheads directly feeding Executive Net Profit calculations.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                {expenseList.map((exp) => (
                  <div
                    key={exp.id}
                    className="flex items-center justify-between p-4 rounded-xl bg-neutral-900/80 border border-neutral-800"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="default" className="text-[10px]">
                          {exp.category}
                        </Badge>
                        <span className="font-bold text-white text-sm">
                          {exp.description}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500">
                        Date: {formatDate(exp.expenseDate)} • Logged by: {exp.loggedBy?.fullName}
                      </p>
                    </div>

                    <div className="text-right flex items-center gap-3">
                      <span className="font-mono text-base font-bold text-red-400">
                        -{formatCurrency(Number(exp.amount))}
                      </span>
                      {exp.receiptFileUrl && (
                        <a
                          href={exp.receiptFileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button size="sm" variant="dark" className="h-7 text-xs border-neutral-700 text-neutral-300">
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
