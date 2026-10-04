"use client";

import { useState } from "react";
import { Plus, Building2, User, Mail, Phone, Globe, Shield, Tag, FileText } from "lucide-react";
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
import { createClientAction } from "@/actions/client.actions";
import { toast } from "sonner";

export function AddClientModal({ onClientAdded }: { onClientAdded?: () => void }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    clientName: "",
    companyName: "", // Canonical naming: companyName
    brandName: "",
    email: "",
    phone: "",
    whatsapp: "",
    industry: "E-Commerce",
    gstTaxId: "",
    source: "Direct",
    status: "NEW",
    brandKitUrl: "",
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await createClientAction(formData);
      if (res.success) {
        toast.success(`Client ${formData.companyName} created successfully!`);
        setOpen(false);
        setFormData({
          clientName: "",
          companyName: "",
          brandName: "",
          email: "",
          phone: "",
          whatsapp: "",
          industry: "E-Commerce",
          gstTaxId: "",
          source: "Direct",
          status: "NEW",
          brandKitUrl: "",
          notes: "",
        });
        if (onClientAdded) onClientAdded();
      } else {
        toast.error(res.error || "Failed to create client");
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
        <Button className="bg-amber-500 hover:bg-amber-400 text-black font-semibold gap-1.5 shadow-md shadow-amber-500/10">
          <Plus className="h-4 w-4" /> Add New Client
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-neutral-900 border-neutral-800 text-neutral-100">
        <DialogHeader>
          <DialogTitle className="text-xl text-white flex items-center gap-2">
            <Building2 className="h-5 w-5 text-amber-400" />
            Onboard New Client Brand
          </DialogTitle>
          <DialogDescription className="text-xs text-neutral-400">
            Creates a centralized client profile feeding all downstream scripts, shoots, videos, and billing.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Row 1: Company Name & Brand Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="companyName" className="text-neutral-300 flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5 text-amber-400" /> Legal Company Name *
              </Label>
              <Input
                id="companyName"
                placeholder="e.g. Zenith Apparel Pvt Ltd"
                required
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                className="bg-neutral-950 border-neutral-800"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="brandName" className="text-neutral-300 flex items-center gap-1.5">
                <Tag className="h-3.5 w-3.5 text-amber-400" /> Consumer Brand Name *
              </Label>
              <Input
                id="brandName"
                placeholder="e.g. Zenith Wear"
                required
                value={formData.brandName}
                onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                className="bg-neutral-950 border-neutral-800"
              />
            </div>
          </div>

          {/* Row 2: Contact Person & Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="clientName" className="text-neutral-300 flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-amber-400" /> Primary Contact Person *
              </Label>
              <Input
                id="clientName"
                placeholder="e.g. Rohan Varma (Founder / Head of Growth)"
                required
                value={formData.clientName}
                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                className="bg-neutral-950 border-neutral-800"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-neutral-300 flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-amber-400" /> Billing / Work Email *
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="rohan@zenithwear.com"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-neutral-950 border-neutral-800"
              />
            </div>
          </div>

          {/* Row 3: Phone & WhatsApp */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="phone" className="text-neutral-300 flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-amber-400" /> Contact Phone *
              </Label>
              <Input
                id="phone"
                placeholder="+91 98201 12345"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="bg-neutral-950 border-neutral-800"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="whatsapp" className="text-neutral-300">
                WhatsApp Operational Number
              </Label>
              <Input
                id="whatsapp"
                placeholder="+91 98201 12345"
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                className="bg-neutral-950 border-neutral-800"
              />
            </div>
          </div>

          {/* Row 4: Industry & GST */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="industry" className="text-neutral-300">
                Industry Niche
              </Label>
              <Select
                value={formData.industry}
                onValueChange={(val) => setFormData({ ...formData, industry: val })}
              >
                <SelectTrigger className="bg-neutral-950 border-neutral-800">
                  <SelectValue placeholder="Select Industry" />
                </SelectTrigger>
                <SelectContent className="bg-neutral-900 border-neutral-800">
                  <SelectItem value="E-Commerce">E-Commerce & D2C</SelectItem>
                  <SelectItem value="Beauty & Personal Care">Beauty & Personal Care</SelectItem>
                  <SelectItem value="Health & Fitness">Health & Fitness / Supplements</SelectItem>
                  <SelectItem value="Fashion & Apparel">Fashion & Apparel</SelectItem>
                  <SelectItem value="SaaS & Tech">SaaS & Mobile Apps</SelectItem>
                  <SelectItem value="Food & Beverage">Food & Beverage</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="gstTaxId" className="text-neutral-300">
                GSTIN / Tax Identification
              </Label>
              <Input
                id="gstTaxId"
                placeholder="27AABCU9603R1ZM"
                value={formData.gstTaxId}
                onChange={(e) => setFormData({ ...formData, gstTaxId: e.target.value })}
                className="bg-neutral-950 border-neutral-800 uppercase"
              />
            </div>
          </div>

          {/* Row 5: Initial Status & Brand Kit URL */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="status" className="text-neutral-300">
                Initial Pipeline Status
              </Label>
              <Select
                value={formData.status}
                onValueChange={(val) => setFormData({ ...formData, status: val })}
              >
                <SelectTrigger className="bg-neutral-950 border-neutral-800">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent className="bg-neutral-900 border-neutral-800">
                  <SelectItem value="LEAD">Lead (In Discussion)</SelectItem>
                  <SelectItem value="NEW">New (Agreement Signed)</SelectItem>
                  <SelectItem value="ONBOARDING">Onboarding (Asset Gathering)</SelectItem>
                  <SelectItem value="ACTIVE">Active (In Production)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="brandKitUrl" className="text-neutral-300 flex items-center gap-1.5">
                <Globe className="h-3.5 w-3.5 text-amber-400" /> Google Drive / Brand Kit URL
              </Label>
              <Input
                id="brandKitUrl"
                placeholder="https://drive.google.com/drive/folders/..."
                value={formData.brandKitUrl}
                onChange={(e) => setFormData({ ...formData, brandKitUrl: e.target.value })}
                className="bg-neutral-950 border-neutral-800"
              />
            </div>
          </div>

          {/* Row 6: Notes */}
          <div className="space-y-1.5">
            <Label htmlFor="notes" className="text-neutral-300 flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-amber-400" /> Creative Notes & Guidelines
            </Label>
            <Input
              id="notes"
              placeholder="e.g. Target audience Gen Z, prefers energetic UGC hooks, high-contrast subtitles."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="bg-neutral-950 border-neutral-800"
            />
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
              {loading ? "Creating Client..." : "Create Client Profile"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
