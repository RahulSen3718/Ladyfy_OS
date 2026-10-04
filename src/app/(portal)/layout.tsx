import { PortalHeader } from "@/components/portal/PortalHeader";

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-neutral-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Isolated Client Header */}
      <PortalHeader />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 sm:p-10 space-y-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-800/80 py-6 text-center text-xs text-neutral-500 bg-[#0E0E0E]">
        <p>Leadyfy OS — Client Operations & Deliveries Portal • Confidential</p>
      </footer>
    </div>
  );
}
