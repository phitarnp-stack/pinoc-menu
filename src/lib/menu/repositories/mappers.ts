import type {
  CustomerFavorite,
  CustomerTasting,
  MenuCategory,
  MenuItem,
  Product,
  ProductStatus,
  ProductType,
  RoastLevel,
  SpecialCategory,
  SpecialCategoryRecord,
  SpecialMenuItem,
  TasteProfile,
} from "@/src/types/menu";

type DbRecord = Record<string, unknown>;

const asString = (value: unknown, fallback = "") =>
  typeof value === "string" ? value : fallback;

const asNumber = (value: unknown, fallback = 0) => {
  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  return fallback;
};

const asBoolean = (value: unknown, fallback = false) =>
  typeof value === "boolean" ? value : fallback;

const asOptionalString = (value: unknown) =>
  typeof value === "string" && value.length > 0 ? value : undefined;

const asStringArray = (value: unknown) =>
  Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];

const relationIds = (row: DbRecord, relationKey: string, idKey: string) => {
  const relation = row[relationKey];

  if (!Array.isArray(relation)) {
    return [];
  }

  return relation
    .map((item) =>
      item && typeof item === "object"
        ? (item as Record<string, unknown>)[idKey]
        : undefined,
    )
    .filter((item): item is string => typeof item === "string");
};

export const mapProductRow = (row: DbRecord): Product => ({
  id: asString(row.id),
  slug: asString(row.slug),
  name: asString(row.name),
  productType: asString(row.product_type) as ProductType,
  status: asString(row.status, "inactive") as ProductStatus,
  price: asNumber(row.price),
  description: asString(row.description),
  flavorNotes: asStringArray(row.flavor_notes),
  tasteProfileIds: relationIds(
    row,
    "product_taste_profiles",
    "taste_profile_id",
  ),
  imagePlaceholder: asString(row.image_placeholder),
  availableFor: asString(row.available_for),
  origin: asOptionalString(row.origin),
  region: asOptionalString(row.region),
  producer: asOptionalString(row.producer),
  process: asOptionalString(row.process),
  roastLevel: asOptionalString(row.roast_level) as RoastLevel | undefined,
  isSeasonal: asBoolean(row.is_seasonal),
  availableFrom: asOptionalString(row.available_from),
  availableUntil: asOptionalString(row.available_until),
});

export const mapMenuCategoryRow = (row: DbRecord): MenuCategory => ({
  id: asString(row.id),
  slug: asString(row.slug),
  name: asString(row.name),
  description: asString(row.description),
  sortOrder: asNumber(row.sort_order),
  isActive: asBoolean(row.is_active),
});

export const mapMenuItemRow = (row: DbRecord): MenuItem => ({
  id: asString(row.id),
  slug: asString(row.slug),
  name: asString(row.name),
  categoryId: asString(row.category_id),
  price: asNumber(row.price),
  description: asString(row.description),
  flavorNotes: asStringArray(row.flavor_notes),
  tasteProfileIds: relationIds(
    row,
    "menu_item_taste_profiles",
    "taste_profile_id",
  ),
  recommendedFor: asString(row.recommended_for),
  imagePlaceholder: asString(row.image_placeholder),
  isActive: asBoolean(row.is_active),
  isSeasonal: asBoolean(row.is_seasonal),
  availableFrom: asOptionalString(row.available_from),
  availableUntil: asOptionalString(row.available_until),
  sortOrder: asNumber(row.sort_order),
});

export const mapSpecialCategoryRow = (
  row: DbRecord,
): SpecialCategoryRecord => ({
  id: asString(row.id),
  slug: asString(row.slug) as SpecialCategory,
  name: asString(row.name),
  description: asString(row.description),
  sortOrder: asNumber(row.sort_order),
  isActive: asBoolean(row.is_active),
});

export const mapSpecialMenuItemRow = (row: DbRecord): SpecialMenuItem => ({
  id: asString(row.id),
  menuItemId: asString(row.menu_item_id),
  specialCategoryId: asString(row.special_category_id),
  isFeatured: asBoolean(row.is_featured),
  sortOrder: asNumber(row.sort_order),
  availableFrom: asOptionalString(row.available_from),
  availableUntil: asOptionalString(row.available_until),
});

export const mapTasteProfileRow = (row: DbRecord): TasteProfile => ({
  id: asString(row.id),
  slug: asString(row.slug),
  name: asString(row.name),
  description: asString(row.description),
  sortOrder: asNumber(row.sort_order),
  isActive: asBoolean(row.is_active),
});

export const mapCustomerTastingRow = (row: DbRecord): CustomerTasting => ({
  id: asString(row.id),
  customerId: asString(row.customer_id),
  menuItemId: asOptionalString(row.menu_item_id),
  productId: asOptionalString(row.product_id),
  tastedAt: asString(row.tasted_at),
  rating: asNumber(row.rating),
  feelingTagIds: relationIds(
    row,
    "customer_tasting_feeling_tags",
    "feeling_tag_id",
  ),
  note: asOptionalString(row.note),
});

export const mapCustomerFavoriteRow = (row: DbRecord): CustomerFavorite => ({
  id: asString(row.id),
  customerId: asString(row.customer_id),
  menuItemId: asOptionalString(row.menu_item_id),
  productId: asOptionalString(row.product_id),
  createdAt: asString(row.created_at),
});
