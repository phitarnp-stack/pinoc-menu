import { specialCategories as mockSpecialCategories } from "@/src/data/specialCategories";
import { specialMenuItems as mockSpecialMenuItems } from "@/src/data/specialMenuItems";
import { createServerSupabaseClient } from "@/src/lib/supabase/server";
import { mapSpecialMenuItemRow } from "./mappers";
import type { SpecialCategoryRecord, SpecialMenuItem } from "@/src/types/menu";

export async function getSpecialCategories(): Promise<SpecialCategoryRecord[]> {
  const supabase = createServerSupabaseClient();

  if (!supabase) {
    return mockSpecialCategories;
  }

  const { data, error } = await supabase
    .from("specials")
    .select("special_category");

  if (error || !data) {
    return mockSpecialCategories;
  }

  const activeSlugs = new Set(
    data
      .map((item) => item.special_category)
      .filter((slug): slug is string => typeof slug === "string"),
  );

  return mockSpecialCategories.filter((category) =>
    activeSlugs.has(category.slug),
  );
}

export async function getSpecialMenuItems(): Promise<SpecialMenuItem[]> {
  const supabase = createServerSupabaseClient();

  if (!supabase) {
    return mockSpecialMenuItems;
  }

  const { data, error } = await supabase
    .from("specials")
    .select("*")
    .order("sort_order");

  if (error || !data) {
    return mockSpecialMenuItems;
  }

  return data.map(mapSpecialMenuItemRow);
}
