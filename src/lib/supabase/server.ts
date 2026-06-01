import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

const getSupabaseProjectHost = () => {
  if (!supabaseUrl) {
    return undefined;
  }

  try {
    return new URL(supabaseUrl).host;
  } catch {
    return "invalid-supabase-url";
  }
};

export const supabaseProjectHost = getSupabaseProjectHost();

export const createServerSupabaseClient = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
    },
  });
};
