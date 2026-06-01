import Link from "next/link";
import { menuCategories } from "@/src/data/menuCategories";
import { menuItems } from "@/src/data/menuItems";
import { PublicHeader } from "@/src/components/navigation/PublicHeader";

export default function MenuPage() {
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
              Menu Architecture
            </h1>

            <p className="mt-5 max-w-xl text-base leading-8 text-[#5f4635] sm:text-lg">
              Four paths into a specialty coffee experience, shaped by mood,
              craft, and the cup you want to remember.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:gap-5">
            {menuCategories.map((category) => {
              const itemCount = menuItems.filter(
                (item) => item.categoryId === category.id && item.isActive,
              ).length;

              return (
                <article
                  key={category.id}
                  className="group flex min-h-64 flex-col justify-between rounded-lg border border-[#3d2618]/12 bg-[#fff8ed]/58 p-6 shadow-[0_18px_48px_rgba(84,55,34,0.12)] backdrop-blur transition hover:-translate-y-1 hover:border-[#3d2618]/24 hover:bg-[#fff8ed]/78 hover:shadow-[0_24px_58px_rgba(84,55,34,0.18)] sm:p-7"
                >
                  <div>
                    <div className="mb-6 h-px w-14 bg-[#7d4d2f]/45 transition group-hover:w-20" />
                    <h2 className="text-2xl font-semibold leading-tight text-[#241710]">
                      {category.name}
                    </h2>
                    <p className="mt-4 text-sm leading-7 text-[#5f4635] sm:text-base">
                      {category.description}
                    </p>
                    <p className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-[#7d4d2f]">
                      {itemCount} selections
                    </p>
                  </div>

                  <Link
                    href={
                      category.slug === "special"
                        ? "/special"
                        : `/menu/${category.slug}`
                    }
                    className="mt-8 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-[#2b1a12] px-6 text-sm font-semibold text-[#fff8ed] shadow-[0_14px_30px_rgba(43,26,18,0.18)] transition hover:bg-[#412719] focus:outline-none focus:ring-2 focus:ring-[#2b1a12] focus:ring-offset-4 focus:ring-offset-[#f6efe6] sm:w-fit"
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
