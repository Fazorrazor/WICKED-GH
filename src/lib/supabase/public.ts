import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// A public-only client that does NOT read cookies.
// This prevents Next.js from opting routes into Dynamic Rendering,
// allowing us to use ISR (Incremental Static Regeneration).
export function getPublicClient() {
  let supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || "")
    .replace(/["']/g, "")
    .trim();
  if (!supabaseUrl || !supabaseUrl.startsWith("http")) {
    supabaseUrl = "https://ayhbxxdrtxxlcsqucxmq.supabase.co";
  }

  let supabaseKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "")
    .replace(/["']/g, "")
    .trim();
  if (
    !supabaseKey ||
    supabaseKey === "undefined" ||
    (!supabaseKey.startsWith("sb_") && !supabaseKey.startsWith("eyJ"))
  ) {
    supabaseKey = "sb_publishable_uE595O8hF7pRJu7Ye3RJCA_xBo9ueIz";
  }

  return createSupabaseClient(supabaseUrl, supabaseKey);
}
