import Link from "next/link";
import { PublicHeader } from "@/src/components/navigation/PublicHeader";
import { customerFavorites } from "@/src/data/customer";
import { menuCategories } from "@/src/data/menuCategories";
import { menuItems } from "@/src/data/menuItems";
import { products } from "@/src/data/products";

const formatDate = (date: string) =>
  new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));

const formatPrice = (price: number) => `฿${price}`;

export default function AccountFavoritesPage() {
  return (
    <main className="min-h-screen bg-[#f6efe6] text-[#241710]">
      <PublicHeader />
      <section className="relative min-h-screen overflow-hidden px-6 py-8 sm:px-10 lg:px-16">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#f9f1e7_0%,#ead9c2_48%,#caa37a_100%)]" />
        <div className="relative z-10 mx-auto w-full max-w-6xl pb-16 pt-36 sm:pb-20 sm:pt-40 lg:pt-32">
          <Link
            href="/account"
            className="mb-8 inline-flex text-xs font-semibold uppercase tracking-[0.28em] text-[#7d4d2f] transition hover:text-[#2b1a12]"
          >
            Account
          </Link>
          <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
            Favorites
          </h1>
          <p className="mt-5 max-w-xl text-base leading-8 text-[#5f4635]">
            Drinks and products saved in the mock member profile.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {customerFavorites.map((favorite) => {
              const menuItem = menuItems.find(
                (item) => item.id === favorite.menuItemId,
              );
              const product = products.find(
                (item) => item.id === favorite.productId,
              );
              const category = menuCategories.find(
                (item) => item.id === menuItem?.categoryId,
              );

              return (
                <article
                  key={favorite.id}
                  className="rounded-lg border border-[#3d2618]/12 bg-[#fff8ed]/62 p-6 shadow-[0_18px_48px_rgba(84,55,34,0.12)] backdrop-blur"
                >
                  <div className="aspect-[4/3] rounded-lg border border-[#3d2618]/10 bg-[radial-gradient(circle_at_30%_25%,rgba(255,248,237,0.92),transparent_35%),linear-gradient(135deg,#ead9c2,#8f5c39)]" />
                  <p className="mt-5 text-xs font-semibold uppercase tracking-[0.22em] text-[#7d4d2f]">
                    Saved {formatDate(favorite.createdAt)}
                  </p>
                  <h2 className="mt-3 text-2xl font-semibold">
                    {menuItem?.name ?? product?.name ?? "Favorite"}
                  </h2>
                  {menuItem ? (
                    <p className="mt-3 text-sm leading-7 text-[#5f4635]">
                      {menuItem.description}
                    </p>
                  ) : null}
                  <div className="mt-5 flex items-center justify-between gap-4">
                    <p className="text-sm font-semibold text-[#7d4d2f]">
                      {menuItem ? formatPrice(menuItem.price) : ""}
                    </p>
                    {menuItem && category ? (
                      <Link
                        href={`/menu/${category.slug}/${menuItem.slug}`}
                        className="rounded-full bg-[#2b1a12] px-4 py-2 text-sm font-semibold text-[#fff8ed]"
                      >
                        View
                      </Link>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
