import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import Image from "next/image";
import { updateInquiryStatus } from "../../actions";
import DeleteCommissionButton from "./DeleteCommissionButton";
import InvoiceButton from "./InvoiceButton";

export const revalidate = 0;

export default async function CommissionDossier({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const supabase = await createClient();

  const { data: inquiry, error } = await supabase
    .from("orders")
    .select(`
      *,
      order_items (
        quantity,
        price_cents,
        products (
          title,
          image_solo_url
        )
      )
    `)
    .eq("id", resolvedParams.id)
    .single();

  if (error || !inquiry) {
    return <div>Dossier not found.</div>;
  }

  const addrParts = inquiry.shipping_address?.split("\n") || [];
  const nameParts = (addrParts[0] || "").split(" ");
  const first_name = nameParts[0] || "Unknown";
  const last_name = nameParts.slice(1).join(" ") || "";
  const phone = addrParts[1] || "Unknown";
  const address = addrParts[2] || "Unknown Address";
  const locationParts = (addrParts[3] || "").split(", ");
  const city = locationParts[0] || "Unknown City";
  const region = locationParts[1] || "Unknown Region";
  const landmark = addrParts[4] ? addrParts[4].replace("Notes: ", "") : null;

  return (
    <div className="flex flex-col animate-in fade-in duration-700 w-full bg-[#FDFDFD]">
      <header className="h-48 px-12 flex flex-col justify-end pb-10 border-b border-black/10 bg-white shrink-0">
        <Link
          href="/store-management"
          className="font-sans text-[0.55rem] font-bold tracking-[0.2em] uppercase text-black/40 hover:text-black transition-colors w-fit mb-4"
        >
          ← Back to Commissions
        </Link>
        <div className="flex justify-between items-end">
          <div>
            <h1 className="font-display text-4xl font-light uppercase tracking-widest">
              Commission Details
            </h1>
            <p className="font-sans text-[0.65rem] tracking-[0.2em] text-black/40 mt-3 uppercase">
              ID: {inquiry.id}
            </p>
          </div>
          <div>
            <span
              className={`inline-block px-3 py-1 font-sans text-[0.55rem] font-bold tracking-[0.2em] uppercase border ${
                inquiry.status === "pending"
                  ? "bg-black text-white border-black"
                  : inquiry.status === "contacted"
                    ? "bg-transparent text-black border-black/40"
                    : inquiry.status === "invoiced"
                      ? "bg-[#fafafa] text-black border-black/20"
                      : "bg-transparent text-black/40 border-black/10"
              }`}
            >
              {inquiry.status}
            </span>
          </div>
        </div>
      </header>

      <div className="flex-1 w-full px-12 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left Column: Client Details */}
          <div className="flex flex-col gap-12">
            <section>
              <h2 className="font-sans text-[0.55rem] font-bold tracking-[0.2em] uppercase border-b border-black/10 pb-3 mb-6 text-black/40">
                Client Profile
              </h2>
              <div className="flex flex-col gap-2 font-sans text-sm">
                <div className="flex items-stretch group">
                  <span className="text-black/40 text-[0.55rem] font-bold uppercase tracking-[0.2em] w-32 shrink-0 py-3 flex items-center">
                    Name
                  </span>
                  <div className="flex-1 bg-gradient-to-r from-black/[0.04] to-transparent group-hover:from-black/[0.06] transition-colors px-4 py-3 border-l border-black/10">
                    <span className="font-medium tracking-wide">
                      {first_name} {last_name}
                    </span>
                  </div>
                </div>
                <div className="flex items-stretch group">
                  <span className="text-black/40 text-[0.55rem] font-bold uppercase tracking-[0.2em] w-32 shrink-0 py-3 flex items-center">
                    Email
                  </span>
                  <div className="flex-1 bg-gradient-to-r from-black/[0.04] to-transparent group-hover:from-black/[0.06] transition-colors px-4 py-3 border-l border-black/10">
                    <a
                      href={`mailto:${inquiry.email}`}
                      className="border-b border-black/20 pb-0.5 hover:text-black/60 transition-colors"
                    >
                      {inquiry.email}
                    </a>
                  </div>
                </div>
                <div className="flex items-stretch group">
                  <span className="text-black/40 text-[0.55rem] font-bold uppercase tracking-[0.2em] w-32 shrink-0 py-3 flex items-center">
                    Phone
                  </span>
                  <div className="flex-1 bg-gradient-to-r from-black/[0.04] to-transparent group-hover:from-black/[0.06] transition-colors px-4 py-3 border-l border-black/10">
                    <span>{phone}</span>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="font-sans text-[0.55rem] font-bold tracking-[0.2em] uppercase border-b border-black/10 pb-3 mb-6 text-black/40">
                Logistics
              </h2>
              <div className="flex flex-col gap-2 font-sans text-sm">
                <div className="flex items-stretch group">
                  <span className="text-black/40 text-[0.55rem] font-bold uppercase tracking-[0.2em] w-32 shrink-0 py-3 flex items-center">
                    Region
                  </span>
                  <div className="flex-1 bg-gradient-to-r from-black/[0.04] to-transparent group-hover:from-black/[0.06] transition-colors px-4 py-3 border-l border-black/10">
                    <span>{region}</span>
                  </div>
                </div>
                <div className="flex items-stretch group">
                  <span className="text-black/40 text-[0.55rem] font-bold uppercase tracking-[0.2em] w-32 shrink-0 py-3 flex items-center">
                    City
                  </span>
                  <div className="flex-1 bg-gradient-to-r from-black/[0.04] to-transparent group-hover:from-black/[0.06] transition-colors px-4 py-3 border-l border-black/10">
                    <span>{city}</span>
                  </div>
                </div>
                <div className="flex items-stretch group">
                  <span className="text-black/40 text-[0.55rem] font-bold uppercase tracking-[0.2em] w-32 shrink-0 py-3 pt-4 flex items-start">
                    Address
                  </span>
                  <div className="flex-1 bg-gradient-to-r from-black/[0.04] to-transparent group-hover:from-black/[0.06] transition-colors px-4 py-3 border-l border-black/10">
                    <span className="leading-relaxed inline-block">
                      {address}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {landmark && (
              <section>
                <h2 className="font-sans text-[0.55rem] font-bold tracking-[0.2em] uppercase border-b border-black/10 pb-3 mb-6 text-black/40">
                  Bespoke Notes
                </h2>
                <div className="bg-gradient-to-b from-black/[0.04] to-transparent border border-black/10">
                  <p className="font-sans text-sm leading-relaxed p-6 whitespace-pre-wrap">
                    {landmark}
                  </p>
                </div>
              </section>
            )}
          </div>

          {/* Right Column: Garments & Actions */}
          <div className="flex flex-col gap-12">
            <section>
              <h2 className="font-sans text-[0.55rem] font-bold tracking-[0.2em] uppercase border-b border-black/10 pb-3 mb-6 text-black/40">
                Requested Silhouettes
              </h2>
              <div className="flex flex-col gap-4">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {inquiry.order_items?.map((item: any, i: number) => (
                  <div
                    key={i}
                    className="flex gap-6 bg-white p-6 border border-black/10"
                  >
                    <div className="relative w-16 h-24 bg-[#FAFAFA] shrink-0 border border-black/5">
                      <Image
                        src={item.products?.image_solo_url || "/chrome-logo.png"}
                        alt={item.products?.title || "Product Image"}
                        fill
                        className="object-cover mix-blend-multiply"
                      />
                    </div>
                    <div className="flex flex-col py-1">
                      <span className="font-sans text-sm tracking-wide font-medium">
                        {item.products?.title || "Bespoke Garment"}
                      </span>
                      <span className="font-sans text-[0.65rem] uppercase tracking-[0.2em] text-black/40 mt-1.5">
                        Variant: Standard
                      </span>
                      <span className="font-sans text-[0.65rem] uppercase tracking-[0.2em] text-black/40 mt-1">
                        Qty: {item.quantity}
                      </span>
                      <span className="font-sans text-sm tracking-wider mt-auto">
                        ${(item.price_cents / 100).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex justify-between items-center pt-6 border-t border-black/10">
                <span className="font-sans text-[0.55rem] uppercase tracking-[0.2em] font-bold text-black/40">
                  Estimated Base Total
                </span>
                <span className="font-sans text-xl tracking-wider">
                  ${(inquiry.total_cents / 100).toFixed(2)}
                </span>
              </div>
            </section>

            <section className="bg-white border border-black/10 p-8">
              <h2 className="font-sans text-[0.55rem] font-bold tracking-[0.2em] uppercase mb-6 text-center text-black/40">
                Atelier Actions
              </h2>
              <div className="flex flex-col gap-3">
                <form
                  action={updateInquiryStatus.bind(
                    null,
                    inquiry.id,
                    "contacted",
                  )}
                >
                  <button
                    type="submit"
                    disabled={inquiry.status !== "pending"}
                    className={`w-full px-6 py-4 font-sans text-[0.55rem] font-bold tracking-[0.2em] uppercase transition-colors ${
                      inquiry.status === "pending"
                        ? "bg-black text-white hover:bg-black/80 cursor-pointer"
                        : "bg-black/5 text-black/40 cursor-not-allowed"
                    }`}
                  >
                    {inquiry.status === "pending"
                      ? "Mark as Contacted"
                      : "Contacted"}
                  </button>
                </form>
                <InvoiceButton id={inquiry.id} status={inquiry.status || "pending"} />

                <div className="mt-4 pt-4 border-t border-black/10">
                  <DeleteCommissionButton id={inquiry.id} />
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
