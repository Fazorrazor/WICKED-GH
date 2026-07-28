import { createClient } from "@supabase/supabase-js";
import { Database } from "./database.types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const isValidUrl = supabaseUrl && /^https?:\/\//i.test(supabaseUrl);

// Initialize the Supabase client safely
export const supabase = isValidUrl 
  ? createClient<Database>(supabaseUrl, supabaseAnonKey) 
  : null as any;

if (!isValidUrl && process.env.NODE_ENV !== "production") {
  console.warn("Supabase URL is missing or invalid; supabase client not initialized.");
}
