import Link from "next/link";
import type { PassportEntry } from "@/src/types/passport";

const formatDate = (date: string) =>
  new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));

export function RecentExperiences({ entries }: { entries: PassportEntry[] }) {
  return (
    <section className="rounded-[1.25rem] border border-[#3d2618]/10 bg-[#fff8ed]/48 p-6 shadow-[0_14px_42px_rgba(84,55,34,0.08)] backdrop-blur">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#7d4d2f]">
            Recent Experiences
          </p>
          <h2 className="mt-3 text-2xl font-semibold">Cups you collected</h2>
        </div>
        <span className="text-sm font-semibold text-[#7d4d2f]">
          {entries.length}
        </span>
      </div>

      <div className="mt-5 grid gap-3">
        {entries.slice(0, 5).map((entry) => (
          <article
            key={entry.id}
            className="rounded-lg border border-[#3d2618]/10 bg-[#f6efe6]/62 p-4"
          >
            <div className="grid gap-4 sm:grid-cols-[5.5rem_1fr_auto] sm:items-start">
              {entry.imageUrlSnapshot ? (
                <img
                  alt={entry.nameSnapshot}
                  src={entry.imageUrlSnapshot}
                  className="aspect-square w-full rounded-lg border border-[#3d2618]/10 object-cover sm:w-[5.5rem]"
                />
              ) : (
                <div className="hidden aspect-square rounded-lg border border-[#3d2618]/10 bg-[radial-gradient(circle_at_30%_25%,rgba(255,248,237,0.9),transparent_35%),linear-gradient(135deg,#ead9c2,#8f5c39)] sm:block" />
              )}
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7d4d2f]">
                  {entry.categoryName} · {formatDate(entry.triedAt)}
                </p>
                <h3 className="mt-2 text-xl font-semibold">
                  {entry.nameSnapshot}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#5f4635]">
                  {entry.flavorNotes.slice(0, 4).join(", ")}
                </p>
                {entry.note ? (
                  <p className="mt-3 border-l border-[#7d4d2f]/30 pl-4 text-sm leading-6 text-[#5f4635]">
                    {entry.note}
                  </p>
                ) : null}
              </div>
              <Link
                href={`/menu/${entry.categorySlug}/${entry.menuItemSlug}`}
                className="inline-flex min-h-10 items-center justify-center rounded-full border border-[#3d2618]/14 px-4 text-sm font-semibold text-[#5f4635] sm:justify-self-end"
              >
                View
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
