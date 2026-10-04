import { Users, UserPlus, CheckCircle2, AlertCircle, Building2 } from "lucide-react";
import { Header } from "@/components/shared/Header";
import { StatsCard } from "@/components/shared/StatsCard";
import { ClientTable } from "@/components/clients/ClientTable";
import { AddClientModal } from "@/components/clients/AddClientModal";
import { ClientService } from "@/services/client.service";

export default async function ClientsPage() {
  const result = await ClientService.getClients({ limit: 100 });
  const clients = JSON.parse(JSON.stringify(result.clients));

  const totalClients = clients.length;
  const activeClients = (clients as any[]).filter((c) => c.status === "ACTIVE").length;
  const onboardingClients = (clients as any[]).filter((c) => c.status === "ONBOARDING").length;
  const leadsCount = (clients as any[]).filter((c) => c.status === "LEAD").length;

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title="Client Accounts Directory"
        subtitle="Centralized management of agency client brands, package commitments, and creative hubs"
        actions={<AddClientModal />}
      />

      <div className="p-8 space-y-6">
        {/* Metric Summaries */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Client Directory"
            value={totalClients}
            subtitle="Global client reference profiles"
            icon={Building2}
            amberAccent={true}
          />
          <StatsCard
            title="Active in Production"
            value={activeClients}
            subtitle="Active packages in pipeline"
            icon={CheckCircle2}
          />
          <StatsCard
            title="Onboarding Phase"
            value={onboardingClients}
            subtitle="Asset gathering & contract setup"
            icon={UserPlus}
          />
          <StatsCard
            title="Sales In Discussions"
            value={leadsCount}
            subtitle="Potential package conversions"
            icon={Users}
          />
        </div>

        {/* Master Client Table */}
        <ClientTable initialClients={clients as any} />
      </div>
    </div>
  );
}
