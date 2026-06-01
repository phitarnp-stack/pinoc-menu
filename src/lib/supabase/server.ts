import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const normalizeSupabaseUrl = (url: string | undefined) => {
  if (!url) {
    return undefined;
  }

  try {
    const parsedUrl = new URL(url.trim());

    return parsedUrl.origin;
  } catch {
    return undefined;
  }
};

export const supabaseProjectUrl = normalizeSupabaseUrl(supabaseUrl);

export const supabaseRestUrl = supabaseProjectUrl
  ? `${supabaseProjectUrl}/rest/v1`
  : undefined;

export const isSupabaseConfigured = Boolean(
  supabaseProjectUrl && supabaseAnonKey,
);

export const supabaseRuntime = "server";

export const supabaseKeyPrefix = supabaseAnonKey
  ? supabaseAnonKey.slice(0, 12)
  : undefined;

export const supabaseKeyFormat = supabaseAnonKey?.startsWith("sb_publishable_")
  ? "starts with sb_publishable_"
  : supabaseAnonKey?.startsWith("eyJ")
    ? "starts with eyJ"
    : supabaseAnonKey
      ? "other"
      : "missing";

const getSupabaseProjectHost = () => {
  if (!supabaseProjectUrl) {
    return undefined;
  }

  try {
    return new URL(supabaseProjectUrl).host;
  } catch {
    return "invalid-supabase-url";
  }
};

export const supabaseProjectHost = getSupabaseProjectHost();

export const createServerSupabaseClient = () => {
  if (!supabaseProjectUrl || !supabaseAnonKey) {
    return null;
  }

  return createClient(supabaseProjectUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
    },
  });
};
