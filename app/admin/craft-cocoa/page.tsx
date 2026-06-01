import { ProductCrudPage } from "@/src/components/admin/ProductCrudPage";
import { craftCocoaProducts } from "@/src/data/craftCocoa";

export default function AdminCraftCocoaPage() {
  return (
    <ProductCrudPage
      title="Craft Cocoa"
      description="Manage cocoa origins, cocoa latte bases, and active seasonal cocoa options with local mock state."
      initialProducts={craftCocoaProducts}
      defaultProductType="craft_cocoa"
    />
  );
}
