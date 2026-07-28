"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ClienteleClient({ clients }: { clients: any[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const filteredClients = useMemo(() => {
    if (!searchTerm) return clients;
    const lower = searchTerm.toLowerCase();
    return clients.filter(
      (c) =>
        c.first_name.toLowerCase().includes(lower) ||
        c.last_name.toLowerCase().includes(lower) ||
        c.email.toLowerCase().includes(lower),
    );
  }, [clients, searchTerm]);

  return (
    <div className="flex flex-col animate-in fade-in duration-700 w-full">
      <header className="px-12 py-10 flex flex-col justify-end border-b border-black/10 bg-white shrink-0">
        <h1 className="font-display text-4xl font-light uppercase tracking-widest">
          Clientele
        </h1>
        <p className="font-sans text-[0.65rem] tracking-[0.2em] text-black/40 mt-3 uppercase">
          {clients.length} Unique Clients
        </p>
      </header>

      <div className="flex-1 flex flex-col w-full bg-[#FDFDFD]">
        {/* Filter & Search Bar */}
        <div className="px-12 py-3 bg-white border-b border-black/5 flex flex-col sm:flex-row gap-6 justify-between sm:items-center sticky top-0 z-40 backdrop-blur-md bg-white/95 shadow-sm">
          <div className="flex items-center gap-3">
            <h2 className="font-sans text-[0.65rem] font-bold tracking-[0.2em] uppercase text-black">
              Client Directory
            </h2>
          </div>

          <div className="relative w-full sm:w-64 shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-black/30" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#FAFAFA] text-black placeholder:text-black/40 focus:bg-white focus:text-black focus:placeholder:text-black/40 border border-black/10 focus:border-black/20 pl-9 pr-4 py-1.5 font-sans text-[0.65rem] tracking-wider outline-none transition-all"
            />
          </div>
        </div>

        <div className="w-full bg-white">
          <div className="grid grid-cols-12 border-b border-black/10 px-12 py-4 font-sans text-[0.55rem] font-bold uppercase tracking-[0.2em] text-black/60 bg-[#FAFAFA]">
            <div className="col-span-3">Client Name</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-3">Contact</div>
            <div className="col-span-2">Location</div>
            <div className="col-span-1">LTV</div>
            <div className="col-span-1 text-right">Dossier</div>
          </div>

          <div className="flex flex-col divide-y divide-black/5">
            {filteredClients.map((client, i) => {
              const isVIP = client.total_spent >= 500000; // e.g. $5000 spend

              return (
                <div
                  key={i}
                  className="grid grid-cols-12 px-12 py-5 items-center hover:bg-black/5 transition-colors group cursor-pointer"
                  onClick={() =>
                    router.push(
                      `/store-management/clientele/${encodeURIComponent(client.email)}`,
                    )
                  }
                >
                  <div className="col-span-3 flex flex-col gap-1.5">
                    <span className="font-sans text-xs tracking-wide font-medium text-black group-hover:underline decoration-1 underline-offset-4 truncate pr-4">
                      {client.first_name} {client.last_name}
                    </span>
                    <span className="font-sans text-[0.55rem] tracking-[0.2em] text-black/40 uppercase">
                      {client.commissions_count}{" "}
                      {client.commissions_count === 1
                        ? "Commission"
                        : "Commissions"}
                    </span>
                  </div>

                  <div className="col-span-2 flex items-center">
                    <span
                      className={`inline-flex items-center justify-center font-sans text-[0.55rem] font-bold uppercase tracking-[0.2em] px-2.5 py-1 rounded-sm ${isVIP ? "bg-black text-white" : "bg-black/5 text-black/60"}`}
                    >
                      {isVIP ? "VIP" : "Standard"}
                    </span>
                  </div>

                  <div className="col-span-3 flex flex-col gap-1 font-sans text-[0.55rem] tracking-[0.1em] uppercase text-black/60 truncate pr-4">
                    <span className="text-black/80 truncate">
                      {client.email}
                    </span>
                    <span className="truncate">{client.phone}</span>
                  </div>

                  <div className="col-span-2 font-sans text-[0.55rem] tracking-[0.1em] uppercase text-black/60 truncate pr-4">
                    {client.location}
                  </div>

                  <div className="col-span-1 font-sans text-xs tracking-wider font-medium text-black">
                    ${(client.total_spent / 100).toFixed(2)}
                  </div>

                  <div className="col-span-1 text-right">
                    <span className="font-sans text-[0.55rem] font-bold uppercase tracking-[0.2em] text-black/40 border-b border-transparent group-hover:text-black group-hover:border-black transition-all">
                      View
                    </span>
                  </div>
                </div>
              );
            })}

            {filteredClients.length === 0 && (
              <div className="p-16 text-center font-sans text-xs tracking-widest text-black/40 uppercase border border-dashed border-black/10 m-8">
                No clients found matching "{searchTerm}".
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
