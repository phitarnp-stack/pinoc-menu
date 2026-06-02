"use client";

import { createBrowserSupabaseClient } from "@/src/lib/supabase/client";
import { mapMenuItemRow } from "@/src/lib/menu/repositories/mappers";
import type {
  HeroContent,
  MenuItem,
  Product,
  RecommendationDrinkType,
  RecommendationFlavorPreference,
  RecommendationFeelingTag,
} from "@/src/types/menu";

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
  menuItem?: MenuItem;
};

export type PublishProductResult = AdminWriteResult & {
  status: "created" | "existing";
  menuItemId: string;
  menuItemHref: string;
  categoryId: ProductMenuCategoryId;
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
  image_url: nullable(product.imageUrl),
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
  public_field_visibility: product.publicFieldVisibility ?? {},
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
  image_url: nullable(item.imageUrl),
  is_active: item.isActive,
  is_seasonal: Boolean(item.isSeasonal),
  available_from: nullable(item.availableFrom),
  available_until: nullable(item.availableUntil),
  public_field_visibility: item.publicFieldVisibility ?? {},
  drink_type: nullable(item.drinkType),
  feeling_tags: item.feelingTags ?? [],
  adventure_level: nullable(item.adventureLevel),
  body_level: item.bodyLevel ?? null,
  flavor_preferences: item.flavorPreferences ?? [],
  comfort_level: nullable(item.comfortLevel),
  intensity_level: item.intensityLevel ?? null,
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

const heroContentRow = (heroContent: HeroContent) => ({
  id: heroContent.id,
  title: heroContent.title,
  subtitle: heroContent.subtitle,
  image_url: nullable(heroContent.imageUrl),
  tasting_note: heroContent.tastingNote ?? "",
  cta_label: heroContent.ctaLabel ?? "Find Your Cup",
  cta_href: heroContent.ctaHref ?? "/find-your-cup",
  featured_product_id: nullable(heroContent.featuredProductId),
  featured_special_id: nullable(heroContent.featuredSpecialId),
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
  imageUrl: product.imageUrl,
  isActive: product.status === "active",
  isSeasonal: Boolean(product.isSeasonal),
  availableFrom: product.availableFrom,
  availableUntil: product.availableUntil,
  publicFieldVisibility: product.publicFieldVisibility,
  drinkType: inferDrinkType(product, categoryId),
  feelingTags: inferFeelingTags(product),
  adventureLevel: product.isSeasonal ? "curious" : "familiar",
  bodyLevel: inferBodyLevel(product),
  flavorPreferences: inferFlavorPreferences(product),
  comfortLevel: product.isSeasonal ? "something_new" : "comfort_zone",
  intensityLevel: inferBodyLevel(product),
  sortOrder: 1000,
});

const inferDrinkType = (
  product: Product,
  categoryId: ProductMenuCategoryId,
): RecommendationDrinkType => {
  if (product.productType === "matcha") {
    return "matcha";
  }

  if (product.productType === "craft_cocoa") {
    return "craft_cocoa";
  }

  if (categoryId === "classic-coffee") {
    return product.availableFor.toLowerCase().includes("latte")
      ? "milk_coffee"
      : "coffee";
  }

  if (categoryId === "special") {
    return "coffee";
  }

  return "coffee";
};

const inferFeelingTags = (product: Product): RecommendationFeelingTag[] => {
  const text = [product.name, product.description, ...product.flavorNotes]
    .join(" ")
    .toLowerCase();
  const tags: RecommendationFeelingTag[] = [];

  if (/citrus|jasmine|tea|mandarin|refresh/.test(text)) {
    tags.push("light_refreshing");
  }

  if (/fruit|strawberry|peach|apple|orange|juicy/.test(text)) {
    tags.push("bright_fruity");
  }

  if (/cocoa|cacao|chocolate|molasses|malt/.test(text)) {
    tags.push("deep_chocolatey");
  }

  if (/cream|creamy|latte|milk|velvet/.test(text)) {
    tags.push("creamy_smooth");
  }

  if (/washed|clean|floral|delicate/.test(text)) {
    tags.push("clean_delicate");
  }

  if (/bold|intense|dark|espresso/.test(text)) {
    tags.push("bold_intense");
  }

  return tags.length > 0 ? tags : ["clean_delicate"];
};

const inferBodyLevel = (product: Product) => {
  if (product.roastLevel === "Medium-Dark") {
    return 4;
  }

  if (product.productType === "craft_cocoa") {
    return 4;
  }

  if (product.roastLevel === "Light") {
    return 2;
  }

  return 3;
};

const inferFlavorPreferences = (
  product: Product,
): RecommendationFlavorPreference[] => {
  const text = [product.name, product.description, ...product.flavorNotes]
    .join(" ")
    .toLowerCase();
  const preferences: RecommendationFlavorPreference[] = [];

  if (/fruit|strawberry|peach|apple|cherry|juicy/.test(text)) {
    preferences.push("fruity");
  }

  if (/citrus|orange|mandarin|lemon|grapefruit/.test(text)) {
    preferences.push("citrus");
  }

  if (/floral|jasmine|blossom|rose|geisha/.test(text)) {
    preferences.push("floral");
  }

  if (/cocoa|cacao|chocolate|malt|molasses/.test(text)) {
    preferences.push("chocolatey");
  }

  if (/nut|almond|hazelnut|macadamia/.test(text)) {
    preferences.push("nutty");
  }

  if (/honey|caramel|sweet|cream|smooth|vanilla/.test(text)) {
    preferences.push("sweet_smooth");
  }

  return preferences.length > 0 ? preferences : ["sweet_smooth"];
};

const productMenuHref = (categoryId: ProductMenuCategoryId, slug: string) =>
  `/menu/${categorySlugById[categoryId]}/${slug}`;

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
    };
  }

  const existingLink = await supabase
    .from("menu_item_products")
    .select("menu_item_id")
    .eq("product_id", product.id)
    .eq("is_active", true)
    .limit(1);

  if (existingLink.error) {
    throw new Error(
      formatSupabaseError("Checking existing menu link", existingLink.error),
    );
  }

  const linkedMenuItemId = existingLink.data?.[0]?.menu_item_id;

  if (linkedMenuItemId) {
    const existingMenuItem = await supabase
      .from("menu_items")
      .select("id, slug, category_id")
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
      };
    }
  }

  const existingSlug = await supabase
    .from("menu_items")
    .select("id, slug, category_id")
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
      .insert(menuItemProductRow(existingSlug.data.id, product.id));

    if (linkResult.error && linkResult.error.code !== "23505") {
      throw new Error(
        formatSupabaseError("Linking product to menu item", linkResult.error),
      );
    }

    return {
      source: "supabase",
      status: "existing",
      menuItemId: existingSlug.data.id,
      menuItemHref: productMenuHref(categoryId, existingSlug.data.slug),
      categoryId,
    };
  }

  const menuItemResult = await supabase
    .from("menu_items")
    .insert(menuItemRow(menuItem));

  if (menuItemResult.error) {
    throw new Error(formatSupabaseError("Creating menu item", menuItemResult.error));
  }

  const linkResult = await supabase
    .from("menu_item_products")
    .insert(menuItemProductRow(menuItem.id, product.id));

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

