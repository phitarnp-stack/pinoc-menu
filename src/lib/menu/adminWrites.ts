"use client";

import { createBrowserSupabaseClient } from "@/src/lib/supabase/client";
import type { MenuItem, Product } from "@/src/types/menu";

type WriteMode = "create" | "edit";
export type ProductMenuCategoryId =
  | "classic-coffee"
  | "filter-coffee"
  | "matcha"
  | "craft-cocoa"
  | "special";

export type AdminWriteResult = {
  source: "supabase" | "mock";
  warning?: string;
};

export type PublishProductResult = AdminWriteResult & {
  status: "created" | "existing";
  menuItemId: string;
  menuItemHref: string;
  categoryId: ProductMenuCategoryId;
  debug: {
    menuItemId: string;
    menuItemSlug: string;
    menuItemCategoryId: string;
    menuItemName: string;
    menuItemIsActive: boolean;
    menuItemStatus: "not_applicable";
    linkId?: string;
    linkMenuItemId?: string;
    linkProductId?: string;
    publicUrl: string;
  };
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

const menuItemProductRow = (
  menuItemId: string,
  productId: string,
  sortOrder = 1,
) => ({
  id: `mip-${menuItemId}-${productId}`,
  menu_item_id: menuItemId,
  product_id: productId,
  role: "base",
  is_default: true,
  is_active: true,
  sort_order: sortOrder,
  available_from: null,
  available_until: null,
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

const categorySlugById: Record<ProductMenuCategoryId, string> = {
  "classic-coffee": "classic-coffee",
  "filter-coffee": "filter-coffee",
  matcha: "matcha",
  "craft-cocoa": "craft-cocoa",
  special: "special",
};

const getDefaultProductMenuCategory = (
  product: Product,
  selectedCategoryId?: ProductMenuCategoryId,
): ProductMenuCategoryId => {
  if (product.productType === "craft_cocoa") {
    return "craft-cocoa";
  }

  if (product.productType === "matcha") {
    return "matcha";
  }

  if (selectedCategoryId) {
    return selectedCategoryId;
  }

  throw new Error("Choose a customer menu category before publishing this coffee bean.");
};

const buildMenuItemFromProduct = (
  product: Product,
  categoryId: ProductMenuCategoryId,
): MenuItem => ({
  id: `item-${product.slug}`,
  slug: product.slug,
  name: product.name,
  categoryId,
  price: product.price,
  description: product.description,
  flavorNotes: product.flavorNotes,
  tasteProfileIds: product.tasteProfileIds,
  recommendedFor:
    product.brewRecommendation ??
    product.availableFor ??
    "Guests exploring a specialty Pinoc product.",
  imagePlaceholder: product.imagePlaceholder,
  isActive: product.status === "active",
  isSeasonal: Boolean(product.isSeasonal),
  availableFrom: product.availableFrom,
  availableUntil: product.availableUntil,
  sortOrder: 1000,
});

const productMenuHref = (categoryId: ProductMenuCategoryId, slug: string) =>
  `/menu/${categorySlugById[categoryId]}/${slug}`;

const buildPublishDebug = ({
  menuItemId,
  menuItemSlug,
  menuItemCategoryId,
  menuItemName,
  menuItemIsActive,
  linkId,
  linkMenuItemId,
  linkProductId,
}: {
  menuItemId: string;
  menuItemSlug: string;
  menuItemCategoryId: string;
  menuItemName: string;
  menuItemIsActive: boolean;
  linkId?: string;
  linkMenuItemId?: string;
  linkProductId?: string;
}) => {
  const publicUrl = productMenuHref(
    menuItemCategoryId as ProductMenuCategoryId,
    menuItemSlug,
  );

  return {
    menuItemId,
    menuItemSlug,
    menuItemCategoryId,
    menuItemName,
    menuItemIsActive,
    menuItemStatus: "not_applicable" as const,
    linkId,
    linkMenuItemId,
    linkProductId,
    publicUrl,
  };
};

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

export async function publishProductToMenu(
  product: Product,
  selectedCategoryId?: ProductMenuCategoryId,
): Promise<PublishProductResult> {
  const categoryId = getDefaultProductMenuCategory(product, selectedCategoryId);
  const menuItem = buildMenuItemFromProduct(product, categoryId);
  const supabase = createBrowserSupabaseClient();

  if (!supabase) {
    return {
      ...mockWriteResult,
      status: "created",
      menuItemId: menuItem.id,
      menuItemHref: productMenuHref(categoryId, menuItem.slug),
      categoryId,
      debug: buildPublishDebug({
        menuItemId: menuItem.id,
        menuItemSlug: menuItem.slug,
        menuItemCategoryId: categoryId,
        menuItemName: menuItem.name,
        menuItemIsActive: menuItem.isActive,
        linkId: menuItemProductRow(menuItem.id, product.id).id,
        linkMenuItemId: menuItem.id,
        linkProductId: product.id,
      }),
    };
  }

  const existingLink = await supabase
    .from("menu_item_products")
    .select("id, menu_item_id, product_id")
    .eq("product_id", product.id)
    .eq("is_active", true)
    .limit(1);

  if (existingLink.error) {
    throw new Error(
      formatSupabaseError("Checking existing menu link", existingLink.error),
    );
  }

  const linkedMenuItemId = existingLink.data?.[0]?.menu_item_id;
  const linkedRow = existingLink.data?.[0];

  if (linkedMenuItemId) {
    const existingMenuItem = await supabase
      .from("menu_items")
      .select("id, slug, category_id, name, is_active")
      .eq("id", linkedMenuItemId)
      .maybeSingle();

    if (existingMenuItem.error) {
      throw new Error(
        formatSupabaseError("Loading existing menu item", existingMenuItem.error),
      );
    }

    if (existingMenuItem.data) {
      const existingCategoryId =
        existingMenuItem.data.category_id as ProductMenuCategoryId;

      return {
        source: "supabase",
        status: "existing",
        menuItemId: existingMenuItem.data.id,
        menuItemHref: productMenuHref(
          existingCategoryId,
          existingMenuItem.data.slug,
        ),
        categoryId: existingCategoryId,
        debug: buildPublishDebug({
          menuItemId: existingMenuItem.data.id,
          menuItemSlug: existingMenuItem.data.slug,
          menuItemCategoryId: existingMenuItem.data.category_id,
          menuItemName: existingMenuItem.data.name,
          menuItemIsActive: existingMenuItem.data.is_active,
          linkId: linkedRow?.id,
          linkMenuItemId: linkedRow?.menu_item_id,
          linkProductId: linkedRow?.product_id,
        }),
      };
    }
  }

  const existingSlug = await supabase
    .from("menu_items")
    .select("id, slug, category_id, name, is_active")
    .eq("category_id", categoryId)
    .eq("slug", menuItem.slug)
    .maybeSingle();

  if (existingSlug.error) {
    throw new Error(
      formatSupabaseError("Checking existing menu item", existingSlug.error),
    );
  }

  if (existingSlug.data) {
    const linkResult = await supabase
      .from("menu_item_products")
      .insert(menuItemProductRow(existingSlug.data.id, product.id))
      .select("id, menu_item_id, product_id")
      .maybeSingle();

    if (linkResult.error && linkResult.error.code !== "23505") {
      throw new Error(
        formatSupabaseError("Linking product to menu item", linkResult.error),
      );
    }

    const existingLinkAfterConflict = linkResult.error
      ? await supabase
          .from("menu_item_products")
          .select("id, menu_item_id, product_id")
          .eq("menu_item_id", existingSlug.data.id)
          .eq("product_id", product.id)
          .maybeSingle()
      : null;

    if (existingLinkAfterConflict?.error) {
      throw new Error(
        formatSupabaseError(
          "Loading existing product menu link",
          existingLinkAfterConflict.error,
        ),
      );
    }

    const linkData = linkResult.data ?? existingLinkAfterConflict?.data;

    return {
      source: "supabase",
      status: "existing",
      menuItemId: existingSlug.data.id,
      menuItemHref: productMenuHref(categoryId, existingSlug.data.slug),
      categoryId,
      debug: buildPublishDebug({
        menuItemId: existingSlug.data.id,
        menuItemSlug: existingSlug.data.slug,
        menuItemCategoryId: existingSlug.data.category_id,
        menuItemName: existingSlug.data.name,
        menuItemIsActive: existingSlug.data.is_active,
        linkId: linkData?.id,
        linkMenuItemId: linkData?.menu_item_id,
        linkProductId: linkData?.product_id,
      }),
    };
  }

  const menuItemResult = await supabase
    .from("menu_items")
    .insert(menuItemRow(menuItem))
    .select("id, slug, category_id, name, is_active")
    .single();

  if (menuItemResult.error) {
    throw new Error(formatSupabaseError("Creating menu item", menuItemResult.error));
  }

  const linkResult = await supabase
    .from("menu_item_products")
    .insert(menuItemProductRow(menuItem.id, product.id))
    .select("id, menu_item_id, product_id")
    .single();

  if (linkResult.error) {
    throw new Error(
      formatSupabaseError("Linking product to menu item", linkResult.error),
    );
  }

  if (menuItem.tasteProfileIds.length > 0) {
    await replaceMenuItemTasteProfiles(supabase, menuItem);
  }

  return {
    source: "supabase",
    status: "created",
    menuItemId: menuItem.id,
    menuItemHref: productMenuHref(categoryId, menuItem.slug),
    categoryId,
    debug: buildPublishDebug({
      menuItemId: menuItemResult.data.id,
      menuItemSlug: menuItemResult.data.slug,
      menuItemCategoryId: menuItemResult.data.category_id,
      menuItemName: menuItemResult.data.name,
      menuItemIsActive: menuItemResult.data.is_active,
      linkId: linkResult.data.id,
      linkMenuItemId: linkResult.data.menu_item_id,
      linkProductId: linkResult.data.product_id,
    }),
  };
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
