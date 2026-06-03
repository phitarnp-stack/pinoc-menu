import { ClassicDrinkRow } from "./ClassicDrinkRow";
import type { MenuItem, Product } from "@/src/types/menu";

type ClassicDrinkGroupProps = {
  beanOptionsByItemId: Map<string, Product[]>;
  items: MenuItem[];
  title: string;
};

export function ClassicDrinkGroup({
  beanOptionsByItemId,
  items,
  title,
}: ClassicDrinkGroupProps) {
  return (
    <section className="rounded-[1.25rem] border border-[#3d2618]/10 bg-[#fff8ed]/48 p-5 shadow-[0_14px_42px_rgba(84,55,34,0.08)] backdrop-blur sm:p-6">
      <h2 className="text-2xl font-semibold">{title}</h2>

      <div className="mt-3">
        {items.map((item) => (
          <ClassicDrinkRow
            key={item.id}
            availableBeans={beanOptionsByItemId.get(item.id) ?? []}
            item={item}
          />
        ))}
      </div>
    </section>
  );
}
