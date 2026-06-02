import type {
  CustomerFavorite,
  CustomerProfile,
  CustomerTasteProfileScore,
  CustomerTasting,
  FeelingTag,
  HeroContent,
  HeroContentMode,
  MenuCategory,
  MenuItem,
  MenuItemProduct,
  Product,
  ProductStatus,
  ProductType,
  PublicFieldVisibility,
  OverlayField,
  RecommendationAdventureLevel,
  RecommendationComfortLevel,
  RecommendationDrinkType,
  RecommendationFlavorPreference,
  RecommendationFeelingTag,
  RoastLevel,
  SpecialCategory,
  SpecialCategoryRecord,
  SpecialMenuItem,
  StoryStatus,
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

const asOptionalNumber = (value: unknown) => {
  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);

    return Number.isFinite(parsed) ? parsed : undefined;
  }

  return undefined;
};

const asBoolean = (value: unknown, fallback = false) =>
  typeof value === "boolean" ? value : fallback;

const asOptionalString = (value: unknown) =>
  typeof value === "string" && value.length > 0 ? value : undefined;

const asStringArray = (value: unknown) =>
  Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];

const asOverlayFields = (value: unknown): OverlayField[] =>
  asStringArray(value).filter((item): item is OverlayField =>
    [
      "name",
      "taste_note",
      "description",
      "story_title",
      "story_description",
      "price",
    ].includes(item),
  );

const asPublicFieldVisibility = (
  value: unknown,
): PublicFieldVisibility | undefined =>
  value && typeof value === "object" && !Array.isArray(value)
    ? (value as PublicFieldVisibility)
    : undefined;

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
  imageUrl: asOptionalString(row.image_url),
  availableFor: asString(row.available_for),
  origin: asOptionalString(row.origin),
  region: asOptionalString(row.region),
  producer: asOptionalString(row.producer),
  batchNumber: asOptionalString(row.batch_number),
  season: asOptionalString(row.season),
  percent: asOptionalString(row.percent),
  altitude: asOptionalString(row.altitude),
  variety: asOptionalString(row.variety),
  process: asOptionalString(row.process),
  roastLevel: asOptionalString(row.roast_level) as RoastLevel | undefined,
  brewRecommendation: asOptionalString(row.brew_recommendation),
  isSeasonal: asBoolean(row.is_seasonal),
  availableFrom: asOptionalString(row.available_from),
  availableUntil: asOptionalString(row.available_until),
  publicFieldVisibility: asPublicFieldVisibility(row.public_field_visibility),
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
  imageUrl: asOptionalString(row.image_url),
  heroContentMode: asString(
    row.hero_content_mode,
    "image_with_menu_info",
  ) as HeroContentMode,
  customOverlayTitle: asOptionalString(row.custom_overlay_title),
  customOverlayText: asOptionalString(row.custom_overlay_text),
  overlayFields: asOverlayFields(row.overlay_fields),
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
  publicFieldVisibility: asPublicFieldVisibility(row.public_field_visibility),
  drinkType: asOptionalString(row.drink_type) as
    | RecommendationDrinkType
    | undefined,
  feelingTags: asStringArray(row.feeling_tags) as RecommendationFeelingTag[],
  adventureLevel: asOptionalString(row.adventure_level) as
    | RecommendationAdventureLevel
    | undefined,
  bodyLevel: asOptionalNumber(row.body_level),
  flavorPreferences: asStringArray(
    row.flavor_preferences,
  ) as RecommendationFlavorPreference[],
  comfortLevel: asOptionalString(row.comfort_level) as
    | RecommendationComfortLevel
    | undefined,
  intensityLevel: asOptionalNumber(row.intensity_level),
  storyStatus: asString(row.story_status, "default") as StoryStatus,
  storyTitle: asOptionalString(row.story_title),
  storyDescription: asOptionalString(row.story_description),
  servingRitual: asOptionalString(row.serving_ritual),
  whyWeCreatedIt: asOptionalString(row.why_we_created_it),
  bestFor: asStringArray(row.best_for),
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

export const mapHeroContentRow = (row: DbRecord): HeroContent => ({
  id: asString(row.id, "home"),
  title: asString(row.title),
  subtitle: asString(row.subtitle),
  imageUrl: asOptionalString(row.image_url),
  heroContentMode: asString(
    row.hero_content_mode,
    "image_with_menu_info",
  ) as HeroContentMode,
  customOverlayTitle: asOptionalString(row.custom_overlay_title),
  customOverlayText: asOptionalString(row.custom_overlay_text),
  overlayFields: asOverlayFields(row.overlay_fields),
  tastingNote: asOptionalString(row.tasting_note),
  ctaLabel: asOptionalString(row.cta_label),
  ctaHref: asOptionalString(row.cta_href),
  featuredProductId: asOptionalString(row.featured_product_id),
  featuredSpecialId: asOptionalString(row.featured_special_id),
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
