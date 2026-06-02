export type ProductType = "coffee_bean" | "matcha" | "craft_cocoa";

export type ProductStatus = "active" | "inactive";

export type SpecialCategory = "coffee" | "non_coffee" | "cold_brew";

export type RoastLevel = "Light" | "Medium-Light" | "Medium" | "Medium-Dark";

export type VisibilityStatus = "visible" | "hidden";

export type MenuLabel = "new" | "seasonal" | "limited";

export type RecommendationDrinkType =
  | "coffee"
  | "milk_coffee"
  | "matcha"
  | "craft_cocoa"
  | "non_coffee"
  | "cold_brew";

export type RecommendationFeelingTag =
  | "light_refreshing"
  | "bright_fruity"
  | "deep_chocolatey"
  | "creamy_smooth"
  | "clean_delicate"
  | "bold_intense";

export type RecommendationAdventureLevel =
  | "familiar"
  | "curious"
  | "adventurous";

export type PublicFieldVisibility = {
  origin?: boolean;
  producer?: boolean;
  region?: boolean;
  altitude?: boolean;
  variety?: boolean;
  process?: boolean;
  roastLevel?: boolean;
  brewRecommendation?: boolean;
  availableFor?: boolean;
  seasonalAvailability?: boolean;
};

export interface TasteProfile {
  id: string;
  slug: string;
  name: string;
  description: string;
  sortOrder: number;
  isActive: boolean;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  productType: ProductType;
  status: ProductStatus;
  price: number;
  description: string;
  flavorNotes: string[];
  tasteProfileIds: string[];
  imagePlaceholder: string;
  imageUrl?: string;
  availableFor: string;
  origin?: string;
  region?: string;
  producer?: string;
  altitude?: string;
  variety?: string;
  process?: string;
  roastLevel?: RoastLevel;
  brewRecommendation?: string;
  isSeasonal?: boolean;
  availableFrom?: string;
  availableUntil?: string;
  publicFieldVisibility?: PublicFieldVisibility;
}

export interface MenuCategory {
  id: string;
  slug: string;
  name: string;
  description: string;
  sortOrder: number;
  isActive: boolean;
}

export interface MenuItem {
  id: string;
  slug: string;
  name: string;
  categoryId: string;
  price: number;
  description: string;
  flavorNotes: string[];
  tasteProfileIds: string[];
  recommendedFor: string;
  imagePlaceholder: string;
  imageUrl?: string;
  isActive: boolean;
  specialCategory?: SpecialCategory;
  visibility?: VisibilityStatus;
  menuLabel?: MenuLabel;
  isSeasonal?: boolean;
  availableFrom?: string;
  availableUntil?: string;
  publicFieldVisibility?: PublicFieldVisibility;
  drinkType?: RecommendationDrinkType;
  feelingTags?: RecommendationFeelingTag[];
  adventureLevel?: RecommendationAdventureLevel;
  bodyLevel?: number;
  sortOrder: number;
}

export interface HeroContent {
  id: string;
  title: string;
  subtitle: string;
  imageUrl?: string;
  featuredProductId?: string;
  featuredSpecialId?: string;
}

export interface MenuItemProduct {
  id: string;
  menuItemId: string;
  productId: string;
  role: "default" | "option" | "base" | "seasonal_option";
  isDefault: boolean;
  isActive: boolean;
  sortOrder: number;
  availableFrom?: string;
  availableUntil?: string;
}

export interface SpecialCategoryRecord {
  id: string;
  slug: SpecialCategory;
  name: string;
  description: string;
  sortOrder: number;
  isActive: boolean;
}

export interface SpecialMenuItem {
  id: string;
  menuItemId: string;
  specialCategoryId: string;
  specialCategory?: SpecialCategory;
  isFeatured: boolean;
  visibility?: VisibilityStatus;
  menuLabel?: MenuLabel;
  sortOrder: number;
  availableFrom?: string;
  availableUntil?: string;
}

export interface CustomerProfile {
  id: string;
  displayName: string;
  avatarPlaceholder: string;
  memberSince: string;
  preferredLoginMethod: "line_liff_future" | "mock";
}

export interface FeelingTag {
  id: string;
  slug: string;
  name: string;
  sentiment: "positive" | "neutral" | "negative";
  description: string;
  sortOrder: number;
  isActive: boolean;
}

export interface CustomerTasting {
  id: string;
  customerId: string;
  menuItemId?: string;
  productId?: string;
  tastedAt: string;
  rating: number;
  feelingTagIds: string[];
  note?: string;
}

export interface CustomerFavorite {
  id: string;
  customerId: string;
  menuItemId?: string;
  productId?: string;
  createdAt: string;
}

export interface CustomerTasteProfileScore {
  id: string;
  customerId: string;
  tasteProfileId: string;
  score: number;
  sampleCount: number;
  lastUpdatedAt: string;
}
