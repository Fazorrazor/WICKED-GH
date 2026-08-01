import { createClient } from "@/lib/supabase/server";
import ClienteleClient from "./ClienteleClient";

export const revalidate = 0;

export default async function ClientelePage() {
  const supabase = await createClient();
  // Fetch inquiries to extract unique clients
  const { data: inquiries, error } = await supabase
    .from("orders")
    .select(
      "email, shipping_address, created_at, total_cents",
    )
    .order("created_at", { ascending: false });

  if (error) {
    return <div>Error loading clientele.</div>;
  }

  // Process unique clients based on email
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const clientMap = new Map<string, any>();

  inquiries?.forEach((inquiry: { email?: string; shipping_address?: string; created_at?: string; total_cents?: number }) => {
    if (!inquiry.email) return;

    if (clientMap.has(inquiry.email)) {
      const existing = clientMap.get(inquiry.email);
      existing.total_spent += inquiry.total_cents;
      existing.commissions_count += 1;
      clientMap.set(inquiry.email, existing);
    } else {
      const addrParts = inquiry.shipping_address?.split("\n") || [];
      const nameParts = (addrParts[0] || "").split(" ");
      const first_name = nameParts[0] || "Unknown";
      const last_name = nameParts.slice(1).join(" ") || "";
      const phone = addrParts[1] || "Unknown";
      const location = addrParts[3] || addrParts[2] || "Unknown Location";

      clientMap.set(inquiry.email, {
        email: inquiry.email,
        first_name,
        last_name,
        phone,
        location,
        first_seen: inquiry.created_at,
        total_spent: inquiry.total_cents,
        commissions_count: 1,
      });
    }
  });

  const clients = Array.from(clientMap.values());

  return <ClienteleClient clients={clients} />;
}
