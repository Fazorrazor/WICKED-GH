import { createBrowserClient } from "@supabase/ssr";
import { Database } from "../database.types";

export function createClient() {
  const FALLBACK_URL = "https://yfiafaeqvlgmpqcodrin.supabase.co";
  const FALLBACK_ANON = "sb_publishable_TTg3oxbRVOFSqEpNlNxkMA_MGTsVzlX";

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || FALLBACK_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || FALLBACK_ANON;

  // simple validation to avoid throwing at build time
  const isValidUrl = supabaseUrl && /^https?:\/\//i.test(supabaseUrl);

  if (isValidUrl) {
    return createBrowserClient<Database>(supabaseUrl, supabaseKey);
  } else {
    // Return a dummy object or null during build-time so it doesn't crash prerender
    if (process.env.NODE_ENV !== "production") {
      console.warn("Supabase URL is missing or invalid; supabase client not initialized.");
    }
    return null as any; // Cast as any to satisfy type but prevent crash
  }
}
