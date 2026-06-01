import Link from "next/link";
import { customerTasteProfileScores } from "@/src/data/customer";
import { tasteProfiles } from "@/src/data/tasteProfiles";
import type { CustomerTasteProfileScore, TasteProfile } from "@/src/types/menu";

export default function AccountTasteProfilePage() {
  const scoredProfiles = customerTasteProfileScores
    .map((score) => ({
      score,
      profile: tasteProfiles.find(
        (tasteProfile) => tasteProfile.id === score.tasteProfileId,
      ),
    }))
    .filter(
      (
        entry,
      ): entry is {
        score: CustomerTasteProfileScore;
        profile: TasteProfile;
      } => entry.profile !== undefined,
    )
    .sort((left, right) => right.score.score - left.score.score);

  return (
    <main className="min-h-screen bg-[#f6efe6] text-[#241710]">
      <section className="relative min-h-screen overflow-hidden px-6 py-8 sm:px-10 lg:px-16">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#f9f1e7_0%,#ead9c2_48%,#caa37a_100%)]" />
        <div className="relative z-10 mx-auto w-full max-w-6xl py-16 sm:py-20">
          <Link
            href="/account"
            className="mb-8 inline-flex text-xs font-semibold uppercase tracking-[0.28em] text-[#7d4d2f] transition hover:text-[#2b1a12]"
          >
            Account
          </Link>
          <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
            Taste Profile
          </h1>
          <p className="mt-5 max-w-xl text-base leading-8 text-[#5f4635]">
            A mock snapshot of preferences inferred from saved tastings.
          </p>

          <div className="mt-10 grid gap-4">
            {scoredProfiles.map(({ score, profile }) => (
              <article
                key={score.id}
                className="rounded-lg border border-[#3d2618]/12 bg-[#fff8ed]/62 p-6 shadow-[0_18px_48px_rgba(84,55,34,0.12)] backdrop-blur"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-semibold">{profile.name}</h2>
                    <p className="mt-3 text-sm leading-7 text-[#5f4635]">
                      {profile.description}
                    </p>
                  </div>
                  <p className="text-lg font-semibold text-[#7d4d2f]">
                    {score.score}
                  </p>
                </div>
                <div className="mt-5 h-3 overflow-hidden rounded-full bg-[#3d2618]/10">
                  <div
                    className="h-full rounded-full bg-[#2b1a12]"
                    style={{ width: `${score.score}%` }}
                  />
                </div>
                <p className="mt-3 text-sm text-[#5f4635]">
                  Based on {score.sampleCount} tasting signals.
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
