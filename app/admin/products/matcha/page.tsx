import { ProductCrudPage } from "@/src/components/admin/ProductCrudPage";
import { products } from "@/src/data/products";

const matchaProducts = products.filter(
  (product) => product.productType === "matcha",
);

export default function AdminMatchaProductsPage() {
  return (
    <ProductCrudPage
      title="Matcha"
      description="Manage ceremonial and latte matcha products, tasting notes, and active availability with local mock state."
      initialProducts={matchaProducts}
      defaultProductType="matcha"
    />
  );
}
