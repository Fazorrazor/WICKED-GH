import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export const revalidate = 0;

export default async function AtelierDashboard() {
  const supabase = await createClient();
  const { data: inquiries, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching inquiries:", error);
    return <div>Error loading commissions.</div>;
  }

  const activeInquiries = inquiries || [];
  const totalPipeline = activeInquiries.reduce(
    (sum: number, item: { total_cents?: number }) => sum + (item.total_cents || 0),
    0,
  );
  const avgOrderValue =
    activeInquiries.length > 0 ? totalPipeline / activeInquiries.length : 0;
  const uniqueClients = new Set(activeInquiries.map((i: { email?: string }) => i.email)).size;

  return (
    <div className="flex flex-col animate-in fade-in duration-700 w-full min-h-screen bg-[#f4f0ee]">
      {/* Page Header */}
      <header className="h-48 px-12 flex flex-col justify-end pb-10 border-b border-[#1a0a0e]/10 bg-[#f4f0ee] shrink-0">
        <span className="text-[0.55rem] font-bold tracking-[0.3em] uppercase text-[#781625] mb-3">
          Store Management
        </span>
        <h1 className="font-display text-4xl font-light uppercase tracking-widest text-[#1a0a0e]">
          Dashboard
        </h1>
        <p className="font-sans text-[0.65rem] tracking-[0.2em] text-[#1a0a0e]/50 mt-3 uppercase">
          Order pipeline overview
        </p>
      </header>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 border-b border-[#1a0a0e]/10 shrink-0">
        {[
          {
            label: "Pipeline Value",
            value: `$${(totalPipeline / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            accent: true,
          },
          { label: "Active Orders", value: activeInquiries.length, accent: false },
          {
            label: "Avg. Order Value",
            value: `$${(avgOrderValue / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            accent: false,
          },
          { label: "Unique Clients", value: uniqueClients, accent: false },
        ].map((stat, i) => (
          <div
            key={stat.label}
            className={`px-12 py-10 flex flex-col justify-between h-40 relative group transition-colors border-r border-[#1a0a0e]/10 last:border-r-0 ${
              stat.accent ? "bg-[#781625]" : "bg-white hover:bg-[#f0ece9]"
            }`}
          >
            <span className={`font-sans text-[0.55rem] font-bold tracking-[0.25em] uppercase ${stat.accent ? "text-white/60" : "text-[#1a0a0e]/50"}`}>
              {stat.label}
            </span>
            <span className={`font-display text-3xl tracking-tight ${stat.accent ? "text-white" : "text-[#1a0a0e]"}`}>
              {stat.value}
            </span>
          </div>
        ))}
      </div>

      {/* Orders Table */}
      <div className="flex-1 flex flex-col w-full">
        <div className="px-12 pt-14 pb-6 flex justify-between items-end">
          <h2 className="font-sans text-[0.65rem] font-bold tracking-[0.25em] uppercase text-[#1a0a0e]">
            Active Orders
          </h2>
          <span className="font-sans text-[0.55rem] tracking-[0.2em] uppercase text-[#781625] font-bold">
            {activeInquiries.length} total
          </span>
        </div>

        <div className="w-full bg-white border-t border-[#1a0a0e]/10 mx-0">
          {/* Table Header */}
          <div className="grid grid-cols-6 border-b border-[#1a0a0e]/10 px-12 py-4 font-sans text-[0.6rem] font-bold uppercase tracking-[0.2em] text-[#1a0a0e]/50 bg-[#f9f7f6]">
            <div className="col-span-2">Client / Order ID</div>
            <div>Date Received</div>
            <div>Location</div>
            <div>Status</div>
            <div className="text-right">Action</div>
          </div>

          {/* Table Rows */}
          <div className="flex flex-col divide-y divide-[#1a0a0e]/5">
            {inquiries?.map((inquiry: { id: string; email?: string; created_at?: string; shipping_address?: string; status?: string; total_cents?: number }) => (
              <div
                key={inquiry.id}
                className="grid grid-cols-6 px-12 py-6 items-center hover:bg-[#f9f7f6] transition-colors group"
              >
                <div className="col-span-2 flex flex-col gap-1.5">
                  <span className="font-sans text-sm tracking-wide font-semibold text-[#1a0a0e]">
                    {inquiry.email?.split("@")[0] || "Client"}
                  </span>
                  <span className="font-sans text-[0.6rem] tracking-[0.2em] text-[#1a0a0e]/40 uppercase">
                    #{inquiry.id.split("-")[0]}
                  </span>
                </div>

                <div className="font-sans text-[0.65rem] tracking-[0.1em] text-[#1a0a0e]/70 uppercase">
                  {new Date(inquiry.created_at || Date.now()).toLocaleDateString()}
                </div>

                <div className="font-sans text-[0.65rem] tracking-[0.1em] text-[#1a0a0e]/70 uppercase truncate pr-4">
                  {inquiry.shipping_address
                    ? JSON.parse(inquiry.shipping_address).country || "Unknown"
                    : "Unknown"}
                </div>

                <div>
                  <span
                    className={`inline-block px-3 py-1 font-sans text-[0.55rem] font-bold tracking-[0.2em] uppercase border ${
                      inquiry.status === "pending"
                        ? "bg-[#781625] text-white border-[#781625]"
                        : inquiry.status === "contacted"
                          ? "bg-transparent text-[#781625] border-[#781625]/40"
                          : "bg-transparent text-[#1a0a0e]/40 border-[#1a0a0e]/15"
                    }`}
                  >
                    {inquiry.status}
                  </span>
                </div>

                <div className="text-right">
                  <Link
                    href={`/store-management/commissions/${inquiry.id}`}
                    className="font-sans text-[0.55rem] font-bold uppercase tracking-[0.2em] text-[#781625]/70 border-b border-[#781625]/30 pb-0.5 hover:text-[#781625] hover:border-[#781625] transition-all"
                  >
                    View Order
                  </Link>
                </div>
              </div>
            ))}

            {(!inquiries || inquiries.length === 0) && (
              <div className="p-16 text-center font-sans text-sm tracking-widest text-[#1a0a0e]/30 uppercase">
                No active orders.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
