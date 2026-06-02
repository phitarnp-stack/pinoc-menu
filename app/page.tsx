import Link from "next/link";
import { HeroCard } from "@/src/components/home/HeroCard";
import { PublicHeader } from "@/src/components/navigation/PublicHeader";
import {
  getHeroContent,
  getMenuItems,
  getProducts,
  getSpecialMenuItems,
} from "@/src/lib/menu/repositories";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [heroContent, products, menuItems, specialMappings] =
    await Promise.all([
      getHeroContent(),
      getProducts(),
      getMenuItems(),
      getSpecialMenuItems(),
    ]);

  const featuredProduct =
    products.find((product) => product.id === heroContent.featuredProductId) ??
    products.find((product) => product.status === "active");
  const featuredSpecial =
    menuItems.find((item) => item.id === heroContent.featuredSpecialId) ??
    specialMappings
      .map((mapping) =>
        menuItems.find((menuItem) => menuItem.id === mapping.menuItemId),
      )
      .find((item) => item?.isActive);
  const heroTitle =
    featuredSpecial?.name ?? featuredProduct?.name ?? "Seasonal Beverage Service";
  const heroSubtitle =
    featuredSpecial?.flavorNotes.slice(0, 3).join(" / ") ??
    featuredProduct?.flavorNotes.slice(0, 3).join(" / ") ??
    "Coffee / Matcha / Craft Cocoa";
  const heroDescription =
    heroContent.tastingNote ??
    featuredProduct?.description ??
    "A calm tasting experience across coffee, matcha, craft cocoa, and seasonal specials.";

  return (
    <main className="min-h-screen overflow-hidden bg-[#f6efe6] text-[#241710]">
      <PublicHeader />
      <section className="relative flex min-h-screen items-center px-6 py-8 sm:px-10 lg:px-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(201,155,104,0.34),transparent_34%),linear-gradient(135deg,#f9f1e7_0%,#ead9c2_43%,#b99069_100%)]" />
        <div className="absolute inset-x-6 top-6 h-px bg-[#4a2d1c]/15 sm:inset-x-10 lg:inset-x-16" />
        <div className="absolute inset-x-6 bottom-6 h-px bg-[#fff8ed]/40 sm:inset-x-10 lg:inset-x-16" />

        <div className="pointer-events-none absolute -right-24 top-20 h-72 w-72 rounded-full border border-[#4a2d1c]/10 bg-[#7c4a2b]/10 blur-sm sm:right-4 sm:h-[28rem] sm:w-[28rem]" />
        <div className="pointer-events-none absolute -bottom-24 left-[-7rem] h-80 w-80 rounded-full bg-[#3b2316]/10 blur-3xl" />
        <div className="pointer-events-none absolute right-8 bottom-24 hidden h-44 w-44 rounded-full border border-[#fff8ed]/35 lg:block" />

        <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-12 lg:grid lg:grid-cols-[0.96fr_1.04fr] lg:items-center">
          <div className="max-w-xl pt-36 sm:pt-40 lg:pt-20">
            <p className="mb-6 text-xs font-semibold uppercase tracking-[0.34em] text-[#7d4d2f]">
              Pinoc Specialty
            </p>

            <h1 className="text-5xl font-semibold leading-[0.98] tracking-normal text-[#241710] sm:text-6xl lg:text-7xl">
              {heroContent.title}
            </h1>

            <p className="mt-7 max-w-lg text-base leading-8 text-[#5f4635] sm:text-lg">
              {heroContent.subtitle}
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/menu"
                className="inline-flex min-h-14 items-center justify-center rounded-full bg-[#2b1a12] px-7 text-sm font-semibold text-[#fff8ed] shadow-[0_18px_38px_rgba(43,26,18,0.22)] transition hover:bg-[#412719] focus:outline-none focus:ring-2 focus:ring-[#2b1a12] focus:ring-offset-4 focus:ring-offset-[#f6efe6]"
              >
                Explore Menu
              </Link>
              <Link
                href={heroContent.ctaHref ?? "/find-your-cup"}
                className="inline-flex min-h-14 items-center justify-center rounded-full border border-[#3d2618]/20 bg-[#fff8ed]/55 px-7 text-sm font-semibold text-[#2b1a12] shadow-[0_14px_34px_rgba(84,55,34,0.12)] backdrop-blur transition hover:border-[#3d2618]/35 hover:bg-[#fff8ed]/80 focus:outline-none focus:ring-2 focus:ring-[#7d4d2f] focus:ring-offset-4 focus:ring-offset-[#f6efe6]"
              >
                {heroContent.ctaLabel ?? "Find Your Cup"}
              </Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-sm rounded-[1.5rem] border border-[#fff8ed]/42 bg-[#2b1a12]/82 p-4 shadow-[0_34px_90px_rgba(48,29,17,0.24)] backdrop-blur-md sm:max-w-md sm:p-5 lg:max-w-lg">
            <div className="pointer-events-none absolute -left-8 top-10 h-24 w-24 rounded-full border border-[#ead9c2]/22" />
            <div className="pointer-events-none absolute -right-8 bottom-20 h-32 w-32 rounded-full bg-[#b99069]/18 blur-2xl" />
            <HeroCard
              variant="large"
              badge="Pinoc Tasting"
              title={heroTitle}
              subtitle={heroSubtitle}
              image={heroContent.imageUrl}
              description={heroDescription}
            />

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-[#fff8ed]/16 bg-[#fff8ed]/10 p-4 text-[#fff8ed]">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#e7caa7]">
                  Seasonal
                </p>
                <p className="mt-3 text-sm leading-6 text-[#ead9c2]">
                  {featuredProduct?.name ?? "Rotating origins"}
                </p>
              </div>
              <div className="rounded-lg border border-[#fff8ed]/16 bg-[#fff8ed]/10 p-4 text-[#fff8ed]">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#e7caa7]">
                  Special
                </p>
                <p className="mt-3 text-sm leading-6 text-[#ead9c2]">
                  {featuredSpecial?.name ?? "Signature beverage"}
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-lg border border-[#fff8ed]/16 bg-[#fff8ed]/8 p-4 text-[#fff8ed]">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#e7caa7]">
                Discovery Note
              </p>
              <p className="mt-3 text-sm leading-6 text-[#ead9c2]">
                Fine-dining beverage logic, translated into a cup that feels
                personal rather than technical.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
