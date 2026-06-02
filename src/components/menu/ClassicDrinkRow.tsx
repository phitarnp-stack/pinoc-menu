import type { MenuItem, Product } from "@/src/types/menu";

type ClassicDrinkRowProps = {
  availableBeans: Product[];
  item: MenuItem;
};

const formatPrice = (price: number) => `฿${price}`;

export function ClassicDrinkRow({ availableBeans, item }: ClassicDrinkRowProps) {
  return (
    <article className="border-b border-[#3d2618]/10 py-4 last:border-b-0">
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="text-lg font-semibold leading-tight text-[#241710]">
          {item.name}
        </h3>
        <p className="shrink-0 text-base font-semibold text-[#241710]">
          {formatPrice(item.price)}
        </p>
      </div>

      <div className="mt-3">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8a6a55]">
          Available Beans
        </p>
        {availableBeans.length > 0 ? (
          <div className="mt-2 flex flex-wrap gap-2">
            {availableBeans.map((bean) => (
              <span
                key={bean.id}
                className="rounded-full border border-[#3d2618]/10 bg-[#fff8ed]/60 px-3 py-1 text-xs font-semibold text-[#5f4635]"
              >
                {bean.name}
              </span>
            ))}
          </div>
        ) : (
          <p className="mt-2 text-sm leading-6 text-[#8a6a55]">
            Ask the barista for today&apos;s available beans.
          </p>
        )}
      </div>
    </article>
  );
}
