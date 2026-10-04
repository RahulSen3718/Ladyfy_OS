"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Building2,
  Mail,
  Phone,
  ArrowUpRight,
  Search,
  ExternalLink,
  ChevronRight,
  Package,
  Layers,
  CheckCircle2,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

interface ClientData {
  id: string;
  clientName: string;
  companyName: string;
  brandName: string;
  email: string;
  phone: string;
  whatsapp?: string | null;
  industry?: string | null;
  status: string;
  brandKitUrl?: string | null;
  accountManager?: {
    user: { fullName: string; email: string };
  } | null;
  orders?: Array<{
    id: string;
    packageName: string;
    contractedVideoCount: number;
    completedVideoCount: number;
    deliveredVideoCount: number;
    totalAmount: any;
    status: string;
  }>;
  _count?: {
    scripts: number;
    shoots: number;
    videos: number;
    payments: number;
  };
}

const STATUS_VARIANTS: Record<string, { label: string; variant: string }> = {
  LEAD: { label: "Lead", variant: "secondary" },
  NEW: { label: "New", variant: "info" },
  ONBOARDING: { label: "Onboarding", variant: "purple" },
  ACTIVE: { label: "Active", variant: "success" },
  ON_HOLD: { label: "On Hold", variant: "warning" },
  COMPLETED: { label: "Completed", variant: "outline" },
  INACTIVE: { label: "Inactive", variant: "destructive" },
};

export function ClientTable({ initialClients }: { initialClients: ClientData[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("ALL");

  const filteredClients = initialClients.filter((client) => {
    const matchesSearch =
      client.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.brandName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      selectedStatus === "ALL" || client.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4">
      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-500" />
          <Input
            placeholder="Search company, brand, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-neutral-900 border-neutral-800"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {["ALL", "ACTIVE", "ONBOARDING", "NEW", "LEAD", "ON_HOLD"].map((status) => (
            <Button
              key={status}
              variant={selectedStatus === status ? "amber" : "outline"}
              size="sm"
              onClick={() => setSelectedStatus(status)}
              className="text-xs h-8 border-neutral-800"
            >
              {status === "ALL" ? "All Clients" : status.replace("_", " ")}
            </Button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-neutral-800 bg-[#121212] overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-neutral-800 hover:bg-transparent">
              <TableHead className="w-[280px]">Company & Brand</TableHead>
              <TableHead>Contact / Email</TableHead>
              <TableHead>Lifecycle Status</TableHead>
              <TableHead>Active Package Quota</TableHead>
              <TableHead>Account Manager</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-neutral-500">
                  No clients found matching criteria.
                </TableCell>
              </TableRow>
            ) : (
              filteredClients.map((client) => {
                const statusMeta = STATUS_VARIANTS[client.status] || {
                  label: client.status,
                  variant: "secondary",
                };

                const activeOrder = client.orders?.[0];

                return (
                  <TableRow
                    key={client.id}
                    className="border-neutral-800/60 hover:bg-neutral-900/60 transition-colors"
                  >
                    {/* Column 1: Company & Brand */}
                    <TableCell>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">
                            {client.companyName}
                          </span>
                          {client.brandKitUrl && (
                            <a
                              href={client.brandKitUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-amber-400 hover:text-amber-300"
                              title="Brand Kit Drive Link"
                            >
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                        </div>
                        <p className="text-xs text-amber-400/90 font-medium">
                          {client.brandName} • {client.industry || "E-Commerce"}
                        </p>
                      </div>
                    </TableCell>

                    {/* Column 2: Contact Person */}
                    <TableCell>
                      <div className="text-xs space-y-0.5">
                        <p className="text-neutral-200 font-medium">
                          {client.clientName}
                        </p>
                        <p className="text-neutral-500 flex items-center gap-1">
                          <Mail className="h-3 w-3" /> {client.email}
                        </p>
                        <p className="text-neutral-500 flex items-center gap-1">
                          <Phone className="h-3 w-3" /> {client.phone}
                        </p>
                      </div>
                    </TableCell>

                    {/* Column 3: Status */}
                    <TableCell>
                      <Badge variant={statusMeta.variant as any}>
                        {statusMeta.label}
                      </Badge>
                    </TableCell>

                    {/* Column 4: Package Quota */}
                    <TableCell>
                      {activeOrder ? (
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-neutral-300 font-medium truncate max-w-[130px]">
                              {activeOrder.packageName}
                            </span>
                            <span className="text-amber-400 font-mono font-bold">
                              {activeOrder.deliveredVideoCount}/{activeOrder.contractedVideoCount} Delivered
                            </span>
                          </div>
                          <div className="h-1.5 w-36 bg-neutral-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-amber-500 transition-all"
                              style={{
                                width: `${Math.min(
                                  100,
                                  (activeOrder.deliveredVideoCount /
                                    activeOrder.contractedVideoCount) *
                                    100
                                )}%`,
                              }}
                            />
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-neutral-500">No active package</span>
                      )}
                    </TableCell>

                    {/* Column 5: Manager */}
                    <TableCell>
                      <span className="text-xs text-neutral-300">
                        {client.accountManager?.user.fullName || "Unassigned"}
                      </span>
                    </TableCell>

                    {/* Column 6: Actions */}
                    <TableCell className="text-right">
                      <Link href={`/clients/${client.id}`}>
                        <Button
                          variant="dark"
                          size="sm"
                          className="h-8 text-xs gap-1 border-neutral-700 hover:border-amber-500/40 text-neutral-200"
                        >
                          Centralized Hub <ArrowUpRight className="h-3.5 w-3.5 text-amber-400" />
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
