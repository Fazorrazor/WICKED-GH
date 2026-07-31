import { createBrowserClient } from "@supabase/ssr";
import { Database } from "../database.types";

export function createClient() {
  const supabaseUrl = "https://yfiafaeqvlgmpqcodrin.supabase.co";
  const supabaseKey = "sb_publishable_TTg3oxbRVOFSqEpNlNxkMA_MGTsVzlX";

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
