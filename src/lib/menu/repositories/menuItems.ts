import { menuItems as mockMenuItems } from "@/src/data/menuItems";
import { createServerSupabaseClient } from "@/src/lib/supabase/server";
import { mapMenuItemRow } from "./mappers";
import type { MenuItem } from "@/src/types/menu";

export async function getMenuItems(): Promise<MenuItem[]> {
  const supabase = createServerSupabaseClient();

  if (!supabase) {
    return mockMenuItems;
  }

  const { data, error } = await supabase
    .from("menu_items")
    .select("*, menu_item_taste_profiles(taste_profile_id)")
    .order("sort_order");

  if (error || !data) {
    return mockMenuItems;
  }

  return data.map(mapMenuItemRow);
}

export async function getMenuItemsByCategory(
  categoryId: string,
): Promise<MenuItem[]> {
  const menuItems = await getMenuItems();

  return menuItems.filter(
    (menuItem) => menuItem.categoryId === categoryId && menuItem.isActive,
  );
}

export async function getMenuItemBySlug(
  categoryId: string,
  slug: string,
): Promise<MenuItem | undefined> {
  const menuItems = await getMenuItems();

  return menuItems.find(
    (menuItem) =>
      menuItem.categoryId === categoryId && menuItem.slug === slug && menuItem.isActive,
  );
}
