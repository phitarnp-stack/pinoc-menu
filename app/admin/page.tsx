import Link from "next/link";
import {
  getMenuItems,
  getProductsByType,
} from "@/src/lib/menu/repositories";

const adminSections = [
  {
    title: "Products",
    href: "/admin/products",
    description:
      "Manage Coffee Beans, Matcha, and Craft Cocoa as reusable product assets.",
  },
  {
    title: "Coffee Beans",
    href: "/admin/products/coffee-beans",
    description:
      "Prepare monthly seasonal bean updates and House Blend availability.",
  },
  {
    title: "Craft Cocoa",
    href: "/admin/products/craft-cocoa",
    description:
      "Manage premium cocoa bases, cocoa latte profiles, and active seasonal cocoa options.",
  },
  {
    title: "Matcha",
    href: "/admin/products/matcha",
    description:
      "Manage ceremonial and latte matcha products, tasting notes, and availability.",
  },
  {
    title: "Specials",
    href: "/admin/specials",
    description:
      "Manage seasonal coffee, non-coffee, and cold brew signature drinks.",
  },
  {
    title: "Menu Items",
    href: "/admin/menu-items",
    description:
      "Manage customer-facing drinks, category placement, prices, and linked bean options.",
  },
  {
    title: "Taste Profiles",
    href: "/admin/taste-profiles",
    description:
      "Manage recommendation tags used by products, menu items, and future quiz matching.",
  },
];

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [coffeeBeanProducts, craftCocoaProducts, matchaProducts, menuItems] =
    await Promise.all([
      getProductsByType("coffee_bean"),
      getProductsByType("craft_cocoa"),
      getProductsByType("matcha"),
      getMenuItems(),
    ]);

  const activeProducts = [
    ...coffeeBeanProducts,
    ...craftCocoaProducts,
    ...matchaProducts,
  ].filter((product) => product.status === "active").length;
  const rotatingBeans = coffeeBeanProducts.filter((bean) =>
    bean.availableFor.includes("Filter Coffee"),
  ).length;
  const activeMenuItems = menuItems.filter((item) => item.isActive).length;

  return (
    <main className="min-h-screen bg-[#f6efe6] text-[#241710]">
      <section className="relative min-h-screen overflow-hidden px-6 py-8 sm:px-10 lg:px-16">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#f9f1e7_0%,#ead9c2_48%,#caa37a_100%)]" />
        <div className="absolute inset-x-6 top-6 h-px bg-[#4a2d1c]/15 sm:inset-x-10 lg:inset-x-16" />

        <div className="relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl flex-col justify-center gap-10 py-16 sm:py-20">
          <div className="max-w-2xl">
            <Link
              href="/"
              className="mb-8 inline-flex text-xs font-semibold uppercase tracking-[0.28em] text-[#7d4d2f] transition hover:text-[#2b1a12] focus:outline-none focus:ring-2 focus:ring-[#7d4d2f] focus:ring-offset-4 focus:ring-offset-[#f6efe6]"
            >
              Pinoc Specialty
            </Link>
            <h1 className="text-4xl font-semibold leading-tight tracking-normal sm:text-5xl lg:text-6xl">
              Admin Backoffice
            </h1>
            <p className="mt-5 max-w-xl text-base leading-8 text-[#5f4635] sm:text-lg">
              Temporary local control center for monthly menu and bean rotation.
              The structure is ready to connect to Supabase later.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-[#3d2618]/12 bg-[#fff8ed]/58 p-6 shadow-[0_18px_48px_rgba(84,55,34,0.12)] backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#7d4d2f]">
                Active Products
              </p>
              <p className="mt-4 text-4xl font-semibold">{activeProducts}</p>
            </div>
            <div className="rounded-lg border border-[#3d2618]/12 bg-[#fff8ed]/58 p-6 shadow-[0_18px_48px_rgba(84,55,34,0.12)] backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#7d4d2f]">
                Seasonal Beans
              </p>
              <p className="mt-4 text-4xl font-semibold">{rotatingBeans}</p>
            </div>
            <div className="rounded-lg border border-[#3d2618]/12 bg-[#fff8ed]/58 p-6 shadow-[0_18px_48px_rgba(84,55,34,0.12)] backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#7d4d2f]">
                Active Items
              </p>
              <p className="mt-4 text-4xl font-semibold">{activeMenuItems}</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {adminSections.map((section) => (
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
                <span className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-[#2b1a12] px-6 text-sm font-semibold text-[#fff8ed]">
                  Open
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
