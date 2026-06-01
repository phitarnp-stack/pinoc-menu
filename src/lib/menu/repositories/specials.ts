import { specialCategories as mockSpecialCategories } from "@/src/data/specialCategories";
import { specialMenuItems as mockSpecialMenuItems } from "@/src/data/specialMenuItems";
import { createServerSupabaseClient } from "@/src/lib/supabase/server";
import { mapSpecialCategoryRow, mapSpecialMenuItemRow } from "./mappers";
import type { SpecialCategoryRecord, SpecialMenuItem } from "@/src/types/menu";

export async function getSpecialCategories(): Promise<SpecialCategoryRecord[]> {
  const supabase = createServerSupabaseClient();

  if (!supabase) {
    return mockSpecialCategories;
  }

  const { data, error } = await supabase
    .from("special_categories")
    .select("*")
    .order("sort_order");

  if (error || !data) {
    return mockSpecialCategories;
  }

  return data.map(mapSpecialCategoryRow);
}

export async function getSpecialMenuItems(): Promise<SpecialMenuItem[]> {
  const supabase = createServerSupabaseClient();

  if (!supabase) {
    return mockSpecialMenuItems;
  }

  const { data, error } = await supabase
    .from("special_menu_items")
    .select("*")
    .order("sort_order");

  if (error || !data) {
    return mockSpecialMenuItems;
  }

  return data.map(mapSpecialMenuItemRow);
}
