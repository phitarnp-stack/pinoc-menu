import type {
  CustomerFavorite,
  CustomerProfile,
  CustomerTasteProfileScore,
  CustomerTasting,
  FeelingTag,
} from "@/src/types/menu";

export const mockCustomerProfile: CustomerProfile = {
  id: "customer-pinoc-demo",
  displayName: "Pinoc Member",
  avatarPlaceholder: "Warm profile circle with coffee cream tones",
  memberSince: "2026-05-18",
  preferredLoginMethod: "mock",
};

export const feelingTags: FeelingTag[] = [
  {
    id: "liked",
    slug: "liked",
    name: "Liked",
    sentiment: "positive",
    description: "A cup the member enjoyed and may want again.",
    sortOrder: 1,
    isActive: true,
  },
  {
    id: "too-sweet",
    slug: "too-sweet",
    name: "Too Sweet",
    sentiment: "negative",
    description: "Sweeter than the member prefers.",
    sortOrder: 2,
    isActive: true,
  },
  {
    id: "too-acidic",
    slug: "too-acidic",
    name: "Too Acidic",
    sentiment: "negative",
    description: "Acidity felt sharper than expected.",
    sortOrder: 3,
    isActive: true,
  },
  {
    id: "refreshing",
    slug: "refreshing",
    name: "Refreshing",
    sentiment: "positive",
    description: "Clean, bright, cooling, or sparkling.",
    sortOrder: 4,
    isActive: true,
  },
  {
    id: "creamy",
    slug: "creamy",
    name: "Creamy",
    sentiment: "positive",
    description: "Soft texture and rounded body.",
    sortOrder: 5,
    isActive: true,
  },
  {
    id: "want-again",
    slug: "want-again",
    name: "Want Again",
    sentiment: "positive",
    description: "Strong repeat signal for recommendations.",
    sortOrder: 6,
    isActive: true,
  },
];

export const customerTastings: CustomerTasting[] = [
  {
    id: "tasting-americano-001",
    customerId: mockCustomerProfile.id,
    menuItemId: "item-americano",
    tastedAt: "2026-05-24T09:30:00.000Z",
    rating: 4,
    feelingTagIds: ["liked", "want-again"],
    note: "Loved the cacao finish with the House Classic profile.",
  },
  {
    id: "tasting-guji-001",
    customerId: mockCustomerProfile.id,
    menuItemId: "item-ethiopia-guji-natural",
    productId: "product-ethiopia-guji-natural",
    tastedAt: "2026-05-28T11:15:00.000Z",
    rating: 5,
    feelingTagIds: ["liked", "refreshing", "want-again"],
    note: "Very aromatic and juicy, especially as it cooled.",
  },
  {
    id: "tasting-matcha-latte-001",
    customerId: mockCustomerProfile.id,
    menuItemId: "item-matcha-latte",
    tastedAt: "2026-05-30T14:45:00.000Z",
    rating: 4,
    feelingTagIds: ["creamy", "liked"],
    note: "Smooth, not too bitter.",
  },
];

export const customerFavorites: CustomerFavorite[] = [
  {
    id: "favorite-americano",
    customerId: mockCustomerProfile.id,
    menuItemId: "item-americano",
    createdAt: "2026-05-24T09:35:00.000Z",
  },
  {
    id: "favorite-guji",
    customerId: mockCustomerProfile.id,
    menuItemId: "item-ethiopia-guji-natural",
    productId: "product-ethiopia-guji-natural",
    createdAt: "2026-05-28T11:18:00.000Z",
  },
];

export const customerTasteProfileScores: CustomerTasteProfileScore[] = [
  {
    id: "score-chocolate",
    customerId: mockCustomerProfile.id,
    tasteProfileId: "chocolate",
    score: 82,
    sampleCount: 4,
    lastUpdatedAt: "2026-05-30T15:00:00.000Z",
  },
  {
    id: "score-refreshing",
    customerId: mockCustomerProfile.id,
    tasteProfileId: "refreshing",
    score: 76,
    sampleCount: 3,
    lastUpdatedAt: "2026-05-30T15:00:00.000Z",
  },
  {
    id: "score-creamy",
    customerId: mockCustomerProfile.id,
    tasteProfileId: "creamy",
    score: 71,
    sampleCount: 3,
    lastUpdatedAt: "2026-05-30T15:00:00.000Z",
  },
  {
    id: "score-floral",
    customerId: mockCustomerProfile.id,
    tasteProfileId: "floral",
    score: 64,
    sampleCount: 2,
    lastUpdatedAt: "2026-05-30T15:00:00.000Z",
  },
];
