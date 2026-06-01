import { createServerSupabaseClient } from "@/src/lib/supabase/server";

export type DataSourceStatus = "supabase" | "mock";

export async function getDataSourceStatus(): Promise<DataSourceStatus> {
  const supabase = createServerSupabaseClient();

  if (!supabase) {
    return "mock";
  }

  const { error } = await supabase
    .from("menu_categories")
    .select("id")
    .limit(1);

  return error ? "mock" : "supabase";
}
