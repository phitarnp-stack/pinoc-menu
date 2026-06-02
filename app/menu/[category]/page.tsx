import { notFound } from "next/navigation";
import { MenuItemsBrowser } from "@/src/components/menu/MenuItemsBrowser";
import { PublicBackLink } from "@/src/components/navigation/PublicBackLink";
import { PublicHeader } from "@/src/components/navigation/PublicHeader";
import {
  getMenuCategories,
  getMenuItemsByCategory,
} from "@/src/lib/menu/repositories";

type CategoryPageProps = {
  params: Promise<{
    category: string;
  }>;
};

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const menuCategories = await getMenuCategories();

  return menuCategories.map((category) => ({
    category: category.slug,
  }));
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: categorySlug } = await params;
  const menuCategories = await getMenuCategories();
  const category = menuCategories.find((item) => item.slug === categorySlug);

  if (!category) {
    notFound();
  }

  const items = await getMenuItemsByCategory(category.id);

  return (
    <main className="min-h-screen bg-[#f6efe6] text-[#241710]">
      <PublicHeader />
      <section className="relative min-h-screen overflow-hidden px-6 py-8 sm:px-10 lg:px-16">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#f9f1e7_0%,#ead9c2_48%,#caa37a_100%)]" />
        <div className="absolute inset-x-6 top-6 h-px bg-[#4a2d1c]/15 sm:inset-x-10 lg:inset-x-16" />

        <div className="relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl flex-col justify-center gap-12 pb-16 pt-36 sm:pb-20 sm:pt-40 lg:pt-32">
          <div className="max-w-2xl">
            <PublicBackLink href="/menu" label="Back to Menu" />

            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#7d4d2f]">
              Tasting path
            </p>

            <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-normal sm:text-5xl lg:text-6xl">
              {category.name}
            </h1>

            <p className="mt-5 max-w-xl text-base leading-8 text-[#5f4635] sm:text-lg">
              {category.description}
            </p>
          </div>

          <MenuItemsBrowser
            itemBaseHref={`/menu/${category.slug}`}
            sections={[
              {
                id: category.id,
                name: category.name,
                items,
              },
            ]}
          />
        </div>
      </section>
    </main>
  );
}
