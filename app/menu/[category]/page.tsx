import Link from "next/link";
import { notFound } from "next/navigation";
import { menuCategories } from "@/src/data/menuCategories";
import { menuItems } from "@/src/data/menuItems";
import { MenuItemsBrowser } from "@/src/components/menu/MenuItemsBrowser";
import { PublicHeader } from "@/src/components/navigation/PublicHeader";

type CategoryPageProps = {
  params: Promise<{
    category: string;
  }>;
};

export function generateStaticParams() {
  return menuCategories.map((category) => ({
    category: category.slug,
  }));
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: categorySlug } = await params;
  const category = menuCategories.find((item) => item.slug === categorySlug);

  if (!category) {
    notFound();
  }

  const items = menuItems.filter(
    (item) => item.categoryId === category.id && item.isActive,
  );

  return (
    <main className="min-h-screen bg-[#f6efe6] text-[#241710]">
      <PublicHeader />
      <section className="relative min-h-screen overflow-hidden px-6 py-8 sm:px-10 lg:px-16">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#f9f1e7_0%,#ead9c2_48%,#caa37a_100%)]" />
        <div className="absolute inset-x-6 top-6 h-px bg-[#4a2d1c]/15 sm:inset-x-10 lg:inset-x-16" />

        <div className="relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl flex-col justify-center gap-10 pb-16 pt-36 sm:pb-20 sm:pt-40 lg:pt-32">
          <div className="max-w-2xl">
            <Link
              href="/menu"
              className="mb-8 inline-flex text-xs font-semibold uppercase tracking-[0.28em] text-[#7d4d2f] transition hover:text-[#2b1a12] focus:outline-none focus:ring-2 focus:ring-[#7d4d2f] focus:ring-offset-4 focus:ring-offset-[#f6efe6]"
            >
              Menu
            </Link>

            <h1 className="text-4xl font-semibold leading-tight tracking-normal sm:text-5xl lg:text-6xl">
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
