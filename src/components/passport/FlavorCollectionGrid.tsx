import type { PassportFlavorCollection } from "@/src/types/passport";

const sourceLabel: Record<PassportFlavorCollection["source"], string> = {
  flavor_note: "Flavor Note",
  taste_profile: "Taste Profile",
  recommendation_tag: "Discovery Tag",
};

export function FlavorCollectionGrid({
  flavors,
}: {
  flavors: PassportFlavorCollection[];
}) {
  return (
    <section className="rounded-[1.25rem] border border-[#3d2618]/10 bg-[#fff8ed]/48 p-6 shadow-[0_14px_42px_rgba(84,55,34,0.08)] backdrop-blur">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#7d4d2f]">
        Flavor Collection
      </p>
      <h2 className="mt-3 text-2xl font-semibold">Flavors you are noticing</h2>

      {flavors.length > 0 ? (
        <div className="mt-5 flex flex-wrap gap-2">
          {flavors.slice(0, 30).map((flavor) => (
            <span
              key={flavor.key}
              className="rounded-full border border-[#3d2618]/12 bg-[#f6efe6]/75 px-4 py-2 text-sm font-semibold text-[#5f4635]"
            >
              {flavor.label}
              <span className="ml-2 text-xs font-medium text-[#8a6a55]">
                {sourceLabel[flavor.source]} · {flavor.count}
              </span>
            </span>
          ))}
        </div>
      ) : (
        <p className="mt-5 text-sm leading-7 text-[#5f4635]">
          Your flavor collection will grow from notes, profiles, and discovery
          tags as you add cups.
        </p>
      )}
    </section>
  );
}
