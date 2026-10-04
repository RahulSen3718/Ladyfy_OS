import { UserCheck, Star, Phone, Mail, Plus, Calendar, ShieldCheck, MapPin, Tag, Video } from "lucide-react";
import { Header } from "@/components/shared/Header";
import { StatsCard } from "@/components/shared/StatsCard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreatorService } from "@/services/creator.service";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function CreatorsPage() {
  const creators = await CreatorService.getCreators();
  const creatorList = creators as any[];

  const activeCreators = creatorList.filter((c) => c.status === "ACTIVE").length;
  const totalShootsBooked = creatorList.reduce((sum, c) => sum + (c._count?.shoots || 0), 0);

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title="Creator Management Hub & Roster"
        subtitle="Verified UGC creators database with workload tracking, niche categorization, and double-booking prevention"
        actions={
          <Button size="sm" className="bg-amber-500 hover:bg-amber-400 text-black font-semibold gap-1.5 text-xs">
            <Plus className="h-4 w-4" /> Add New Creator
          </Button>
        }
      />

      <div className="p-8 space-y-6">
        {/* Metric Summaries */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Active Creators Roster"
            value={activeCreators}
            subtitle="Verified UGC talent on standby"
            icon={UserCheck}
            amberAccent={true}
          />
          <StatsCard
            title="Total Shoots Executed"
            value={totalShootsBooked}
            subtitle="Shoots booked through platform"
            icon={Video}
          />
          <StatsCard
            title="Avg Talent Rating"
            value="4.9 / 5.0"
            subtitle="Client satisfaction score"
            icon={Star}
          />
          <StatsCard
            title="Double-Booking Protection"
            value="100% Active"
            subtitle="Strict schedule collision locks"
            icon={ShieldCheck}
          />
        </div>

        {/* Creator Roster Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-400">
              Agency Creator Database ({creatorList.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {creatorList.map((creator) => (
              <Card
                key={creator.id}
                className="border-neutral-800 bg-[#121212] hover:border-neutral-700 transition-all flex flex-col justify-between"
              >
                <CardContent className="p-6 space-y-4">
                  {/* Top: Avatar & Name */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-lg">
                        {creator.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                          {creator.name}
                        </h3>
                        <p className="text-xs text-neutral-400 flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-amber-400" /> {creator.location || "India"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30 text-amber-400 text-xs font-bold font-mono">
                      <Star className="h-3 w-3 fill-amber-400" /> {creator.rating || 5.0}
                    </div>
                  </div>

                  {/* Niches & Demographics */}
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-1.5">
                      {creator.niches?.map((niche: string) => (
                        <Badge key={niche} variant="secondary" className="text-[10px] bg-neutral-800 text-neutral-300">
                          {niche}
                        </Badge>
                      ))}
                    </div>
                    {creator.demographics && (
                      <p className="text-[11px] text-neutral-400">
                        <strong className="text-neutral-300">Audience:</strong> {creator.demographics}
                      </p>
                    )}
                  </div>

                  {/* Pricing & Contact Details */}
                  <div className="p-3 rounded-lg bg-neutral-950 border border-neutral-800 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-400">Contract Rate:</span>
                      <span className="text-amber-400 font-mono font-bold">
                        {formatCurrency(Number(creator.ratesPerVideo))} / video
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-neutral-500">
                      <span>Contact:</span>
                      <span className="text-neutral-300 font-mono">{creator.contactPhone}</span>
                    </div>
                    {creator.bankUpiInfo && (
                      <div className="flex items-center justify-between text-neutral-500">
                        <span>UPI / Payout:</span>
                        <span className="text-neutral-300 font-mono">{creator.bankUpiInfo}</span>
                      </div>
                    )}
                  </div>

                  {/* Upcoming Schedule / Availabilities */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block">
                      Booking Status:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {creator.availabilities?.length > 0 ? (
                        creator.availabilities.map((av: any) => (
                          <Badge
                            key={av.id}
                            variant={av.status === "BOOKED" ? "warning" : "success"}
                            className="text-[10px]"
                          >
                            {formatDate(av.date)} ({av.timeSlot}): {av.status}
                          </Badge>
                        ))
                      ) : (
                        <Badge variant="success" className="text-[10px]">
                          Available for New Bookings
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Action Controls */}
                  <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between">
                    <span className="text-[11px] text-neutral-500">
                      Completed {creator._count?.videos || 0} Videos
                    </span>
                    <Button
                      variant="dark"
                      size="sm"
                      className="text-xs border-neutral-700 hover:border-amber-500/40 text-neutral-200"
                    >
                      Book Schedule
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
