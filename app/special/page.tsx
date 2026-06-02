import { MenuItemsBrowser } from "@/src/components/menu/MenuItemsBrowser";
import { PublicBackLink } from "@/src/components/navigation/PublicBackLink";
import { PublicHeader } from "@/src/components/navigation/PublicHeader";
import {
  getMenuItems,
  getSpecialCategories,
  getSpecialMenuItems,
} from "@/src/lib/menu/repositories";

export const dynamic = "force-dynamic";

export default async function SpecialPage() {
  const [menuItems, specialCategories, specialMenuItems] = await Promise.all([
    getMenuItems(),
    getSpecialCategories(),
    getSpecialMenuItems(),
  ]);

  const sections = specialCategories.map((category) => {
    const items = specialMenuItems
      .filter(
        (specialItem) => specialItem.specialCategoryId === category.id,
      )
      .sort((left, right) => left.sortOrder - right.sortOrder)
      .map((specialItem) =>
        menuItems.find((menuItem) => menuItem.id === specialItem.menuItemId),
      )
      .filter((menuItem) => menuItem !== undefined);

    return {
      id: category.id,
      name: category.name,
      description: category.description,
      items,
    };
  });

  return (
    <main className="min-h-screen bg-[#f6efe6] text-[#241710]">
      <PublicHeader />
      <section className="relative min-h-screen overflow-hidden px-6 py-8 sm:px-10 lg:px-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_8%,rgba(255,248,237,0.52),transparent_30%),linear-gradient(135deg,#f9f1e7_0%,#ead9c2_48%,#caa37a_100%)]" />
        <div className="absolute inset-x-6 top-6 h-px bg-[#4a2d1c]/15 sm:inset-x-10 lg:inset-x-16" />

        <div className="relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl flex-col justify-center gap-10 pb-16 pt-36 sm:pb-20 sm:pt-40 lg:pt-32">
          <div className="max-w-2xl">
            <PublicBackLink href="/menu" label="Back to Menu" />

            <h1 className="text-5xl font-semibold leading-[0.98] tracking-normal sm:text-6xl lg:text-7xl">
              Special Menu
            </h1>
            <p className="mt-7 max-w-xl text-base leading-8 text-[#5f4635] sm:text-lg">
              Seasonal signatures arranged by mood: coffee, non-coffee, and cold
              brew.
            </p>
          </div>

          <MenuItemsBrowser itemBaseHref="/menu/special" sections={sections} />
        </div>
      </section>
    </main>
  );
}
