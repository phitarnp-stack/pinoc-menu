import { menuCategories as mockMenuCategories } from "@/src/data/menuCategories";
import { createServerSupabaseClient } from "@/src/lib/supabase/server";
import { mapMenuCategoryRow } from "./mappers";
import type { MenuCategory } from "@/src/types/menu";

export async function getMenuCategories(): Promise<MenuCategory[]> {
  const supabase = createServerSupabaseClient();

  if (!supabase) {
    return mockMenuCategories;
  }

  const { data, error } = await supabase
    .from("menu_categories")
    .select("*")
    .order("sort_order");

  if (error || !data) {
    return mockMenuCategories;
  }

  return data.map(mapMenuCategoryRow);
}
