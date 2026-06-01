import { MenuItemCrudPage } from "@/src/components/admin/MenuItemCrudPage";
import { menuItems } from "@/src/data/menuItems";

const specialItems = menuItems.filter((item) => item.categoryId === "special");

export default function AdminSpecialsPage() {
  return (
    <MenuItemCrudPage
      title="Specials"
      description="Manage Special Menu items for Coffee, Non Coffee, and Cold Brew using local mock data."
      initialItems={specialItems}
      fixedCategoryId="special"
    />
  );
}
