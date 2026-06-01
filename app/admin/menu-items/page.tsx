import { MenuItemCrudPage } from "@/src/components/admin/MenuItemCrudPage";
import { menuItems } from "@/src/data/menuItems";

export default function AdminMenuItemsPage() {
  return (
    <MenuItemCrudPage
      title="Menu Items"
      description="Manage customer-facing drinks, categories, taste profiles, prices, and active state with local mock data."
      initialItems={menuItems}
    />
  );
}
