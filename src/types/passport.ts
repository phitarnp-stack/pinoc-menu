import type {
  ProductType,
  RecommendationAdventureLevel,
  RecommendationComfortLevel,
  RecommendationDrinkType,
  RecommendationFlavorPreference,
  RecommendationFeelingTag,
} from "./menu";

export type PassportSyncStatus = "local_only" | "ready_for_sync" | "synced";

export type PassportFlavorSource =
  | "flavor_note"
  | "taste_profile"
  | "recommendation_tag";

export type PassportBadgeId =
  | "first-origin"
  | "first-flavor"
  | "coffee-first-step"
  | "matcha-discovery"
  | "cocoa-discovery"
  | "special-explorer"
  | "discovery-journal";

export type PassportOriginSnapshot = {
  productId: string;
  productName: string;
  productType: ProductType;
  origin?: string;
  region?: string;
  producer?: string;
  variety?: string;
  process?: string;
};

export type PassportEntry = {
  id: string;
  menuItemId: string;
  productIds: string[];
  menuItemSlug: string;
  categoryId: string;
  categorySlug: string;
  categoryName: string;
  nameSnapshot: string;
  descriptionSnapshot: string;
  imageUrlSnapshot?: string;
  priceSnapshot: number;
  triedAt: string;
  note?: string;
  originSnapshots: PassportOriginSnapshot[];
  flavorNotes: string[];
  tasteProfileIds: string[];
  drinkType?: RecommendationDrinkType;
  feelingTags: RecommendationFeelingTag[];
  adventureLevel?: RecommendationAdventureLevel;
  bodyLevel?: number;
  comfortLevel?: RecommendationComfortLevel;
  intensityLevel?: number;
  flavorPreferences: RecommendationFlavorPreference[];
};

export type PassportOriginCollection = {
  key: string;
  origin?: string;
  region?: string;
  productIds: string[];
  entryIds: string[];
  firstCollectedAt: string;
  count: number;
};

export type PassportFlavorCollection = {
  key: string;
  label: string;
  source: PassportFlavorSource;
  entryIds: string[];
  firstCollectedAt: string;
  count: number;
};

export type PassportBadgeDefinition = {
  id: PassportBadgeId;
  name: string;
  description: string;
  lockedDescription: string;
};

export type PassportBadgeAward = {
  badgeId: PassportBadgeId;
  awardedAt: string;
  sourceEntryId?: string;
};

export type GuestPassport = {
  version: 1;
  guestId: string;
  createdAt: string;
  updatedAt: string;
  entries: PassportEntry[];
  badgeAwards: PassportBadgeAward[];
  sync: {
    status: PassportSyncStatus;
    lastSyncedAt?: string;
  };
};
