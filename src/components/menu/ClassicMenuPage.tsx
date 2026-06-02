import { ClassicDrinkGroup } from "./ClassicDrinkGroup";
import { HouseBlendStrip } from "./HouseBlendStrip";
import type {
  ClassicGroup as ClassicGroupId,
  MenuItem,
  MenuItemProduct,
  Product,
} from "@/src/types/menu";

type ClassicMenuPageProps = {
  items: MenuItem[];
  menuItemProducts: MenuItemProduct[];
  products: Product[];
};

type ClassicGroup = {
  id: string;
  classicGroup: ClassicGroupId;
  title: string;
};

const classicGroups: ClassicGroup[] = [
  {
    id: "black-coffee",
    title: "Black Coffee",
    classicGroup: "black_coffee",
  },
  {
    id: "milk-coffee",
    title: "Milk Coffee",
    classicGroup: "milk_coffee",
  },
  {
    id: "juice-with-coffee",
    title: "Juice w/ Coffee",
    classicGroup: "juice_with_coffee",
  },
];

const sortByMapping = (mappings: MenuItemProduct[]) =>
  [...mappings].sort((left, right) => {
    if (left.isDefault !== right.isDefault) {
      return left.isDefault ? -1 : 1;
    }

    return left.sortOrder - right.sortOrder;
  });

export function ClassicMenuPage({
  items,
  menuItemProducts,
  products,
}: ClassicMenuPageProps) {
  const activeCoffeeBeans = products.filter(
    (product) =>
      product.productType === "coffee_bean" && product.status === "active",
  );
  const houseBlends = activeCoffeeBeans
    .filter((product) => product.isHouseBlend)
    .sort(
      (left, right) =>
        (left.houseBlendOrder ?? 9999) - (right.houseBlendOrder ?? 9999) ||
        left.name.localeCompare(right.name),
    );
  const productById = new Map(products.map((product) => [product.id, product]));
  const beanOptionsByItemId = new Map<string, Product[]>(
    items.map((item) => {
      const mappings = sortByMapping(
        menuItemProducts.filter(
          (mapping) => mapping.menuItemId === item.id && mapping.isActive,
        ),
      );
      const beanOptions = mappings
        .map((mapping) => productById.get(mapping.productId))
        .filter(
          (product): product is Product =>
            product !== undefined &&
            product.productType === "coffee_bean" &&
            product.status === "active",
        );

      return [item.id, beanOptions];
    }),
  );
  const groups = classicGroups.map((group) => {
    const groupItems = items
      .filter((item) => item.classicGroup === group.classicGroup)
      .sort((left, right) => left.sortOrder - right.sortOrder);

    return {
      ...group,
      items: groupItems,
    };
  });

  return (
    <div className="grid gap-5">
      <HouseBlendStrip houseBlends={houseBlends} />

      <div className="grid gap-5">
        {groups.map((group) => (
          <ClassicDrinkGroup
            key={group.id}
            beanOptionsByItemId={beanOptionsByItemId}
            items={group.items}
            title={group.title}
          />
        ))}

      </div>
    </div>
  );
}
