import { menuItemProducts as mockMenuItemProducts } from "@/src/data/menuItemProducts";
import { createServerSupabaseClient } from "@/src/lib/supabase/server";
import { mapMenuItemProductRow } from "./mappers";
import type { MenuItemProduct } from "@/src/types/menu";

export async function getMenuItemProducts(): Promise<MenuItemProduct[]> {
  const supabase = createServerSupabaseClient();

  if (!supabase) {
    return mockMenuItemProducts;
  }

  const { data, error } = await supabase
    .from("menu_item_products")
    .select("*")
    .order("sort_order");

  if (error || !data) {
    return mockMenuItemProducts;
  }

  return data.map(mapMenuItemProductRow);
}

export async function getMenuItemProductsByMenuItemId(
  menuItemId: string,
): Promise<MenuItemProduct[]> {
  const mappings = await getMenuItemProducts();

  return mappings.filter(
    (mapping) => mapping.menuItemId === menuItemId && mapping.isActive,
  );
}
