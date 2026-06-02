import type { PassportOriginCollection } from "@/src/types/passport";

export function OriginCollectionGrid({
  origins,
}: {
  origins: PassportOriginCollection[];
}) {
  return (
    <section className="rounded-lg border border-[#3d2618]/12 bg-[#fff8ed]/62 p-6 shadow-[0_18px_48px_rgba(84,55,34,0.12)] backdrop-blur">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#7d4d2f]">
        Origin Collection
      </p>
      <h2 className="mt-3 text-2xl font-semibold">Origins you have met</h2>

      {origins.length > 0 ? (
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {origins.map((origin) => (
            <article
              key={origin.key}
              className="rounded-lg border border-[#3d2618]/10 bg-[#f6efe6]/68 p-4"
            >
              <h3 className="text-lg font-semibold">
                {[origin.origin, origin.region].filter(Boolean).join(", ") ||
                  "Origin story"}
              </h3>
              <p className="mt-2 text-sm leading-6 text-[#5f4635]">
                {origin.count} experience{origin.count === 1 ? "" : "s"} ·{" "}
                {origin.productIds.length} product
                {origin.productIds.length === 1 ? "" : "s"}
              </p>
            </article>
          ))}
        </div>
      ) : (
        <p className="mt-5 text-sm leading-7 text-[#5f4635]">
          Add a cup with linked product details to begin collecting origins.
        </p>
      )}
    </section>
  );
}
