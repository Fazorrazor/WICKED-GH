"use client";

import { useState } from "react";
import { Loader2, Download } from "lucide-react";
import { generateAndEmailInvoiceAction } from "../../actions";
import { toast } from "sonner";

export default function InvoiceButton({
  id,
  status,
}: {
  id: string;
  status: string;
}) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      await generateAndEmailInvoiceAction(id);
      toast.success("Invoice generated and emailed to client");
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate invoice");
    } finally {
      setIsGenerating(false);
    }
  };

  const isInvoiced =
    status === "invoiced" || status === "paid" || status === "completed";

  if (isInvoiced) {
    return (
      <a
        href={`/api/invoices/${id}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full border px-6 py-4 font-sans text-[0.55rem] font-bold tracking-[0.2em] uppercase transition-colors bg-white text-black border-black/20 hover:border-black flex items-center justify-center gap-2 cursor-pointer"
      >
        <Download className="w-3.5 h-3.5" />
        Download Invoice
      </a>
    );
  }

  return (
    <button
      onClick={handleGenerate}
      disabled={isGenerating}
      className="w-full border px-6 py-4 font-sans text-[0.55rem] font-bold tracking-[0.2em] uppercase transition-colors bg-white text-black border-black/10 hover:border-black hover:bg-[#fafafa] cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isGenerating ? (
        <>
          <Loader2 className="w-3.5 h-3.5 animate-spin" /> Generating...
        </>
      ) : (
        "Generate Custom Invoice"
      )}
    </button>
  );
}
