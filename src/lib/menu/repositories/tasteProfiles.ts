import { tasteProfiles as mockTasteProfiles } from "@/src/data/tasteProfiles";
import { createServerSupabaseClient } from "@/src/lib/supabase/server";
import { mapTasteProfileRow } from "./mappers";
import type { TasteProfile } from "@/src/types/menu";

export async function getTasteProfiles(): Promise<TasteProfile[]> {
  const supabase = createServerSupabaseClient();

  if (!supabase) {
    return mockTasteProfiles;
  }

  const { data, error } = await supabase
    .from("taste_profiles")
    .select("*")
    .order("sort_order");

  if (error || !data) {
    return mockTasteProfiles;
  }

  return data.map(mapTasteProfileRow);
}
