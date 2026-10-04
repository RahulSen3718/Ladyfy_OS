"use client";

import { useState } from "react";
import { Plus, Package, DollarSign, Calendar, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createOrderAction } from "@/actions/order.actions";
import { toast } from "sonner";

interface ClientOption {
  id: string;
  companyName: string;
  brandName: string;
}

export function CreateOrderModal({ clients }: { clients: ClientOption[] }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    clientId: clients[0]?.id || "",
    packageName: "10 UGC Video Package",
    contractedVideoCount: 10,
    pricing: 100000,
    gstRate: 18,
    startDate: new Date().toISOString().split("T")[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    status: "NEW",
  });

  const totalWithGst = Math.round(
    Number(formData.pricing || 0) * (1 + Number(formData.gstRate || 0) / 100)
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.clientId) {
      toast.error("Please select a client");
      return;
    }

    setLoading(true);
    try {
      const res = await createOrderAction(formData);
      if (res.success) {
        toast.success("Package Order created successfully!");
        setOpen(false);
      } else {
        toast.error(res.error || "Failed to create order");
      }
    } catch (err: any) {
      toast.error(err?.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-amber-500 hover:bg-amber-400 text-black font-semibold gap-1.5 shadow-md shadow-amber-500/10 text-xs">
          <Plus className="h-4 w-4" /> Create Package Order
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg bg-neutral-900 border-neutral-800 text-neutral-100">
        <DialogHeader>
          <DialogTitle className="text-lg text-white flex items-center gap-2">
            <Package className="h-5 w-5 text-amber-400" />
            New Commercial Package Commitment
          </DialogTitle>
          <DialogDescription className="text-xs text-neutral-400">
            Creates a contracted video quota order bound to a client profile.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Select Client */}
          <div className="space-y-1.5">
            <Label htmlFor="clientId" className="text-neutral-300 flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5 text-amber-400" /> Select Client Brand *
            </Label>
            <Select
              value={formData.clientId}
              onValueChange={(val) => setFormData({ ...formData, clientId: val })}
            >
              <SelectTrigger className="bg-neutral-950 border-neutral-800">
                <SelectValue placeholder="Select Client" />
              </SelectTrigger>
              <SelectContent className="bg-neutral-900 border-neutral-800">
                {clients.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.companyName} ({c.brandName})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Package Name & Video Count */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="packageName" className="text-neutral-300">
                Package Name *
              </Label>
              <Input
                id="packageName"
                required
                value={formData.packageName}
                onChange={(e) => setFormData({ ...formData, packageName: e.target.value })}
                className="bg-neutral-950 border-neutral-800"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="contractedVideoCount" className="text-neutral-300">
                Contracted Video Quota *
              </Label>
              <Input
                id="contractedVideoCount"
                type="number"
                min={1}
                required
                value={formData.contractedVideoCount}
                onChange={(e) => setFormData({ ...formData, contractedVideoCount: parseInt(e.target.value) || 1 })}
                className="bg-neutral-950 border-neutral-800 font-mono"
              />
            </div>
          </div>

          {/* Pricing & GST Calculation */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="pricing" className="text-neutral-300 flex items-center gap-1.5">
                <DollarSign className="h-3.5 w-3.5 text-amber-400" /> Base Pricing (INR) *
              </Label>
              <Input
                id="pricing"
                type="number"
                min={0}
                required
                value={formData.pricing}
                onChange={(e) => setFormData({ ...formData, pricing: parseFloat(e.target.value) || 0 })}
                className="bg-neutral-950 border-neutral-800 font-mono"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="gstRate" className="text-neutral-300">
                GST Rate (%)
              </Label>
              <Input
                id="gstRate"
                type="number"
                min={0}
                value={formData.gstRate}
                onChange={(e) => setFormData({ ...formData, gstRate: parseFloat(e.target.value) || 0 })}
                className="bg-neutral-950 border-neutral-800 font-mono"
              />
            </div>
          </div>

          {/* Calculated Total Display */}
          <div className="p-3 rounded-lg bg-neutral-950 border border-neutral-800 flex items-center justify-between">
            <span className="text-xs text-neutral-400 font-medium">
              Total Invoice Amount (incl. {formData.gstRate}% GST):
            </span>
            <span className="text-base font-bold font-mono text-amber-400">
              ₹{totalWithGst.toLocaleString("en-IN")}
            </span>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="startDate" className="text-neutral-300 flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-neutral-400" /> Start Date
              </Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="bg-neutral-950 border-neutral-800"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="dueDate" className="text-neutral-300 flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-amber-400" /> Due Date
              </Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="bg-neutral-950 border-neutral-800"
              />
            </div>
          </div>

          <DialogFooter className="pt-3 border-t border-neutral-800">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="border-neutral-800 text-neutral-300"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-amber-500 hover:bg-amber-400 text-black font-semibold"
            >
              {loading ? "Creating..." : "Confirm & Create Order"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
