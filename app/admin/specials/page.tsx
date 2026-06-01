import { MenuItemCrudPage } from "@/src/components/admin/MenuItemCrudPage";
import {
  getMenuCategories,
  getMenuItems,
  getTasteProfiles,
} from "@/src/lib/menu/repositories";

export const dynamic = "force-dynamic";

export default async function AdminSpecialsPage() {
  const [menuItems, menuCategories, tasteProfiles] = await Promise.all([
    getMenuItems(),
    getMenuCategories(),
    getTasteProfiles(),
  ]);
  const specialItems = menuItems.filter((item) => item.categoryId === "special");

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
