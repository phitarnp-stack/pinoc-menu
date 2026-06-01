import type { SpecialCategoryRecord } from "@/src/types/menu";

export const specialCategories: SpecialCategoryRecord[] = [
  {
    id: "special-coffee",
    slug: "coffee",
    name: "Coffee",
    description: "Espresso-led signatures with seasonal brightness and depth.",
    sortOrder: 1,
    isActive: true,
  },
  {
    id: "special-non-coffee",
    slug: "non_coffee",
    name: "Non Coffee",
    description: "Layered matcha, cocoa, and cream-forward seasonal creations.",
    sortOrder: 2,
    isActive: true,
  },
  {
    id: "special-cold-brew",
    slug: "cold_brew",
    name: "Cold Brew",
    description: "Slow extraction, low acidity, and polished chilled profiles.",
    sortOrder: 3,
    isActive: true,
  },
];
