import type { MenuCategory } from "@/src/types/menu";

export const menuCategories: MenuCategory[] = [
  {
    id: "classic-coffee",
    slug: "classic-coffee",
    name: "Classic Coffee",
    description:
      "Espresso-based signatures built around balance, texture, and a refined specialty finish.",
    sortOrder: 1,
    isActive: true,
  },
  {
    id: "filter-coffee",
    slug: "filter-coffee",
    name: "Filter Coffee",
    description:
      "Rotating seasonal beans brewed for clarity, aroma, and origin character.",
    sortOrder: 2,
    isActive: true,
  },
  {
    id: "matcha",
    slug: "matcha",
    name: "Matcha",
    description:
      "Ceremonial green tea prepared for calm sweetness, umami, and a creamy finish.",
    sortOrder: 3,
    isActive: true,
  },
  {
    id: "craft-cocoa",
    slug: "craft-cocoa",
    name: "Craft Cocoa",
    description:
      "Premium cocoa drinks with origin depth, velvet body, and polished sweetness.",
    sortOrder: 4,
    isActive: true,
  },
  {
    id: "special",
    slug: "special",
    name: "Special",
    description:
      "Seasonal signatures across coffee, non-coffee, and cold brew expressions.",
    sortOrder: 5,
    isActive: true,
  },
];
