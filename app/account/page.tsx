import Link from "next/link";
import {
  customerFavorites,
  customerTasteProfileScores,
  customerTastings,
  mockCustomerProfile,
} from "@/src/data/customer";

const accountLinks = [
  {
    href: "/account/history",
    title: "Tasting History",
    description: "Review every cup and product you have recorded.",
  },
  {
    href: "/account/favorites",
    title: "Favorites",
    description: "See the drinks and products you want to return to.",
  },
  {
    href: "/account/taste-profile",
    title: "Taste Profile",
    description: "Track your preferences as your tasting history grows.",
  },
];

export default function AccountPage() {
  return (
    <main className="min-h-screen bg-[#f6efe6] text-[#241710]">
      <section className="relative min-h-screen overflow-hidden px-6 py-8 sm:px-10 lg:px-16">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#f9f1e7_0%,#ead9c2_48%,#caa37a_100%)]" />
        <div className="relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl flex-col justify-center gap-10 py-16 sm:py-20">
          <div className="max-w-2xl">
            <Link
              href="/menu"
              className="mb-8 inline-flex text-xs font-semibold uppercase tracking-[0.28em] text-[#7d4d2f] transition hover:text-[#2b1a12]"
            >
              Menu
            </Link>
            <h1 className="text-5xl font-semibold leading-[0.98] tracking-normal sm:text-6xl lg:text-7xl">
              {mockCustomerProfile.displayName}
            </h1>
            <p className="mt-7 max-w-xl text-base leading-8 text-[#5f4635] sm:text-lg">
              Mock Member Mode for tasting memory. LINE Login is planned later;
              this profile is local demo data.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-[#3d2618]/12 bg-[#fff8ed]/58 p-6 shadow-[0_18px_48px_rgba(84,55,34,0.12)] backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#7d4d2f]">
                Tastings
              </p>
              <p className="mt-4 text-4xl font-semibold">
                {customerTastings.length}
              </p>
            </div>
            <div className="rounded-lg border border-[#3d2618]/12 bg-[#fff8ed]/58 p-6 shadow-[0_18px_48px_rgba(84,55,34,0.12)] backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#7d4d2f]">
                Favorites
              </p>
              <p className="mt-4 text-4xl font-semibold">
                {customerFavorites.length}
              </p>
            </div>
            <div className="rounded-lg border border-[#3d2618]/12 bg-[#fff8ed]/58 p-6 shadow-[0_18px_48px_rgba(84,55,34,0.12)] backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#7d4d2f]">
                Taste Signals
              </p>
              <p className="mt-4 text-4xl font-semibold">
                {customerTasteProfileScores.length}
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {accountLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group rounded-lg border border-[#3d2618]/12 bg-[#fff8ed]/58 p-6 shadow-[0_18px_48px_rgba(84,55,34,0.12)] backdrop-blur transition hover:-translate-y-1 hover:bg-[#fff8ed]/78 sm:p-7"
              >
                <div className="mb-6 h-px w-14 bg-[#7d4d2f]/45 transition group-hover:w-20" />
                <h2 className="text-2xl font-semibold">{link.title}</h2>
                <p className="mt-4 text-sm leading-7 text-[#5f4635]">
                  {link.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
