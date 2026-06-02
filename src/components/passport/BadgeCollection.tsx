import { passportBadgeDefinitions } from "@/src/lib/passport/badges";
import type { PassportBadgeAward } from "@/src/types/passport";

const formatDate = (date: string) =>
  new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));

export function BadgeCollection({
  awards,
}: {
  awards: PassportBadgeAward[];
}) {
  const awardsByBadge = new Map(awards.map((award) => [award.badgeId, award]));

  return (
    <section className="rounded-lg border border-[#3d2618]/12 bg-[#fff8ed]/62 p-6 shadow-[0_18px_48px_rgba(84,55,34,0.12)] backdrop-blur">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#7d4d2f]">
        Badge Collection
      </p>
      <h2 className="mt-3 text-2xl font-semibold">Quiet milestones</h2>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {passportBadgeDefinitions.map((badge) => {
          const award = awardsByBadge.get(badge.id);

          return (
            <article
              key={badge.id}
              className={
                award
                  ? "rounded-lg border border-[#3d2618]/12 bg-[#2b1a12] p-4 text-[#fff8ed]"
                  : "rounded-lg border border-[#3d2618]/10 bg-[#f6efe6]/68 p-4 text-[#5f4635]"
              }
            >
              <p
                className={
                  award
                    ? "text-xs font-semibold uppercase tracking-[0.2em] text-[#e7caa7]"
                    : "text-xs font-semibold uppercase tracking-[0.2em] text-[#8a6a55]"
                }
              >
                {award ? `Collected ${formatDate(award.awardedAt)}` : "Open"}
              </p>
              <h3 className="mt-2 text-lg font-semibold">{badge.name}</h3>
              <p
                className={
                  award
                    ? "mt-2 text-sm leading-6 text-[#ead9c2]"
                    : "mt-2 text-sm leading-6 text-[#5f4635]"
                }
              >
                {award ? badge.description : badge.lockedDescription}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
