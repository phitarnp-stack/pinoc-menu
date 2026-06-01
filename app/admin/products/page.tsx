import Link from "next/link";
import { getProducts } from "@/src/lib/menu/repositories";

const productSections = [
  {
    title: "Coffee Beans",
    href: "/admin/products/coffee-beans",
    type: "coffee_bean",
    description:
      "Manage house blends, seasonal filter beans, and active coffee product availability.",
  },
  {
    title: "Matcha",
    href: "/admin/products/matcha",
    type: "matcha",
    description:
      "Manage ceremonial and latte matcha products, origins, and taste profiles.",
  },
  {
    title: "Craft Cocoa",
    href: "/admin/products/craft-cocoa",
    type: "craft_cocoa",
    description:
      "Manage cocoa origins, cocoa latte bases, and active craft cocoa products.",
  },
];

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await getProducts();

  return (
    <main className="min-h-screen bg-[#f6efe6] text-[#241710]">
      <section className="relative min-h-screen overflow-hidden px-6 py-8 sm:px-10 lg:px-16">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#f9f1e7_0%,#ead9c2_48%,#caa37a_100%)]" />
        <div className="relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl flex-col justify-center gap-10 py-16 sm:py-20">
          <div className="max-w-2xl">
            <Link
              href="/admin"
              className="mb-8 inline-flex text-xs font-semibold uppercase tracking-[0.28em] text-[#7d4d2f] transition hover:text-[#2b1a12]"
            >
              Admin
            </Link>
            <h1 className="text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
              Products
            </h1>
            <p className="mt-5 max-w-xl text-base leading-8 text-[#5f4635] sm:text-lg">
              Manage the product assets behind Pinoc drinks before Supabase is
              connected.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {productSections.map((section) => {
              const count = products.filter(
                (product) => product.productType === section.type,
              ).length;

              return (
                <Link
                  key={section.href}
                  href={section.href}
                  className="group rounded-lg border border-[#3d2618]/12 bg-[#fff8ed]/58 p-6 shadow-[0_18px_48px_rgba(84,55,34,0.12)] backdrop-blur transition hover:-translate-y-1 hover:bg-[#fff8ed]/78 sm:p-7"
                >
                  <div className="mb-6 h-px w-14 bg-[#7d4d2f]/45 transition group-hover:w-20" />
                  <h2 className="text-2xl font-semibold">{section.title}</h2>
                  <p className="mt-4 text-sm leading-7 text-[#5f4635]">
                    {section.description}
                  </p>
                  <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-[#7d4d2f]">
                    {count} products
                  </p>
                  <span className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-[#2b1a12] px-6 text-sm font-semibold text-[#fff8ed]">
                    Open
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
