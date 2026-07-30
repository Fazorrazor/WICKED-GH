import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// A public-only client that does NOT read cookies.
// This prevents Next.js from opting routes into Dynamic Rendering,
// allowing us to use ISR (Incremental Static Regeneration).
export function getPublicClient() {
  const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || "")
    .replace(/["']/g, "")
    .trim();

  const supabaseKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "")
    .replace(/["']/g, "")
    .trim();

  if (!supabaseUrl || !supabaseUrl.startsWith("http")) {
    console.warn("[getPublicClient] NEXT_PUBLIC_SUPABASE_URL is missing or invalid.");
    return null as any;
  }

  if (!supabaseKey || (!supabaseKey.startsWith("sb_") && !supabaseKey.startsWith("eyJ"))) {
    console.warn("[getPublicClient] NEXT_PUBLIC_SUPABASE_ANON_KEY is missing or invalid.");
    return null as any;
  }

  return createSupabaseClient(supabaseUrl, supabaseKey);
}
