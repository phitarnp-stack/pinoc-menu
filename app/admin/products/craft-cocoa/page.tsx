import { ProductCrudPage } from "@/src/components/admin/ProductCrudPage";
import { products } from "@/src/data/products";

const craftCocoaProducts = products.filter(
  (product) => product.productType === "craft_cocoa",
);

export default function AdminCraftCocoaProductsPage() {
  return (
    <ProductCrudPage
      title="Craft Cocoa"
      description="Manage cocoa origins, cocoa latte bases, and active craft cocoa products with local mock state."
      initialProducts={craftCocoaProducts}
      defaultProductType="craft_cocoa"
    />
  );
}
