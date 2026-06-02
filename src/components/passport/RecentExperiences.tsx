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
    <section className="rounded-lg border border-[#3d2618]/12 bg-[#fff8ed]/62 p-6 shadow-[0_18px_48px_rgba(84,55,34,0.12)] backdrop-blur">
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
            className="rounded-lg border border-[#3d2618]/10 bg-[#f6efe6]/68 p-4"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
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
                  <p className="mt-3 text-sm leading-6 text-[#5f4635]">
                    &quot;{entry.note}&quot;
                  </p>
                ) : null}
              </div>
              <Link
                href={`/menu/${entry.categorySlug}/${entry.menuItemSlug}`}
                className="inline-flex min-h-10 items-center justify-center rounded-full border border-[#3d2618]/14 px-4 text-sm font-semibold text-[#5f4635]"
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
