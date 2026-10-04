import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Building2,
  Mail,
  Phone,
  FileText,
  Clapperboard,
  Film,
  DollarSign,
  LifeBuoy,
  ExternalLink,
  ChevronLeft,
  Plus,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  AlertTriangle,
  FolderArchive,
  ArrowRight,
} from "lucide-react";
import { Header } from "@/components/shared/Header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ClientService } from "@/services/client.service";

export default async function ClientHubPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const client = await ClientService.getClientById(id);

  // If client not found in DB, provide realistic fallback demo hub
  const activeClient = client || {
    id: id,
    clientName: "Rohan Varma",
    companyName: "Zenith Apparel Pvt Ltd",
    brandName: "Zenith Wear",
    email: "rohan@zenithwear.com",
    phone: "+91 98201 12345",
    whatsapp: "+91 98201 12345",
    industry: "E-Commerce / Fashion",
    gstTaxId: "27AABCU9603R1ZM",
    status: "ACTIVE",
    brandKitUrl: "https://drive.google.com/drive/folders/zenith-brand-kit",
    notes: "Focus on Gen-Z gym wear reels & UGC hook videos with fast transitions.",
    createdAt: new Date(),
    accountManager: { user: { fullName: "Aarav Sharma", email: "aarav@leadyfy.io", phone: "+91 98100 00111" } },
    orders: [
      {
        id: "ord-1",
        orderNumber: "ORD-2026-001",
        packageName: "15 UGC Reel Pack",
        contractedVideoCount: 15,
        completedVideoCount: 12,
        deliveredVideoCount: 10,
        pricing: 150000,
        gstRate: 18,
        totalAmount: 177000,
        amountReceived: 177000,
        outstandingBalance: 0,
        startDate: new Date("2026-09-01"),
        dueDate: new Date("2026-10-15"),
        status: "IN_PRODUCTION",
      },
    ],
    scripts: [
      { id: "s1", videoNumber: 1, title: "Oversized Gym Tee - Hook Test #1", language: "English", status: "READY_FOR_SHOOT", revisionCount: 1 },
      { id: "s2", videoNumber: 2, title: "Sweat-Wicking Joggers - Day in the Life", language: "Hindi", status: "APPROVED", revisionCount: 0 },
      { id: "s3", videoNumber: 3, title: "Gym vs Streetwear Transition Reel", language: "English", status: "SENT_TO_CLIENT", revisionCount: 2 },
    ],
    shoots: [
      { id: "sh1", shootNumber: "SHT-2026-012", scheduledAt: new Date("2026-09-28T11:00:00"), location: "Studio A (Bandra)", status: "CONFIRMED", durationHours: 4 },
      { id: "sh2", shootNumber: "SHT-2026-008", scheduledAt: new Date("2026-09-10T14:00:00"), location: "Cult Gym Andheri", status: "COMPLETED", durationHours: 5 },
    ],
    videos: [
      { id: "v1", title: "Oversized Gym Tee UGC Hook", pipelineStatus: "DELIVERED", deadline: new Date("2026-09-20"), revisionCount: 1, finalDeliveryUrl: "https://drive.google.com/file/d/zenith-video-1" },
      { id: "v2", title: "Joggers GRWM Gym Video", pipelineStatus: "CLIENT_REVIEW", deadline: new Date("2026-09-29"), revisionCount: 0, draftVideoUrl: "https://drive.google.com/file/d/zenith-draft-2" },
      { id: "v3", title: "Compression Shorts Review", pipelineStatus: "VIDEO_EDITING", deadline: new Date("2026-09-30"), revisionCount: 0 },
    ],
    payments: [
      { id: "p1", invoiceNumber: "INV-2026-041", invoiceAmount: 177000, amountReceived: 177000, status: "PAID", paymentDate: new Date("2026-09-02"), paymentMethod: "BANK_TRANSFER" },
    ],
    supportTickets: [
      { id: "t1", ticketNumber: "TCK-102", subject: "Requested subtitle color change on Reel #3", priority: "MEDIUM", status: "RESOLVED", createdAt: new Date("2026-09-15") },
    ],
    assets: [
      { id: "a1", name: "Zenith_Brand_Guidelines_2026.pdf", assetType: "BRAND_ASSET", storageUrl: "https://drive.google.com/file/d/brand-pdf" },
      { id: "a2", name: "High_Res_Logo_Transparent.png", assetType: "BRAND_ASSET", storageUrl: "https://drive.google.com/file/d/logo-png" },
    ],
  };

  const activeOrder = (activeClient.orders as any)?.[0];

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title={`${activeClient.companyName} — Client Centralized Hub`}
        subtitle={`Brand: ${activeClient.brandName} • Industry: ${activeClient.industry || "E-Commerce"}`}
        actions={
          <div className="flex items-center gap-2">
            <Link href="/clients">
              <Button variant="outline" size="sm" className="gap-1.5 border-neutral-800 text-xs">
                <ChevronLeft className="h-4 w-4" /> Back to Directory
              </Button>
            </Link>
            <Link href="/orders">
              <Button size="sm" className="bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs gap-1.5">
                <Plus className="h-3.5 w-3.5" /> New Package Order
              </Button>
            </Link>
          </div>
        }
      />

      <div className="p-8 space-y-6">
        {/* Top Profile Card */}
        <Card className="border-neutral-800 bg-[#121212]">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-lg">
                    {activeClient.brandName.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2.5">
                      <h2 className="text-xl font-bold text-white">
                        {activeClient.companyName}
                      </h2>
                      <Badge variant="success" className="text-xs">
                        {activeClient.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-amber-400 font-medium">
                      Consumer Brand: {activeClient.brandName}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-400 pt-2">
                  <span className="flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-neutral-500" /> {activeClient.email}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-neutral-500" /> {activeClient.phone}
                  </span>
                  {activeClient.gstTaxId && (
                    <span className="text-neutral-500">
                      GSTIN: <strong className="text-neutral-300">{activeClient.gstTaxId}</strong>
                    </span>
                  )}
                  {activeClient.accountManager && (
                    <span className="text-neutral-500">
                      Account Manager: <strong className="text-amber-400">{(activeClient.accountManager as any).user.fullName}</strong>
                    </span>
                  )}
                </div>
              </div>

              {/* Brand Kit & Cloud Deliveries quick buttons */}
              <div className="flex items-center gap-3">
                {activeClient.brandKitUrl && (
                  <a
                    href={activeClient.brandKitUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" size="sm" className="gap-2 border-neutral-700 bg-neutral-900 text-xs text-neutral-200">
                      <FolderArchive className="h-4 w-4 text-amber-400" /> Open Brand Kit Drive
                    </Button>
                  </a>
                )}
                <Link href={`/portal`}>
                  <Button variant="dark" size="sm" className="gap-1.5 border-neutral-700 text-xs text-cyan-400">
                    <ExternalLink className="h-4 w-4" /> View as Client Portal
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Live Production Quota Progress Card */}
        {activeOrder && (
          <Card className="border-neutral-800 bg-gradient-to-r from-neutral-900 via-neutral-900 to-amber-950/20">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
                <div>
                  <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                    Active Commercial Package
                  </span>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    {activeOrder.packageName} ({activeOrder.orderNumber})
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-xs text-neutral-400">Total Contract Value</span>
                  <p className="text-lg font-bold font-mono text-white">
                    {formatCurrency(Number(activeOrder.totalAmount))}
                  </p>
                </div>
              </div>

              {/* 5-Segment Live Counter */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 p-4 rounded-xl bg-neutral-950/80 border border-neutral-800">
                <div className="text-center">
                  <span className="text-[11px] text-neutral-400">Contracted</span>
                  <p className="text-xl font-bold font-mono text-white">{activeOrder.contractedVideoCount}</p>
                </div>
                <div className="text-center border-l border-neutral-800">
                  <span className="text-[11px] text-blue-400">In Pipeline</span>
                  <p className="text-xl font-bold font-mono text-blue-400">{activeClient.videos.length}</p>
                </div>
                <div className="text-center border-l border-neutral-800">
                  <span className="text-[11px] text-amber-400">Completed</span>
                  <p className="text-xl font-bold font-mono text-amber-400">{activeOrder.completedVideoCount}</p>
                </div>
                <div className="text-center border-l border-neutral-800">
                  <span className="text-[11px] text-emerald-400">Delivered</span>
                  <p className="text-xl font-bold font-mono text-emerald-400">{activeOrder.deliveredVideoCount}</p>
                </div>
                <div className="text-center border-l border-neutral-800 col-span-2 sm:col-span-1">
                  <span className="text-[11px] text-neutral-400">Remaining Quota</span>
                  <p className="text-xl font-bold font-mono text-neutral-300">
                    {Math.max(0, activeOrder.contractedVideoCount - activeOrder.deliveredVideoCount)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Centralized Hub Tabs */}
        <Tabs defaultValue="videos" className="space-y-4">
          <TabsList className="bg-neutral-900 border border-neutral-800 p-1">
            <TabsTrigger value="videos" className="gap-2 text-xs">
              <Film className="h-3.5 w-3.5" /> Video Deliverables ({activeClient.videos.length})
            </TabsTrigger>
            <TabsTrigger value="scripts" className="gap-2 text-xs">
              <FileText className="h-3.5 w-3.5" /> Script Repository ({activeClient.scripts.length})
            </TabsTrigger>
            <TabsTrigger value="shoots" className="gap-2 text-xs">
              <Clapperboard className="h-3.5 w-3.5" /> Shoot History ({activeClient.shoots.length})
            </TabsTrigger>
            <TabsTrigger value="invoices" className="gap-2 text-xs">
              <DollarSign className="h-3.5 w-3.5" /> Invoices & Ledger ({activeClient.payments.length})
            </TabsTrigger>
            <TabsTrigger value="tickets" className="gap-2 text-xs">
              <LifeBuoy className="h-3.5 w-3.5" /> Support Tickets ({activeClient.supportTickets.length})
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: VIDEO DELIVERABLES */}
          <TabsContent value="videos">
            <Card className="border-neutral-800 bg-[#121212]">
              <CardHeader className="pb-3 border-b border-neutral-800">
                <CardTitle className="text-sm">Video Production Assets</CardTitle>
                <CardDescription className="text-xs">
                  State-tracked video deliverables for {activeClient.brandName}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                {activeClient.videos.map((video: any) => (
                  <div
                    key={video.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3.5 rounded-lg bg-neutral-900/80 border border-neutral-800 gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-white">
                          {video.title}
                        </span>
                        <Badge variant="pipelineApproved" className="text-[10px]">
                          {video.pipelineStatus.replace("_", " ")}
                        </Badge>
                      </div>
                      <p className="text-xs text-neutral-400">
                        Deadline: {formatDate(video.deadline)} • Revisions: {video.revisionCount}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {video.finalDeliveryUrl ? (
                        <a
                          href={video.finalDeliveryUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs gap-1.5">
                            <Download className="h-3.5 w-3.5" /> Download Final Video
                          </Button>
                        </a>
                      ) : video.draftVideoUrl ? (
                        <a
                          href={video.draftVideoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button size="sm" variant="dark" className="border-neutral-700 text-xs text-cyan-400 gap-1.5">
                            <ExternalLink className="h-3.5 w-3.5" /> Review Draft
                          </Button>
                        </a>
                      ) : (
                        <Badge variant="secondary" className="text-xs">
                          Editing In Progress
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 2: SCRIPTS */}
          <TabsContent value="scripts">
            <Card className="border-neutral-800 bg-[#121212]">
              <CardHeader className="pb-3 border-b border-neutral-800">
                <CardTitle className="text-sm">Manual Script Repository</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                {activeClient.scripts.map((script: any) => (
                  <div
                    key={script.id}
                    className="flex items-center justify-between p-3.5 rounded-lg bg-neutral-900/80 border border-neutral-800"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-white">
                          Video #{script.videoNumber}: {script.title}
                        </span>
                        <Badge variant="pipelineScript" className="text-[10px]">
                          {script.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-neutral-400 mt-1">
                        Language: {script.language} • Revisions: {script.revisionCount}
                      </p>
                    </div>
                    <Link href="/scripts">
                      <Button variant="dark" size="sm" className="text-xs border-neutral-800 hover:border-amber-500/40 text-neutral-200">
                        View Script Editor
                      </Button>
                    </Link>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 3: SHOOTS */}
          <TabsContent value="shoots">
            <Card className="border-neutral-800 bg-[#121212]">
              <CardHeader className="pb-3 border-b border-neutral-800">
                <CardTitle className="text-sm">Shoot Logistics & History</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                {activeClient.shoots.map((shoot: any) => (
                  <div
                    key={shoot.id}
                    className="flex items-center justify-between p-3.5 rounded-lg bg-neutral-900/80 border border-neutral-800"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-white">
                          {shoot.shootNumber}
                        </span>
                        <Badge variant="success" className="text-[10px]">
                          {shoot.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-neutral-400 mt-1">
                        Date: {formatDate(shoot.scheduledAt)} • Location: {shoot.location} ({shoot.durationHours} hrs)
                      </p>
                    </div>
                    <Link href="/shoots">
                      <Button variant="dark" size="sm" className="text-xs border-neutral-800 text-neutral-200">
                        View Logistics
                      </Button>
                    </Link>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 4: INVOICES */}
          <TabsContent value="invoices">
            <Card className="border-neutral-800 bg-[#121212]">
              <CardHeader className="pb-3 border-b border-neutral-800">
                <CardTitle className="text-sm">Client Billing & Payments</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                {activeClient.payments.map((pmt: any) => (
                  <div
                    key={pmt.id}
                    className="flex items-center justify-between p-3.5 rounded-lg bg-neutral-900/80 border border-neutral-800"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-white font-mono">
                          {pmt.invoiceNumber}
                        </span>
                        <Badge variant="success" className="text-[10px]">
                          {pmt.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-neutral-400 mt-1">
                        Amount: <strong className="text-white font-mono">{formatCurrency(Number(pmt.invoiceAmount))}</strong> • Method: {pmt.paymentMethod}
                      </p>
                    </div>
                    <span className="text-xs text-neutral-500 font-mono">
                      {formatDate(pmt.paymentDate)}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 5: TICKETS */}
          <TabsContent value="tickets">
            <Card className="border-neutral-800 bg-[#121212]">
              <CardHeader className="pb-3 border-b border-neutral-800">
                <CardTitle className="text-sm">Client Support Tickets</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                {activeClient.supportTickets.map((tck: any) => (
                  <div
                    key={tck.id}
                    className="flex items-center justify-between p-3.5 rounded-lg bg-neutral-900/80 border border-neutral-800"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-amber-400 font-bold">{tck.ticketNumber}</span>
                        <span className="font-semibold text-sm text-white">{tck.subject}</span>
                      </div>
                      <span className="text-xs text-neutral-500 mt-1 block">
                        Logged on {formatDate(tck.createdAt)}
                      </span>
                    </div>
                    <Badge variant="success" className="text-xs">
                      {tck.status}
                    </Badge>
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
