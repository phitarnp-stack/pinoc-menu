import { ProductCrudPage } from "@/src/components/admin/ProductCrudPage";
import { matchaProducts } from "@/src/data/matcha";

export default function AdminMatchaPage() {
  return (
    <ProductCrudPage
      title="Matcha"
      description="Manage ceremonial and latte matcha products, flavor notes, and active availability with local mock state."
      initialProducts={matchaProducts}
      defaultProductType="matcha"
    />
  );
}
