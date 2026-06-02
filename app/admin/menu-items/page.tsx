import { MenuItemCrudPage } from "@/src/components/admin/MenuItemCrudPage";
import {
  getMenuCategories,
  getMenuItems,
  getTasteProfiles,
} from "@/src/lib/menu/repositories";

export const dynamic = "force-dynamic";

export default async function AdminMenuItemsPage() {
  const [menuItems, menuCategories, tasteProfiles] = await Promise.all([
    getMenuItems(),
    getMenuCategories(),
    getTasteProfiles(),
  ]);

  return (
    <MenuItemCrudPage
      title="Menu Items"
      description="Manage customer-facing drinks, categories, taste profiles, prices, and active state."
      initialItems={menuItems}
      menuCategories={menuCategories}
      tasteProfiles={tasteProfiles}
    />
  );
}
