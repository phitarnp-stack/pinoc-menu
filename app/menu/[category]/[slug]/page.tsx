import { notFound } from "next/navigation";
import { MenuItemMemberActions } from "@/src/components/customer/MenuItemMemberActions";
import { BilingualLabel } from "@/src/components/language/BilingualLabel";
import { ProductOptionsPanel } from "@/src/components/menu/ProductOptionsPanel";
import { PublicBackLink } from "@/src/components/navigation/PublicBackLink";
import { PublicHeader } from "@/src/components/navigation/PublicHeader";
import { PassportAddButton } from "@/src/components/passport/PassportAddButton";
import {
  getCustomerFavorites,
  getCustomerTastings,
  getFeelingTags,
  getMenuCategories,
  getMenuItemBySlug,
  getMenuItemProductsByMenuItemId,
  getMenuItems,
  getProducts,
} from "@/src/lib/menu/repositories";
import { getMenuItemStory } from "@/src/lib/menu/story";
import type { MenuItemProduct, Product } from "@/src/types/menu";

type ItemPageProps = {
  params: Promise<{
    category: string;
    slug: string;
  }>;
};

const formatPrice = (price: number) => `฿${price}`;

const demoCustomerId = "customer-pinoc-demo";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const [menuItems, menuCategories] = await Promise.all([
    getMenuItems(),
    getMenuCategories(),
  ]);

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
  const menuCategories = await getMenuCategories();
  const category = menuCategories.find((item) => item.slug === categorySlug);

  if (!category) {
    notFound();
  }

  const item = await getMenuItemBySlug(category.id, slug);

  if (!item) {
    notFound();
  }

  const [menuItemProducts, products, customerTastings, customerFavorites, feelingTags] =
    await Promise.all([
      getMenuItemProductsByMenuItemId(item.id),
      getProducts(),
      getCustomerTastings(demoCustomerId),
      getCustomerFavorites(demoCustomerId),
      getFeelingTags(),
    ]);

  const linkedProducts = menuItemProducts
    .sort((left, right) => left.sortOrder - right.sortOrder)
    .map((mapping) => ({
      mapping,
      product: products.find((product) => product.id === mapping.productId),
    }))
    .filter(
      (entry): entry is { mapping: MenuItemProduct; product: Product } =>
        entry.product !== undefined,
    );

  const story = getMenuItemStory(item);

  return (
    <main className="min-h-screen bg-[#f6efe6] text-[#241710]">
      <PublicHeader />
      <section className="relative min-h-screen overflow-hidden px-6 py-8 sm:px-10 lg:px-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_8%,rgba(255,248,237,0.52),transparent_30%),linear-gradient(135deg,#f9f1e7_0%,#ead9c2_48%,#caa37a_100%)]" />
        <div className="absolute inset-x-6 top-6 h-px bg-[#4a2d1c]/15 sm:inset-x-10 lg:inset-x-16" />

        <div className="relative z-10 mx-auto w-full max-w-6xl pb-16 pt-36 sm:pb-20 sm:pt-40 lg:pt-32">
          <div className="grid gap-8 lg:grid-cols-[0.96fr_1.04fr] lg:items-start">
            <div>
              <PublicBackLink
                href={`/menu/${category.slug}`}
                label={`Back to ${category.name}`}
              />

              <h1 className="text-5xl font-semibold leading-[0.98] tracking-normal sm:text-6xl lg:text-7xl">
                {item.name}
              </h1>

              <p className="mt-7 max-w-xl text-base leading-8 text-[#5f4635] sm:text-lg">
                {item.description}
              </p>

              {item.imageUrl ? (
                <img
                  alt={item.name}
                  src={item.imageUrl}
                  className="mt-8 aspect-[4/3] w-full max-w-xl rounded-lg object-cover shadow-[0_24px_58px_rgba(84,55,34,0.16)]"
                />
              ) : null}

              <div className="mt-8 rounded-lg border border-[#3d2618]/12 bg-[#fff8ed]/42 p-5 backdrop-blur">
                <p className="text-sm leading-7 text-[#5f4635]">
                  Guest Mode is always open. LINE login will let you save your
                  tasting history later.
                  <span className="mt-1 block text-xs text-[#8a6a55]">
                    ตอนนี้ดูเมนูได้เลย ไม่ต้องเข้าสู่ระบบ
                  </span>
                </p>
              </div>
            </div>

            <div className="rounded-lg border border-[#3d2618]/12 bg-[#fff8ed]/58 p-6 shadow-[0_24px_58px_rgba(84,55,34,0.16)] backdrop-blur sm:p-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#7d4d2f]">
                  Drink Story
                </p>
                <h2 className="mt-4 text-3xl font-semibold leading-tight">
                  {story.storyTitle}
                </h2>
                <p className="mt-4 text-base leading-8 text-[#5f4635]">
                  {story.storyDescription}
                </p>
              </div>

              <div className="mt-8 border-t border-[#3d2618]/10 pt-8">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#7d4d2f]">
                  <BilingualLabel english="Flavor Journey" thai="เส้นทางรสชาติ" />
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

              <StoryField
                title="Serving Ritual"
                thai="วิธีดื่ม"
                value={story.servingRitual}
              />
              <StoryField
                title="Why We Created It"
                thai="เหตุผลของแก้วนี้"
                value={story.whyWeCreatedIt}
              />

              <div className="mt-8 border-t border-[#3d2618]/10 pt-8">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#7d4d2f]">
                  <BilingualLabel english="Best For" thai="เหมาะกับช่วงเวลา" />
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {story.bestFor.map((bestForItem) => (
                    <span
                      key={bestForItem}
                      className="rounded-full bg-[#2b1a12] px-4 py-2 text-sm font-semibold text-[#fff8ed]"
                    >
                      {bestForItem}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-8 border-t border-[#3d2618]/10 pt-8">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#7d4d2f]">
                  Price
                </p>
                <p className="mt-3 text-3xl font-semibold text-[#241710]">
                  {formatPrice(item.price)}
                </p>
              </div>
            </div>
          </div>

          <PassportAddButton
            item={item}
            categorySlug={category.slug}
            categoryName={category.name}
            linkedProducts={linkedProducts.map((entry) => entry.product)}
          />

          <ProductOptionsPanel linkedProducts={linkedProducts} />

          <MenuItemMemberActions
            item={item}
            customerId={demoCustomerId}
            feelingTags={feelingTags}
            initialFavorites={customerFavorites}
            initialTastings={customerTastings}
          />
        </div>
      </section>
    </main>
  );
}

function StoryField({
  title,
  thai,
  value,
}: {
  title: string;
  thai: string;
  value: string;
}) {
  return (
    <div className="mt-8 border-t border-[#3d2618]/10 pt-8">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#7d4d2f]">
        <BilingualLabel english={title} thai={thai} />
      </p>
      <p className="mt-4 text-base leading-8 text-[#5f4635]">{value}</p>
    </div>
  );
}
