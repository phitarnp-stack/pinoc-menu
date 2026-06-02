import { ProductCrudPage } from "@/src/components/admin/ProductCrudPage";
import { getProductsByType } from "@/src/lib/menu/repositories";

export const dynamic = "force-dynamic";

export default async function AdminCraftCocoaProductsPage() {
  const craftCocoaProducts = await getProductsByType("craft_cocoa");

  return (
    <ProductCrudPage
      title="Craft Cocoa"
      description="Manage cocoa origins, cocoa latte bases, and active craft cocoa products."
      initialProducts={craftCocoaProducts}
      defaultProductType="craft_cocoa"
    />
  );
}
