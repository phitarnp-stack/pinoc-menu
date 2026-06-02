import { PassportDashboard } from "@/src/components/passport/PassportDashboard";
import { PublicBackLink } from "@/src/components/navigation/PublicBackLink";
import { PublicHeader } from "@/src/components/navigation/PublicHeader";

export const dynamic = "force-dynamic";

export default function PassportPage() {
  return (
    <main className="min-h-screen bg-[#f6efe6] text-[#241710]">
      <PublicHeader />
      <section className="relative min-h-screen overflow-hidden px-6 py-8 sm:px-10 lg:px-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_10%,rgba(255,248,237,0.54),transparent_32%),linear-gradient(135deg,#f9f1e7_0%,#ead9c2_48%,#caa37a_100%)]" />
        <div className="absolute inset-x-6 top-6 h-px bg-[#4a2d1c]/15 sm:inset-x-10 lg:inset-x-16" />

        <div className="relative z-10 mx-auto w-full max-w-6xl pb-16 pt-36 sm:pb-20 sm:pt-40 lg:pt-32">
          <div className="mb-10 max-w-3xl">
            <PublicBackLink href="/menu" label="Back to Menu" />
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#7d4d2f]">
              Coffee Passport
            </p>
            <h1 className="mt-5 text-5xl font-semibold leading-[0.98] tracking-normal sm:text-6xl lg:text-7xl">
              Your discovery journal
            </h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-[#5f4635] sm:text-lg">
              A quiet record of cups, origins, flavors, and small milestones
              you have met at Pinoc.
            </p>
          </div>

          <PassportDashboard />
        </div>
      </section>
    </main>
  );
}
