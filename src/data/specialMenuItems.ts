import type { SpecialMenuItem } from "@/src/types/menu";

export const specialMenuItems: SpecialMenuItem[] = [
  {
    id: "smi-orange-tonic",
    menuItemId: "item-orange-espresso-tonic",
    specialCategoryId: "special-coffee",
    isFeatured: true,
    sortOrder: 1,
  },
  {
    id: "smi-matcha-cocoa-cloud",
    menuItemId: "item-matcha-cocoa-cloud",
    specialCategoryId: "special-non-coffee",
    isFeatured: true,
    sortOrder: 1,
  },
  {
    id: "smi-cacao-cold-brew",
    menuItemId: "item-cacao-cold-brew",
    specialCategoryId: "special-cold-brew",
    isFeatured: true,
    sortOrder: 1,
  },
];
