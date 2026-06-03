import Link from "next/link";
import { PublicBackLink } from "@/src/components/navigation/PublicBackLink";
import { PublicHeader } from "@/src/components/navigation/PublicHeader";

const paths = [
  {
    href: "/find-your-cup",
    title: "Find Your Cup",
    description: "What should I drink today?",
    mood: "A gentle barista path for the cup that fits this moment.",
    status: "Open",
  },
  {
    href: "/find-yours",
    title: "Find Your Taste",
    description: "What kind of coffee do I naturally enjoy?",
    mood: "A future path for understanding your personal taste over time.",
    status: "Coming Soon",
  },
];

export default function FindYoursPage() {
  return (
    <main className="min-h-screen bg-[#f6efe6] text-[#241710]">
      <PublicHeader />
      <section className="relative min-h-screen overflow-hidden px-6 py-8 sm:px-10 lg:px-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_10%,rgba(255,248,237,0.54),transparent_32%),linear-gradient(135deg,#f9f1e7_0%,#ead9c2_48%,#caa37a_100%)]" />
        <div className="absolute inset-x-6 top-6 h-px bg-[#4a2d1c]/15 sm:inset-x-10 lg:inset-x-16" />

        <div className="relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-5xl flex-col justify-center gap-10 pb-16 pt-36 sm:pb-20 sm:pt-40 lg:pt-32">
          <div className="max-w-2xl">
            <PublicBackLink href="/" label="Back to Home" />
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#7d4d2f]">
              Find Yours
            </p>
            <h1 className="mt-5 text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
              A quieter way to choose.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-8 text-[#5f4635] sm:text-lg">
              Start with today&apos;s mood, or come back later to understand the
              patterns behind the cups you naturally enjoy.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {paths.map((path) => {
              const isComingSoon = path.status === "Coming Soon";

              return (
                <article
                  key={path.title}
                  className="rounded-[1.25rem] border border-[#3d2618]/10 bg-[#fff8ed]/48 p-6 shadow-[0_16px_44px_rgba(84,55,34,0.08)] backdrop-blur sm:p-7"
                >
                  <div className="mb-6 h-px w-14 bg-[#7d4d2f]/42" />
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#7d4d2f]">
                        {path.status}
                      </p>
                      <h2 className="mt-3 text-2xl font-semibold">
                        {path.title}
                      </h2>
                    </div>
                  </div>
                  <p className="mt-4 text-lg font-semibold leading-7 text-[#241710]">
                    {path.description}
                  </p>
                  <p className="mt-3 text-sm leading-7 text-[#5f4635]">
                    {path.mood}
                  </p>
                  {isComingSoon ? (
                    <span className="mt-7 inline-flex min-h-11 items-center justify-center rounded-full border border-[#3d2618]/12 px-5 text-sm font-semibold text-[#8a6a55]">
                      Coming Soon
                    </span>
                  ) : (
                    <Link
                      href={path.href}
                      className="mt-7 inline-flex min-h-11 items-center justify-center rounded-full bg-[#2b1a12] px-5 text-sm font-semibold text-[#fff8ed] transition hover:bg-[#412719]"
                    >
                      Begin
                    </Link>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