const loadSavedMenuItem = async (
  supabase: NonNullable<ReturnType<typeof createBrowserSupabaseClient>>,
  item: MenuItem,
) => {
  const result = await supabase
    .from("menu_items")
    .select("*, menu_item_taste_profiles(taste_profile_id)")
    .eq("id", item.id)
    .maybeSingle();

  if (result.error) {
    throw new Error(
      formatSupabaseError("Loading saved menu item", result.error),
    );
  }

  if (!result.data) {
    throw new Error(
      `Saving menu item failed: Supabase did not return a row for id "${item.id}".`,
    );
  }

  return {
    ...mapMenuItemRow(result.data),
    specialCategory: item.specialCategory,
    visibility: item.visibility,
    menuLabel: item.menuLabel,
  };
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

  const row = menuItemRow(item);
  const query =
    mode === "create"
      ? supabase.from("menu_items").insert(row).select("id").single()
      : supabase
          .from("menu_items")
          .update(row)
          .eq("id", item.id)
          .select("id")
          .maybeSingle();

  const result = await query;

  if (result.error) {
    throw new Error(formatSupabaseError("Saving menu item", result.error));
  }

  if (!result.data) {
    throw new Error(
      `Saving menu item failed: no Supabase row matched id "${item.id}".`,
    );
  }

  await replaceMenuItemTasteProfiles(supabase, item);

  if (item.categoryId === "special") {
    await saveSpecialMapping(supabase, item);
  }

  return {
    source: "supabase",
    menuItem: await loadSavedMenuItem(supabase, item),
  };
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

export async function saveHeroContent(
  heroContent: HeroContent,
): Promise<AdminWriteResult> {
  const supabase = createBrowserSupabaseClient();

  if (!supabase) {
    return mockWriteResult;
  }

  const { error } = await supabase
    .from("hero_content")
    .upsert(heroContentRow(heroContent), { onConflict: "id" });

  if (error) {
    throw new Error(formatSupabaseError("Saving hero content", error));
  }

  return { source: "supabase" };
}
