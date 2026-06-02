import { notFound } from "next/navigation";
import { HeroImageFrame } from "@/src/components/media/HeroImageFrame";
import { PublicBackLink } from "@/src/components/navigation/PublicBackLink";
import { PublicHeader } from "@/src/components/navigation/PublicHeader";
import { StampMyCupButton } from "@/src/components/passport/StampMyCupButton";
import {
  getMenuCategories,
  getMenuItemProductsByMenuItemId,
  getMenuItems,
  getProducts,
} from "@/src/lib/menu/repositories";
import { getMenuItemStory } from "@/src/lib/menu/story";
import type { MenuItemProduct, Product } from "@/src/types/menu";

type StampPageProps = {
  params: Promise<{
    code: string;
  }>;
};

export const dynamic = "force-dynamic";

export default async function StampPage({ params }: StampPageProps) {
  const { code } = await params;
  const [menuItems, menuCategories, products] = await Promise.all([
    getMenuItems(),
    getMenuCategories(),
    getProducts(),
  ]);
  const item = menuItems.find((menuItem) => menuItem.id === code);

  if (!item || !item.isActive) {
    notFound();
  }

  const category = menuCategories.find(
    (menuCategory) => menuCategory.id === item.categoryId,
  );

  if (!category) {
    notFound();
  }

  const menuItemProducts = await getMenuItemProductsByMenuItemId(item.id);
  const linkedProducts = menuItemProducts
    .sort((left, right) => left.sortOrder - right.sortOrder)
    .map((mapping) => ({
      mapping,
      product: products.find((product) => product.id === mapping.productId),
    }))
    .filter(
      (entry): entry is { mapping: MenuItemProduct; product: Product } =>
        entry.product !== undefined,
    )
    .map((entry) => entry.product);
  const story = getMenuItemStory(item);

  return (
    <main className="min-h-screen bg-[#f6efe6] text-[#241710]">
      <PublicHeader />
      <section className="relative min-h-screen overflow-hidden px-6 py-8 sm:px-10 lg:px-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_10%,rgba(255,248,237,0.54),transparent_32%),linear-gradient(135deg,#f9f1e7_0%,#ead9c2_48%,#caa37a_100%)]" />
        <div className="absolute inset-x-6 top-6 h-px bg-[#4a2d1c]/15 sm:inset-x-10 lg:inset-x-16" />

        <div className="relative z-10 mx-auto grid w-full max-w-5xl gap-8 pb-16 pt-36 sm:pb-20 sm:pt-40 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:pt-32">
          <div>
            <PublicBackLink
              href={`/menu/${category.slug}/${item.slug}`}
              label="Back to drink story"
            />
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#7d4d2f]">
              QR Stamp
            </p>
            <h1 className="mt-5 text-5xl font-semibold leading-[1.02] tracking-normal sm:text-6xl">
              Stamp this discovery
            </h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-[#5f4635] sm:text-lg">
              Pinoc is confirming this cup as a Verified Discovery. Stamp it in
              My Cup when this drink has been served to you.
            </p>
          </div>

          <article className="rounded-[1.25rem] border border-[#3d2618]/10 bg-[#fff8ed]/48 p-5 shadow-[0_18px_52px_rgba(84,55,34,0.1)] backdrop-blur sm:p-7">
            <HeroImageFrame
              alt={item.name}
              imageUrl={item.imageUrl}
              placeholder={item.imagePlaceholder}
              mode={item.heroContentMode}
              overlayFields={item.overlayFields}
              content={{
                name: item.name,
                tasteNote: item.flavorNotes.slice(0, 3).join(" / "),
                description: item.description,
                storyTitle: story.storyTitle,
                storyDescription: story.storyDescription,
                price: `฿${item.price}`,
                customTitle: item.customOverlayTitle,
                customText: item.customOverlayText,
              }}
              aspectClass="aspect-[4/5]"
              className="rounded-lg"
            />
            <div className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#7d4d2f]">
                {category.name}
              </p>
              <h2 className="mt-3 text-3xl font-semibold">{item.name}</h2>
              <p className="mt-4 text-sm leading-7 text-[#5f4635]">
                {item.description}
              </p>
              <div className="mt-6">
                <StampMyCupButton
                  categoryName={category.name}
                  categorySlug={category.slug}
                  code={code}
                  item={item}
                  linkedProducts={linkedProducts}
                />
              </div>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
