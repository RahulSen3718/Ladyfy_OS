import {
  Film,
  FileText,
  DollarSign,
  LifeBuoy,
  Download,
  CheckCircle2,
  Clock,
  ExternalLink,
  Package,
  Plus,
  Send,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TimestampReviewPlayer } from "@/components/portal/TimestampReviewPlayer";
import { PortalService } from "@/services/portal.service";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function ClientPortalPage() {
  const rawPortalData = await PortalService.getClientPortalData();
  const portalData = JSON.parse(JSON.stringify(rawPortalData));
  const activeOrder = (portalData.orders as any[])?.[0];
  const pendingReviewVideos = (activeOrder?.videos as any[])?.filter(
    (v) => v.pipelineStatus === "CLIENT_REVIEW" || v.pipelineStatus === "REVISION"
  ) || [];
  const deliveredVideos = (activeOrder?.videos as any[])?.filter(
    (v) => v.pipelineStatus === "DELIVERED" || v.pipelineStatus === "FINAL_APPROVED"
  ) || [];

  const mainReviewVideo = pendingReviewVideos[0] || (activeOrder?.videos as any[])?.[0];

  return (
    <div className="space-y-8">
      {/* Client Welcome Card */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-neutral-900 via-neutral-900 to-cyan-950/30 border border-neutral-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
              Client Workspace
            </span>
            <Badge variant="success" className="text-[10px]">
              Active Package
            </Badge>
          </div>
          <h1 className="text-2xl font-bold text-white">
            Welcome, {portalData.clientName} ({portalData.brandName})
          </h1>
          <p className="text-xs text-neutral-400">
            {portalData.companyName} • Contracted UGC Video Pipeline
          </p>
        </div>

        {/* Quick Order Progress Pill */}
        {activeOrder && (
          <div className="text-right p-3 rounded-xl bg-neutral-950/80 border border-neutral-800">
            <span className="text-[11px] text-neutral-400 block font-medium">
              {activeOrder.packageName}
            </span>
            <span className="text-lg font-bold font-mono text-cyan-400">
              {activeOrder.deliveredVideoCount} / {activeOrder.contractedVideoCount} Delivered
            </span>
          </div>
        )}
      </div>

      {/* Main Portal Navigation Tabs */}
      <Tabs defaultValue="reviews" className="space-y-6">
        <TabsList className="bg-neutral-900 border border-neutral-800 p-1">
          <TabsTrigger value="reviews" className="gap-2 text-xs">
            <Film className="h-3.5 w-3.5 text-cyan-400" /> Video Reviews & Sign-Off ({pendingReviewVideos.length})
          </TabsTrigger>
          <TabsTrigger value="deliveries" className="gap-2 text-xs">
            <Download className="h-3.5 w-3.5 text-emerald-400" /> Final Deliveries ({deliveredVideos.length})
          </TabsTrigger>
          <TabsTrigger value="scripts" className="gap-2 text-xs">
            <FileText className="h-3.5 w-3.5 text-blue-400" /> Scripts Repository ({portalData.scripts.length})
          </TabsTrigger>
          <TabsTrigger value="invoices" className="gap-2 text-xs">
            <DollarSign className="h-3.5 w-3.5 text-amber-400" /> Invoices & Billing
          </TabsTrigger>
          <TabsTrigger value="tickets" className="gap-2 text-xs">
            <LifeBuoy className="h-3.5 w-3.5 text-purple-400" /> Support & Requests
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: INTERACTIVE VIDEO REVIEW PLAYER */}
        <TabsContent value="reviews" className="space-y-6">
          {mainReviewVideo ? (
            <TimestampReviewPlayer video={mainReviewVideo as any} />
          ) : (
            <Card className="border-neutral-800 bg-[#121212] p-12 text-center">
              <CheckCircle2 className="h-12 w-12 text-emerald-400 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white">All Video Drafts Approved!</h3>
              <p className="text-xs text-neutral-400 mt-1">
                You have no pending video drafts awaiting review. Check the Deliveries tab for your final downloads.
              </p>
            </Card>
          )}
        </TabsContent>

        {/* TAB 2: FINAL CLOUD DELIVERIES */}
        <TabsContent value="deliveries">
          <Card className="border-neutral-800 bg-[#121212]">
            <CardHeader className="pb-3 border-b border-neutral-800">
              <CardTitle className="text-base flex items-center gap-2">
                <Download className="h-4 w-4 text-emerald-400" />
                Final Delivered Video Assets
              </CardTitle>
              <CardDescription className="text-xs">
                Access permanent Google Drive / Cloud storage links for final 4K video renders.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-3">
              {deliveredVideos.length === 0 ? (
                <p className="text-xs text-neutral-500 text-center py-8">
                  No videos marked as final delivered yet. Once you approve drafts, links will appear here.
                </p>
              ) : (
                deliveredVideos.map((video: any) => (
                  <div
                    key={video.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl bg-neutral-900 border border-neutral-800 gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">
                          {video.title}
                        </span>
                        <Badge variant="success" className="text-[10px]">
                          Delivered & Approved
                        </Badge>
                      </div>
                      <p className="text-xs text-neutral-400 mt-0.5">
                        Deadline: {formatDate(video.deadline)} • Revisions: {video.revisionCount}
                      </p>
                    </div>

                    <a
                      href={video.finalDeliveryUrl || "https://drive.google.com"}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs gap-1.5">
                        <Download className="h-3.5 w-3.5" /> Download Final 4K File
                      </Button>
                    </a>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 3: SCRIPTS */}
        <TabsContent value="scripts">
          <Card className="border-neutral-800 bg-[#121212]">
            <CardHeader className="pb-3 border-b border-neutral-800">
              <CardTitle className="text-base">Scripting Sign-Off Repository</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {portalData.scripts.map((script: any) => (
                <div
                  key={script.id}
                  className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">
                      Video #{script.videoNumber}: {script.title}
                    </span>
                    <Badge variant="pipelineApproved" className="text-[10px]">
                      {script.status}
                    </Badge>
                  </div>
                  <div className="p-3 rounded-lg bg-neutral-950 border border-neutral-800 font-mono text-xs text-neutral-300 whitespace-pre-wrap">
                    {script.scriptText}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 4: INVOICES */}
        <TabsContent value="invoices">
          <Card className="border-neutral-800 bg-[#121212]">
            <CardHeader className="pb-3 border-b border-neutral-800">
              <CardTitle className="text-base">Invoices & Payment Records</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-3">
              {(activeOrder?.payments as any[])?.map((pmt: any) => (
                <div
                  key={pmt.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-neutral-900 border border-neutral-800"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-white">
                        {pmt.invoiceNumber}
                      </span>
                      <Badge variant="success" className="text-[10px]">
                        {pmt.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-neutral-400 mt-1">
                      Payment Date: {formatDate(pmt.paymentDate)} • Ref: {pmt.transactionRef || "N/A"}
                    </p>
                  </div>
                  <span className="font-mono text-lg font-bold text-amber-400">
                    {formatCurrency(Number(pmt.invoiceAmount))}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 5: SUPPORT TICKETS */}
        <TabsContent value="tickets">
          <Card className="border-neutral-800 bg-[#121212]">
            <CardHeader className="pb-3 border-b border-neutral-800">
              <CardTitle className="text-base">Client Support & Inquiries</CardTitle>
              <CardDescription className="text-xs">
                Submit queries or requests directly to your agency account manager.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {portalData.supportTickets.map((tck: any) => (
                <div
                  key={tck.id}
                  className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">
                      {tck.ticketNumber}: {tck.subject}
                    </span>
                    <Badge variant="success" className="text-[10px]">
                      {tck.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-neutral-300">{tck.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
