"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  ArrowLeft,
  Save,
  FileText,
  Ruler,
  MapPin,
  Phone,
  Mail,
  Loader2,
  Trash2,
} from "lucide-react";
import { deleteInquiry } from "../actions";
import ConfirmModal from "@/components/store-management/ConfirmModal";
import { toast } from "sonner";

export default function DossierClient({
  client,
  history,
}: {
  client: any;
  history: any[];
}) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const isVIP = client.total_spent >= 500000; // $5000+
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [inquiryToDelete, setInquiryToDelete] = useState<string | null>(null);
  const [notes, setNotes] = useState(""); // In a real app, we'd load this from a DB

  const handleSaveNotes = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    toast.success("Profile saved successfully");
    setIsSaving(false);
  };

  const handleDeleteClick = (inquiryId: string) => {
    setInquiryToDelete(inquiryId);
  };

  const confirmDelete = async () => {
    if (!inquiryToDelete) return;

    setIsDeleting(inquiryToDelete);
    setInquiryToDelete(null);
    try {
      await deleteInquiry(inquiryToDelete, client.email);
      toast.success("Commission deleted successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete the commission");
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="flex flex-col animate-in fade-in duration-700 w-full min-h-screen bg-[#FDFDFD]">
      {/* Dossier Header */}
      <header className="px-12 pt-16 flex flex-col md:flex-row md:justify-between md:items-end pb-10 border-b border-black/10 bg-white shrink-0">
        <div>
          <button
            onClick={() => router.push("/store-management/clientele")}
            className="font-sans text-[0.55rem] font-bold tracking-[0.2em] uppercase text-black/40 hover:text-black transition-colors flex items-center gap-2 mb-6"
          >
            <ArrowLeft className="w-3 h-3" /> Back to Directory
          </button>

          <div className="flex items-center gap-4 mb-2">
            <h1 className="font-display text-4xl font-light uppercase tracking-widest">
              {client.first_name} {client.last_name}
            </h1>
            <span
              className={`inline-flex items-center justify-center font-sans text-[0.55rem] font-bold uppercase tracking-[0.2em] px-2.5 py-1 rounded-sm ${isVIP ? "bg-black text-white" : "bg-black/5 text-black/60"}`}
            >
              {isVIP ? "VIP" : "Standard"}
            </span>
          </div>

          <div className="flex items-center gap-6 font-sans text-[0.65rem] tracking-[0.15em] text-black/60 uppercase">
            <span className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" /> {client.email}
            </span>
            <span className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5" /> {client.phone}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" /> {client.location}
            </span>
          </div>
        </div>

        <div className="mt-8 md:mt-0 flex flex-col items-end gap-1">
          <span className="font-sans text-[0.65rem] tracking-[0.2em] text-black/40 uppercase">
            Lifetime Value
          </span>
          <span className="font-sans text-2xl font-medium tracking-wide">
            ${(client.total_spent / 100).toFixed(2)}
          </span>
          <span className="font-sans text-[0.55rem] tracking-[0.2em] text-black/40 uppercase mt-1">
            Across {client.commissions_count}{" "}
            {client.commissions_count === 1 ? "Commission" : "Commissions"}
          </span>
        </div>
      </header>

      {/* Main Content Split */}
      <div className="flex-1 w-full px-12 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Left / Commission History */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            <section>
              <div className="flex items-center justify-between border-b border-black/10 pb-3 mb-8">
                <h2 className="font-sans text-[0.65rem] font-bold tracking-[0.2em] uppercase text-black flex items-center gap-2">
                  <FileText className="w-4 h-4" /> Commission History
                </h2>
              </div>

              <div className="flex flex-col gap-6">
                {history.map((inquiry) => {
                  const firstItem = inquiry.items?.[0];

                  return (
                    <div
                      key={inquiry.id}
                      className="flex gap-6 p-6 border border-black/10 bg-white group hover:border-black/30 transition-colors"
                    >
                      {/* Thumbnail */}
                      <div className="w-24 h-32 relative bg-[#FAFAFA] shrink-0 border border-black/5 overflow-hidden">
                        {firstItem?.image ? (
                          <Image
                            src={firstItem.image}
                            alt="Silhouette"
                            fill
                            sizes="96px"
                            className="object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-700"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-black/5" />
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex flex-col flex-1 py-1">
                        <div className="flex justify-between items-start">
                          <div className="flex flex-col gap-1">
                            <span className="font-sans text-[0.55rem] tracking-[0.2em] text-black/40 uppercase">
                              {new Date(inquiry.created_at).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                },
                              )}
                            </span>
                            <h3 className="font-sans text-sm tracking-wide font-medium text-black">
                              {firstItem?.title || "Bespoke Request"}
                            </h3>
                            <span className="font-sans text-[0.55rem] tracking-[0.2em] text-black/60 uppercase">
                              Order ID: {inquiry.id.split("-")[0].toUpperCase()}
                            </span>
                          </div>
                          <span className="font-sans text-xs tracking-wider font-medium text-black">
                            ${((inquiry.total_cents || 0) / 100).toFixed(2)}
                          </span>
                        </div>

                        <div className="mt-4 pt-4 border-t border-black/5 flex justify-between items-end">
                          <div className="flex-1">
                            <span className="font-sans text-[0.55rem] font-bold tracking-[0.1em] uppercase text-black/40 mb-2 block">
                              Client Request Notes
                            </span>
                            <p className="font-sans text-xs text-black/70 leading-relaxed italic pr-4">
                              "
                              {inquiry.message ||
                                "No specific request notes provided."}
                              "
                            </p>
                          </div>
                          <button
                            onClick={() => handleDeleteClick(inquiry.id)}
                            disabled={isDeleting === inquiry.id}
                            className="font-sans text-[0.55rem] tracking-[0.1em] uppercase text-red-600 hover:text-red-800 transition-colors flex items-center gap-1.5 p-2 disabled:opacity-50"
                            title="Delete Commission"
                          >
                            {isDeleting === inquiry.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {history.length === 0 && (
                  <div className="p-12 text-center border border-dashed border-black/10 font-sans text-xs tracking-widest text-black/40 uppercase">
                    No commission history found.
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Right / Bespoke Notes & Measurements */}
          <div className="flex flex-col gap-12">
            <section className="bg-white border border-black/10 p-8 flex flex-col h-full sticky top-32">
              <div className="flex items-center justify-between border-b border-black/10 pb-3 mb-6">
                <h2 className="font-sans text-[0.65rem] font-bold tracking-[0.2em] uppercase text-black flex items-center gap-2">
                  <Ruler className="w-4 h-4" /> Bespoke Profile
                </h2>
                <button
                  onClick={handleSaveNotes}
                  disabled={isSaving}
                  className="font-sans text-[0.55rem] font-bold uppercase tracking-[0.2em] text-black hover:text-black/60 transition-colors flex items-center gap-1.5"
                >
                  {isSaving ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <Save className="w-3 h-3" />
                  )}
                  {isSaving ? "Saving" : "Save Profile"}
                </button>
              </div>

              <p className="font-sans text-[0.6rem] tracking-[0.1em] text-black/50 leading-relaxed mb-6">
                Store private measurement details, fitting notes, styling
                preferences, and any important caveats for future bespoke
                commissions.
              </p>

              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g., Prefers a tailored fit around the shoulders. Sleeve length should be slightly longer than standard (+1.5 inches). Sensitive to wool, prefers silk linings..."
                className="flex-1 w-full border border-black/10 p-4 font-sans text-xs bg-[#fafafa] text-black/80 outline-none focus:border-black focus:bg-white transition-all resize-none leading-relaxed"
              />

              <div className="mt-6 pt-6 border-t border-black/5">
                <div className="flex justify-between items-center font-sans text-[0.55rem] tracking-[0.2em] uppercase text-black/40">
                  <span>Last Updated</span>
                  <span>Just now</span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={inquiryToDelete !== null}
        title="Delete Commission"
        message="Are you sure you want to delete this commission from the dossier? This action is permanent and cannot be undone."
        confirmText="Delete"
        requireString="DELETE"
        isConfirming={isDeleting !== null}
        onConfirm={confirmDelete}
        onCancel={() => setInquiryToDelete(null)}
      />
    </div>
  );
}
