import { HeroContentForm } from "@/src/components/admin/HeroContentForm";
import {
  getHeroContent,
  getMenuItems,
  getProducts,
} from "@/src/lib/menu/repositories";

export const dynamic = "force-dynamic";

export default async function AdminHeroPage() {
  const [heroContent, products, menuItems] = await Promise.all([
    getHeroContent(),
    getProducts(),
    getMenuItems(),
  ]);
  const specials = menuItems.filter(
    (item) => item.categoryId === "special" && item.isActive,
  );

  return (
    <HeroContentForm
      initialHeroContent={heroContent}
      products={products}
      specials={specials}
    />
  );
}
