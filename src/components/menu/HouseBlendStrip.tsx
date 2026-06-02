import type { Product } from "@/src/types/menu";

type HouseBlendStripProps = {
  houseBlends: Product[];
};

export function HouseBlendStrip({ houseBlends }: HouseBlendStripProps) {
  return (
    <section className="rounded-[1.25rem] border border-[#3d2618]/10 bg-[#fff8ed]/52 p-5 shadow-[0_14px_42px_rgba(84,55,34,0.08)] backdrop-blur sm:p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#7d4d2f]">
            House Blend Focus
          </p>
          <h2 className="mt-2 text-2xl font-semibold">
            Available House Blends
          </h2>
        </div>
        <p className="max-w-sm text-sm leading-6 text-[#5f4635]">
          Choose the drink first, then choose the bean that fits your mood.
        </p>
      </div>

      {houseBlends.length > 0 ? (
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {houseBlends.map((blend) => (
            <article
              key={blend.id}
              className="rounded-lg border border-[#3d2618]/10 bg-[#f6efe6]/58 p-4"
            >
              <p className="text-sm font-semibold text-[#241710]">
                {blend.houseBlendLabel || blend.name}
              </p>
              {blend.houseBlendLabel ? (
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#8a6a55]">
                  {blend.name}
                </p>
              ) : null}
              <p className="mt-2 text-sm leading-6 text-[#5f4635]">
                {blend.flavorNotes.slice(0, 3).join(" • ")}
              </p>
            </article>
          ))}
        </div>
      ) : (
        <p className="mt-5 rounded-lg border border-[#3d2618]/10 bg-[#f6efe6]/58 p-4 text-sm leading-6 text-[#5f4635]">
          No active house blends are available right now.
        </p>
      )}
    </section>
  );
}
