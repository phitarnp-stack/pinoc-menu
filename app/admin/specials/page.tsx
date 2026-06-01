import { MenuItemCrudPage } from "@/src/components/admin/MenuItemCrudPage";
import {
  getMenuCategories,
  getMenuItems,
  getSpecialMenuItems,
  getTasteProfiles,
} from "@/src/lib/menu/repositories";
import type { SpecialCategory } from "@/src/types/menu";

export const dynamic = "force-dynamic";

export default async function AdminSpecialsPage() {
  const [menuItems, menuCategories, tasteProfiles, specialMappings] =
    await Promise.all([
    getMenuItems(),
    getMenuCategories(),
    getTasteProfiles(),
    getSpecialMenuItems(),
  ]);
  const specialItems = menuItems
    .filter((item) => item.categoryId === "special")
    .map((item) => {
      const mapping = specialMappings.find(
        (specialItem) => specialItem.menuItemId === item.id,
      );

      return {
        ...item,
        specialCategory:
          mapping?.specialCategory ?? ("coffee" as SpecialCategory),
        visibility: mapping?.visibility ?? (item.isActive ? "visible" : "hidden"),
        menuLabel: mapping?.menuLabel,
        availableFrom: mapping?.availableFrom ?? item.availableFrom,
        availableUntil: mapping?.availableUntil ?? item.availableUntil,
      };
    });

  return (
    <MenuItemCrudPage
      title="Specials"
      description="Manage Special Menu items for Coffee, Non Coffee, and Cold Brew using local mock data."
      initialItems={specialItems}
      menuCategories={menuCategories}
      tasteProfiles={tasteProfiles}
      fixedCategoryId="special"
    />
  );
}
