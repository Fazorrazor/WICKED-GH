import { createClient } from "@/lib/supabase/server";
import DossierClient from "./DossierClient";
import { notFound } from "next/navigation";

export const revalidate = 0;

export default async function DossierPage({
  params,
}: {
  params: Promise<{ email: string }>;
}) {
  const resolvedParams = await params;
  const email = decodeURIComponent(resolvedParams.email);
  const supabase = await createClient();

  const { data: inquiries, error } = await supabase
    .from("orders")
    .select("*")
    .ilike("email", email)
    .order("created_at", { ascending: false });

  if (error || !inquiries || inquiries.length === 0) {
    return notFound();
  }

  const addrParts = inquiries[0].shipping_address?.split("\n") || [];
  const nameParts = (addrParts[0] || "").split(" ");

  // Aggregate client data
  const clientData = {
    email,
    first_name: nameParts[0] || "Unknown",
    last_name: nameParts.slice(1).join(" ") || "",
    phone: addrParts[1] || "Unknown",
    location: addrParts[3] || addrParts[2] || "Unknown Location",
    total_spent: inquiries.reduce(
      (sum, inq) => sum + (inq.total_cents || 0),
      0,
    ),
    commissions_count: inquiries.length,
  };

  return <DossierClient client={clientData} history={inquiries} />;
}
