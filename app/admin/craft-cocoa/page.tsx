import { ProductCrudPage } from "@/src/components/admin/ProductCrudPage";
import { getProductsByType } from "@/src/lib/menu/repositories";

export const dynamic = "force-dynamic";

export default async function AdminCraftCocoaPage() {
  const craftCocoaProducts = await getProductsByType("craft_cocoa");

  return (
    <ProductCrudPage
      title="Craft Cocoa"
      description="Manage cocoa origins, cocoa latte bases, and active seasonal cocoa options with local mock state."
      initialProducts={craftCocoaProducts}
      defaultProductType="craft_cocoa"
    />
  );
}
