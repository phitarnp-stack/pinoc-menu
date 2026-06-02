import { MenuItemCrudPage } from "@/src/components/admin/MenuItemCrudPage";
import {
  getMenuCategories,
  getMenuItemProducts,
  getMenuItems,
  getProducts,
  getTasteProfiles,
} from "@/src/lib/menu/repositories";

export const dynamic = "force-dynamic";

export default async function AdminMenuItemsPage() {
  const [menuItems, menuCategories, tasteProfiles, products, menuItemProducts] =
    await Promise.all([
    getMenuItems(),
    getMenuCategories(),
    getTasteProfiles(),
    getProducts(),
    getMenuItemProducts(),
  ]);

  return (
    <MenuItemCrudPage
      title="Menu Items"
      description="Manage customer-facing drinks, categories, taste profiles, prices, and active state."
      initialItems={menuItems}
      initialMenuItemProducts={menuItemProducts}
      products={products}
      menuCategories={menuCategories}
      tasteProfiles={tasteProfiles}
    />
  );
}
