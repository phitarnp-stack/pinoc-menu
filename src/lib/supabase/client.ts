import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const normalizeSupabaseUrl = (url: string | undefined) => {
  if (!url) {
    return undefined;
  }

  try {
    return new URL(url.trim()).origin;
  } catch {
    return undefined;
  }
};

const supabaseProjectUrl = normalizeSupabaseUrl(supabaseUrl);

export const isSupabaseConfigured = Boolean(
  supabaseProjectUrl && supabaseAnonKey,
);

export const createBrowserSupabaseClient = () => {
  if (!supabaseProjectUrl || !supabaseAnonKey) {
    return null;
  }

  return createClient(supabaseProjectUrl, supabaseAnonKey);
};
