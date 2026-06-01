import { menuItems } from "./menuItems";
import { specialMenuItems } from "./specialMenuItems";

export const specialProducts = specialMenuItems
  .map((specialMenuItem) =>
    menuItems.find((menuItem) => menuItem.id === specialMenuItem.menuItemId),
  )
  .filter((menuItem) => menuItem !== undefined);
