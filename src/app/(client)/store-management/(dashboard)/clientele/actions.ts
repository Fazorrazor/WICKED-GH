"use server";

import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
export async function deleteInquiry(inquiryId: string, email: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error(
      "Unauthorized: Atelier authentication required to perform destructive actions.",
    );
  }

  // Use service role to bypass RLS for administrative deletion
  const adminUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const adminKey = process.env.SUPABASE_SECRET_KEY;
  if (!adminUrl || !adminKey) {
    throw new Error("Missing Supabase admin credentials. Ensure SUPABASE_SECRET_KEY is set.");
  }
  const adminSupabase = createAdminClient(adminUrl, adminKey);

  const { error } = await adminSupabase
    .from("orders")
    .delete()
    .eq("id", inquiryId);

  if (error) {
    console.error("Failed to delete inquiry:", error);
    throw new Error("Failed to delete inquiry");
  }

  // Revalidate both the directory and the dossier pages
  revalidatePath("/store-management/clientele");
  revalidatePath(`/store-management/clientele/${encodeURIComponent(email)}`);

  return { success: true };
}
