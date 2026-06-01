import type {
  CustomerFavorite,
  CustomerProfile,
  CustomerTasteProfileScore,
  CustomerTasting,
  FeelingTag,
  MenuCategory,
  MenuItem,
  MenuItemProduct,
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

const specialCategoryIdBySlug: Record<SpecialCategory, string> = {
  coffee: "special-coffee",
  non_coffee: "special-non-coffee",
  cold_brew: "special-cold-brew",
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
  altitude: asOptionalString(row.altitude),
  variety: asOptionalString(row.variety),
  process: asOptionalString(row.process),
  roastLevel: asOptionalString(row.roast_level) as RoastLevel | undefined,
  brewRecommendation: asOptionalString(row.brew_recommendation),
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
  specialCategory: asOptionalString(row.special_category) as
    | SpecialCategory
    | undefined,
  visibility: asOptionalString(row.visibility) as
    | MenuItem["visibility"]
    | undefined,
  menuLabel: asOptionalString(row.menu_label) as MenuItem["menuLabel"],
  isSeasonal: asBoolean(row.is_seasonal),
  availableFrom: asOptionalString(row.available_from),
  availableUntil: asOptionalString(row.available_until),
  sortOrder: asNumber(row.sort_order),
});

export const mapMenuItemProductRow = (row: DbRecord): MenuItemProduct => ({
  id: asString(row.id),
  menuItemId: asString(row.menu_item_id),
  productId: asString(row.product_id),
  role: asString(row.role, "option") as MenuItemProduct["role"],
  isDefault: asBoolean(row.is_default),
  isActive: asBoolean(row.is_active),
  sortOrder: asNumber(row.sort_order),
  availableFrom: asOptionalString(row.available_from),
  availableUntil: asOptionalString(row.available_until),
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
  specialCategoryId:
    specialCategoryIdBySlug[asString(row.special_category) as SpecialCategory] ??
    asString(row.special_category_id),
  specialCategory: asOptionalString(row.special_category) as
    | SpecialCategory
    | undefined,
  isFeatured: asBoolean(row.is_featured),
  visibility: asString(row.visibility, "visible") as SpecialMenuItem["visibility"],
  menuLabel: asOptionalString(row.menu_label) as SpecialMenuItem["menuLabel"],
  sortOrder: asNumber(row.sort_order),
  availableFrom: asOptionalString(row.available_from),
  availableUntil: asOptionalString(row.available_until),
});

export const mapCustomerProfileRow = (row: DbRecord): CustomerProfile => ({
  id: asString(row.id),
  displayName: asString(row.display_name),
  avatarPlaceholder: asString(row.avatar_placeholder),
  memberSince: asString(row.member_since),
  preferredLoginMethod: asString(
    row.preferred_login_method,
    "line_liff_future",
  ) as CustomerProfile["preferredLoginMethod"],
});

export const mapFeelingTagRow = (row: DbRecord): FeelingTag => ({
  id: asString(row.id),
  slug: asString(row.slug),
  name: asString(row.name),
  sentiment: asString(row.sentiment, "neutral") as FeelingTag["sentiment"],
  description: asString(row.description),
  sortOrder: asNumber(row.sort_order),
  isActive: asBoolean(row.is_active),
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
    "tasting_history_feeling_tags",
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

export const mapCustomerTasteProfileScoreRow = (
  row: DbRecord,
): CustomerTasteProfileScore => ({
  id: asString(row.id),
  customerId: asString(row.customer_id),
  tasteProfileId: asString(row.taste_profile_id),
  score: asNumber(row.score),
  sampleCount: asNumber(row.sample_count),
  lastUpdatedAt: asString(row.last_updated_at),
});
