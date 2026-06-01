import Link from "next/link";
import { notFound } from "next/navigation";
import { menuCategories } from "@/src/data/menuCategories";
import { menuItemProducts } from "@/src/data/menuItemProducts";
import { menuItems } from "@/src/data/menuItems";
import { products } from "@/src/data/products";
import { MenuItemMemberActions } from "@/src/components/customer/MenuItemMemberActions";
import type { MenuItemProduct, Product } from "@/src/types/menu";

type ItemPageProps = {
  params: Promise<{
    category: string;
    slug: string;
  }>;
};

const formatPrice = (price: number) => `฿${price}`;

export function generateStaticParams() {
  return menuItems.map((item) => {
    const category = menuCategories.find(
      (menuCategory) => menuCategory.id === item.categoryId,
    );

    return {
      category: category?.slug ?? item.categoryId,
      slug: item.slug,
    };
  });
}

export default async function ItemPage({ params }: ItemPageProps) {
  const { category: categorySlug, slug } = await params;
  const category = menuCategories.find((item) => item.slug === categorySlug);

  if (!category) {
    notFound();
  }

  const item = menuItems.find(
    (menuItem) => menuItem.categoryId === category.id && menuItem.slug === slug,
  );

  if (!item) {
    notFound();
  }

  const linkedProducts = menuItemProducts
    .filter(
      (mapping) => mapping.menuItemId === item.id && mapping.isActive,
    )
    .sort((left, right) => left.sortOrder - right.sortOrder)
    .map((mapping) => ({
      mapping,
      product: products.find((product) => product.id === mapping.productId),
    }))
    .filter(
      (entry): entry is { mapping: MenuItemProduct; product: Product } =>
        entry.product !== undefined,
    );

  return (
    <main className="min-h-screen bg-[#f6efe6] text-[#241710]">
      <section className="relative min-h-screen overflow-hidden px-6 py-8 sm:px-10 lg:px-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_8%,rgba(255,248,237,0.52),transparent_30%),linear-gradient(135deg,#f9f1e7_0%,#ead9c2_48%,#caa37a_100%)]" />
        <div className="absolute inset-x-6 top-6 h-px bg-[#4a2d1c]/15 sm:inset-x-10 lg:inset-x-16" />

        <div className="relative z-10 mx-auto w-full max-w-6xl py-16 sm:py-20">
          <div className="grid gap-8 lg:grid-cols-[0.96fr_1.04fr] lg:items-start">
            <div>
              <Link
                href={`/menu/${category.slug}`}
                className="mb-8 inline-flex text-xs font-semibold uppercase tracking-[0.28em] text-[#7d4d2f] transition hover:text-[#2b1a12] focus:outline-none focus:ring-2 focus:ring-[#7d4d2f] focus:ring-offset-4 focus:ring-offset-[#f6efe6]"
              >
                {category.name}
              </Link>

              <p className="mb-5 text-sm font-semibold text-[#7d4d2f]">
                {formatPrice(item.price)}
              </p>
              <h1 className="text-5xl font-semibold leading-[0.98] tracking-normal sm:text-6xl lg:text-7xl">
                {item.name}
              </h1>

              <p className="mt-7 max-w-xl text-base leading-8 text-[#5f4635] sm:text-lg">
                {item.description}
              </p>

              <div className="mt-8 rounded-lg border border-[#3d2618]/12 bg-[#fff8ed]/42 p-5 backdrop-blur">
                <p className="text-sm leading-7 text-[#5f4635]">
                  Guest Mode is always open. Sign in with LINE to save your
                  tasting history when member login is connected.
                </p>
              </div>
            </div>

            <div className="rounded-lg border border-[#3d2618]/12 bg-[#fff8ed]/58 p-6 shadow-[0_24px_58px_rgba(84,55,34,0.16)] backdrop-blur sm:p-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#7d4d2f]">
                Flavor Notes
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {item.flavorNotes.map((note) => (
                  <span
                    key={note}
                    className="rounded-full border border-[#3d2618]/12 bg-[#f6efe6]/75 px-4 py-2 text-sm text-[#5f4635]"
                  >
                    {note}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-8 border-t border-[#3d2618]/10 pt-8">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#7d4d2f]">
                Recommended For
              </p>
              <p className="mt-4 text-base leading-8 text-[#5f4635]">
                {item.recommendedFor}
              </p>
            </div>

            {linkedProducts.length > 0 ? (
              <div className="mt-8 border-t border-[#3d2618]/10 pt-8">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#7d4d2f]">
                  Product Options
                </p>
                <div className="mt-4 grid gap-3">
                  {linkedProducts.map(({ mapping, product }) => (
                    <div
                      key={mapping.id}
                      className="rounded-lg border border-[#3d2618]/10 bg-[#f6efe6]/70 p-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h2 className="font-semibold">{product.name}</h2>
                          <p className="mt-1 text-sm text-[#5f4635]">
                            {product.origin}
                            {product.region ? `, ${product.region}` : ""}
                          </p>
                        </div>
                        {product.roastLevel ? (
                          <span className="rounded-full bg-[#2b1a12] px-3 py-1 text-xs font-semibold text-[#fff8ed]">
                            {product.roastLevel}
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-3 text-sm leading-6 text-[#5f4635]">
                        {product.flavorNotes.join(", ")}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
            </div>
          </div>

          <MenuItemMemberActions item={item} />
        </div>
      </section>
    </main>
  );
}
