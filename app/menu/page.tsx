import Link from "next/link";
import { PublicHeader } from "@/src/components/navigation/PublicHeader";
import {
  getMenuCategories,
  getMenuItems,
} from "@/src/lib/menu/repositories";

export const dynamic = "force-dynamic";

const categoryMoods: Record<
  string,
  {
    accent: string;
    icon: string;
    mood: string;
  }
> = {
  "classic-coffee": {
    accent: "from-[#8b5d3b]/18 to-[#fff8ed]/50",
    icon: "☕",
    mood: "Daily ritual",
  },
  "filter-coffee": {
    accent: "from-[#c98f5f]/18 to-[#fff8ed]/50",
    icon: "◌",
    mood: "Discovery",
  },
  matcha: {
    accent: "from-[#7c8f61]/18 to-[#fff8ed]/50",
    icon: "✦",
    mood: "Calm",
  },
  "craft-cocoa": {
    accent: "from-[#6f3f2b]/18 to-[#fff8ed]/50",
    icon: "●",
    mood: "Comfort",
  },
  "cold-brew-japan-traditional": {
    accent: "from-[#516173]/18 to-[#fff8ed]/50",
    icon: "◐",
    mood: "Patience",
  },
  special: {
    accent: "from-[#9a6b39]/18 to-[#fff8ed]/50",
    icon: "◇",
    mood: "Curiosity",
  },
};

export default async function MenuPage() {
  const [menuCategories, menuItems] = await Promise.all([
    getMenuCategories(),
    getMenuItems(),
  ]);

  return (
    <main className="min-h-screen bg-[#f6efe6] text-[#241710]">
      <PublicHeader />
      <section className="relative min-h-screen overflow-hidden px-6 py-8 sm:px-10 lg:px-16">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#f9f1e7_0%,#ead9c2_48%,#caa37a_100%)]" />
        <div className="absolute inset-x-6 top-6 h-px bg-[#4a2d1c]/15 sm:inset-x-10 lg:inset-x-16" />
        <div className="absolute inset-x-6 bottom-6 h-px bg-[#fff8ed]/45 sm:inset-x-10 lg:inset-x-16" />

        <div className="relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl flex-col justify-center gap-10 pb-16 pt-36 sm:pb-20 sm:pt-40 lg:pt-32">
          <div className="max-w-2xl">
            <Link
              href="/"
              className="mb-8 inline-flex text-xs font-semibold uppercase tracking-[0.28em] text-[#7d4d2f] transition hover:text-[#2b1a12] focus:outline-none focus:ring-2 focus:ring-[#7d4d2f] focus:ring-offset-4 focus:ring-offset-[#f6efe6]"
            >
              Pinoc Specialty
            </Link>

            <h1 className="text-4xl font-semibold leading-tight tracking-normal text-[#241710] sm:text-5xl lg:text-6xl">
              Choose your path
            </h1>

            <p className="mt-5 max-w-xl text-base leading-8 text-[#5f4635] sm:text-lg">
              Begin with the feeling you want to keep. Coffee, matcha, cocoa,
              and quiet signatures are arranged as paths into discovery.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:gap-5">
            {menuCategories.map((category) => {
              const itemCount = menuItems.filter(
                (item) => item.categoryId === category.id && item.isActive,
              ).length;
              const mood = categoryMoods[category.slug] ?? {
                accent: "from-[#8b5d3b]/14 to-[#fff8ed]/50",
                icon: "•",
                mood: "Explore",
              };

              return (
                <article
                  key={category.id}
                  className={`group flex min-h-64 flex-col justify-between rounded-lg border border-[#3d2618]/10 bg-gradient-to-br ${mood.accent} p-6 shadow-[0_14px_38px_rgba(84,55,34,0.08)] backdrop-blur transition hover:-translate-y-1 hover:border-[#3d2618]/20 hover:bg-[#fff8ed]/66 sm:p-7`}
                >
                  <div>
                    <div className="mb-6 flex items-center justify-between gap-4">
                      <div className="h-px w-14 bg-[#7d4d2f]/45 transition group-hover:w-20" />
                      <span className="grid h-11 w-11 place-items-center rounded-full border border-[#3d2618]/10 bg-[#fff8ed]/62 text-lg text-[#7d4d2f]">
                        {mood.icon}
                      </span>
                    </div>
                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#7d4d2f]">
                      {mood.mood}
                    </p>
                    <h2 className="text-2xl font-semibold leading-tight text-[#241710]">
                      {category.name}
                    </h2>
                    <p className="mt-4 text-sm leading-7 text-[#5f4635] sm:text-base">
                      {category.description}
                    </p>
                    <p className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-[#7d4d2f]">
                      {itemCount} quiet selections
                    </p>
                  </div>

                  <Link
                    href={
                      category.slug === "special"
                        ? "/special"
                        : `/menu/${category.slug}`
                    }
                    className="mt-8 inline-flex min-h-12 w-full items-center justify-center rounded-full border border-[#3d2618]/14 bg-[#fff8ed]/52 px-6 text-sm font-semibold text-[#2b1a12] transition hover:bg-[#2b1a12] hover:text-[#fff8ed] focus:outline-none focus:ring-2 focus:ring-[#2b1a12] focus:ring-offset-4 focus:ring-offset-[#f6efe6] sm:w-fit"
                  >
                    Explore
                  </Link>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
