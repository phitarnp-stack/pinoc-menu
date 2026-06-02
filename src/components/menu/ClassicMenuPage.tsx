import { ClassicDrinkGroup } from "./ClassicDrinkGroup";
import { HouseBlendStrip } from "./HouseBlendStrip";
import type { MenuItem, MenuItemProduct, Product } from "@/src/types/menu";

type ClassicMenuPageProps = {
  items: MenuItem[];
  menuItemProducts: MenuItemProduct[];
  products: Product[];
};

type ClassicGroup = {
  id: string;
  itemNames: string[];
  title: string;
};

const classicGroups: ClassicGroup[] = [
  {
    id: "black-coffee",
    title: "Black Coffee",
    itemNames: ["Espresso", "Americano", "Long Black"],
  },
  {
    id: "milk-coffee",
    title: "Milk Coffee",
    itemNames: [
      "Latte",
      "Chewy Latte",
      "Cappuccino",
      "Mocha",
      "Espresso Yen",
      "Dirty",
    ],
  },
  {
    id: "juice-with-coffee",
    title: "Juice w/ Coffee",
    itemNames: ["Sunday Morning", "Tamarino", "Tarn Koo"],
  },
];

const normalizeName = (name: string) => name.trim().toLowerCase();

const isHouseBlend = (product: Product) =>
  product.productType === "coffee_bean" &&
  product.status === "active" &&
  (product.name.toLowerCase().includes("house") ||
    product.producer?.toLowerCase().includes("house blend"));

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
    .filter(isHouseBlend)
    .sort((left, right) => left.name.localeCompare(right.name));
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
  const groupedItemIds = new Set<string>();
  const groups = classicGroups.map((group) => {
    const groupNameSet = new Set(group.itemNames.map(normalizeName));
    const groupItems = items
      .filter((item) => groupNameSet.has(normalizeName(item.name)))
      .sort((left, right) => {
        const leftIndex = group.itemNames
          .map(normalizeName)
          .indexOf(normalizeName(left.name));
        const rightIndex = group.itemNames
          .map(normalizeName)
          .indexOf(normalizeName(right.name));

        return leftIndex - rightIndex;
      });

    groupItems.forEach((item) => groupedItemIds.add(item.id));

    return {
      ...group,
      items: groupItems,
    };
  });
  const otherItems = items.filter((item) => !groupedItemIds.has(item.id));

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

        {otherItems.length > 0 ? (
          <ClassicDrinkGroup
            beanOptionsByItemId={beanOptionsByItemId}
            items={otherItems}
            title="Other Classics"
          />
        ) : null}
      </div>
    </div>
  );
}
