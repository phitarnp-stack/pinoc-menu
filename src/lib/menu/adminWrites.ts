"use client";

import { createBrowserSupabaseClient } from "@/src/lib/supabase/client";
import type { MenuItem, Product } from "@/src/types/menu";

type WriteMode = "create" | "edit";

export type AdminWriteResult = {
  source: "supabase" | "mock";
  warning?: string;
};

const mockWriteResult: AdminWriteResult = {
  source: "mock",
  warning:
    "Supabase is unavailable, so this change is only saved in local state for this session.",
};

const nullable = (value: string | undefined) => value || null;

const productRow = (product: Product) => ({
  id: product.id,
  slug: product.slug,
  name: product.name,
  product_type: product.productType,
  status: product.status,
  price: product.price,
  description: product.description,
  flavor_notes: product.flavorNotes,
  image_placeholder: product.imagePlaceholder,
  available_for: product.availableFor,
  origin: nullable(product.origin),
  region: nullable(product.region),
  producer: nullable(product.producer),
  altitude: nullable(product.altitude),
  variety: nullable(product.variety),
  process: nullable(product.process),
  roast_level: nullable(product.roastLevel),
  brew_recommendation: nullable(product.brewRecommendation),
  is_seasonal: Boolean(product.isSeasonal),
  available_from: nullable(product.availableFrom),
  available_until: nullable(product.availableUntil),
});

const menuItemRow = (item: MenuItem) => ({
  id: item.id,
  slug: item.slug,
  name: item.name,
  category_id: item.categoryId,
  price: item.price,
  description: item.description,
  flavor_notes: item.flavorNotes,
  recommended_for: item.recommendedFor,
  image_placeholder: item.imagePlaceholder,
  is_active: item.isActive,
  is_seasonal: Boolean(item.isSeasonal),
  available_from: nullable(item.availableFrom),
  available_until: nullable(item.availableUntil),
  sort_order: item.sortOrder,
});

const specialRow = (item: MenuItem) => ({
  id: `special-${item.id}`,
  menu_item_id: item.id,
  special_category: item.specialCategory ?? "coffee",
  is_featured: true,
  visibility: item.visibility ?? (item.isActive ? "visible" : "hidden"),
  menu_label: nullable(item.menuLabel),
  sort_order: item.sortOrder,
  available_from: nullable(item.availableFrom),
  available_until: nullable(item.availableUntil),
});

const formatSupabaseError = (
  action: string,
  error: { code?: string; message?: string; details?: string | null },
) =>
  `${action} failed${error.code ? ` (${error.code})` : ""}: ${
    error.message ?? "Unknown Supabase error"
  }${error.details ? ` ${error.details}` : ""}`;

export async function saveProduct(
  product: Product,
  mode: WriteMode,
): Promise<AdminWriteResult> {
  const supabase = createBrowserSupabaseClient();

  if (!supabase) {
    return mockWriteResult;
  }

  const query =
    mode === "create"
      ? supabase.from("products").insert(productRow(product))
      : supabase.from("products").update(productRow(product)).eq("id", product.id);

  const { error } = await query;

  if (error) {
    throw new Error(formatSupabaseError("Saving product", error));
  }

  return { source: "supabase" };
}

export async function updateProductStatus(
  productId: string,
  status: Product["status"],
): Promise<AdminWriteResult> {
  const supabase = createBrowserSupabaseClient();

  if (!supabase) {
    return mockWriteResult;
  }

  const { error } = await supabase
    .from("products")
    .update({ status })
    .eq("id", productId);

  if (error) {
    throw new Error(formatSupabaseError("Updating product status", error));
  }

  return { source: "supabase" };
}

const replaceMenuItemTasteProfiles = async (
  supabase: NonNullable<ReturnType<typeof createBrowserSupabaseClient>>,
  item: MenuItem,
) => {
  const deleteResult = await supabase
    .from("menu_item_taste_profiles")
    .delete()
    .eq("menu_item_id", item.id);

  if (deleteResult.error) {
    throw new Error(
      formatSupabaseError("Updating menu item taste profiles", deleteResult.error),
    );
  }

  if (item.tasteProfileIds.length === 0) {
    return;
  }

  const insertResult = await supabase.from("menu_item_taste_profiles").insert(
    item.tasteProfileIds.map((tasteProfileId) => ({
      menu_item_id: item.id,
      taste_profile_id: tasteProfileId,
      intensity: 3,
    })),
  );

  if (insertResult.error) {
    throw new Error(
      formatSupabaseError("Saving menu item taste profiles", insertResult.error),
    );
  }
};

const saveSpecialMapping = async (
  supabase: NonNullable<ReturnType<typeof createBrowserSupabaseClient>>,
  item: MenuItem,
) => {
  const existing = await supabase
    .from("specials")
    .select("id")
    .eq("menu_item_id", item.id)
    .maybeSingle();

  if (existing.error) {
    throw new Error(
      formatSupabaseError("Checking special menu mapping", existing.error),
    );
  }

  const row = specialRow(item);
  const result = existing.data
    ? await supabase.from("specials").update(row).eq("menu_item_id", item.id)
    : await supabase.from("specials").insert(row);

  if (result.error) {
    throw new Error(formatSupabaseError("Saving special menu mapping", result.error));
  }
};

export async function saveMenuItem(
  item: MenuItem,
  mode: WriteMode,
): Promise<AdminWriteResult> {
  const supabase = createBrowserSupabaseClient();

  if (!supabase) {
    return mockWriteResult;
  }

  const query =
    mode === "create"
      ? supabase.from("menu_items").insert(menuItemRow(item))
      : supabase.from("menu_items").update(menuItemRow(item)).eq("id", item.id);

  const { error } = await query;

  if (error) {
    throw new Error(formatSupabaseError("Saving menu item", error));
  }

  await replaceMenuItemTasteProfiles(supabase, item);

  if (item.categoryId === "special") {
    await saveSpecialMapping(supabase, item);
  }

  return { source: "supabase" };
}

export async function updateMenuItemStatus(
  item: MenuItem,
  isActive: boolean,
): Promise<AdminWriteResult> {
  const supabase = createBrowserSupabaseClient();

  if (!supabase) {
    return mockWriteResult;
  }

  const { error } = await supabase
    .from("menu_items")
    .update({ is_active: isActive })
    .eq("id", item.id);

  if (error) {
    throw new Error(formatSupabaseError("Updating menu item status", error));
  }

  if (item.categoryId === "special") {
    const visibility = isActive ? "visible" : "hidden";
    const specialResult = await supabase
      .from("specials")
      .update({ visibility })
      .eq("menu_item_id", item.id);

    if (specialResult.error) {
      throw new Error(
        formatSupabaseError("Updating special menu visibility", specialResult.error),
      );
    }
  }

  return { source: "supabase" };
}
