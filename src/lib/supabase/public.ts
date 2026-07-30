import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// A public-only client that does NOT read cookies.
// This prevents Next.js from opting routes into Dynamic Rendering,
// allowing us to use ISR (Incremental Static Regeneration).
//
// NOTE: NEXT_PUBLIC_ vars are baked at build time. If a Vercel build ran before
// those vars were set, they will be undefined even if the dashboard shows them.
// We fall back to the server-only variants (SUPABASE_URL / SUPABASE_ANON_KEY)
// which are always read at runtime and are safe to use in Server Components.
export function getPublicClient() {
  const supabaseUrl = (
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.SUPABASE_URL ||
    ""
  )
    .replace(/["']/g, "")
    .trim();

  const supabaseKey = (
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.SUPABASE_PUBLISHABLE_KEY ||
    ""
  )
    .replace(/["']/g, "")
    .trim();

  if (!supabaseUrl || !supabaseUrl.startsWith("http")) {
    console.warn("[getPublicClient] No valid Supabase URL found in any env var.");
    return null as any;
  }

  if (!supabaseKey || (!supabaseKey.startsWith("sb_") && !supabaseKey.startsWith("eyJ"))) {
    console.warn("[getPublicClient] No valid Supabase anon key found in any env var.");
    return null as any;
  }

  return createSupabaseClient(supabaseUrl, supabaseKey);
}
