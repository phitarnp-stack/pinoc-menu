import Link from "next/link";
import { PublicHeader } from "@/src/components/navigation/PublicHeader";
import { customerTastings, feelingTags } from "@/src/data/customer";
import { menuItems } from "@/src/data/menuItems";
import { products } from "@/src/data/products";

const formatDate = (date: string) =>
  new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));

export default function AccountHistoryPage() {
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
            Tasting History
          </h1>
          <p className="mt-5 max-w-xl text-base leading-8 text-[#5f4635]">
            Mock personal coffee journal for Member Mode.
          </p>

          <div className="mt-10 grid gap-4">
            {customerTastings.map((tasting) => {
              const menuItem = menuItems.find(
                (item) => item.id === tasting.menuItemId,
              );
              const product = products.find(
                (item) => item.id === tasting.productId,
              );
              const tags = feelingTags.filter((tag) =>
                tasting.feelingTagIds.includes(tag.id),
              );

              return (
                <article
                  key={tasting.id}
                  className="rounded-lg border border-[#3d2618]/12 bg-[#fff8ed]/62 p-6 shadow-[0_18px_48px_rgba(84,55,34,0.12)] backdrop-blur"
                >
                  <div className="grid gap-5 lg:grid-cols-[1fr_auto]">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#7d4d2f]">
                        {formatDate(tasting.tastedAt)}
                      </p>
                      <h2 className="mt-3 text-2xl font-semibold">
                        {menuItem?.name ?? product?.name ?? "Recorded tasting"}
                      </h2>
                      {product ? (
                        <p className="mt-2 text-sm text-[#5f4635]">
                          Product: {product.name}
                        </p>
                      ) : null}
                      {tasting.note ? (
                        <p className="mt-4 text-sm leading-7 text-[#5f4635]">
                          {tasting.note}
                        </p>
                      ) : null}
                    </div>
                    <p className="text-lg font-semibold text-[#7d4d2f]">
                      {tasting.rating}/5
                    </p>
                  </div>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <span
                        key={tag.id}
                        className="rounded-full border border-[#3d2618]/12 px-3 py-1 text-xs font-semibold text-[#5f4635]"
                      >
                        {tag.name}
                      </span>
                    ))}
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
