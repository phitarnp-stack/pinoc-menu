import { ProductCrudPage } from "@/src/components/admin/ProductCrudPage";
import { getProductsByType } from "@/src/lib/menu/repositories";

export const dynamic = "force-dynamic";

export default async function AdminMatchaProductsPage() {
  const matchaProducts = await getProductsByType("matcha");

  return (
    <ProductCrudPage
      title="Matcha"
      description="Manage ceremonial and latte matcha products, tasting notes, and active availability with local mock state."
      initialProducts={matchaProducts}
      defaultProductType="matcha"
    />
  );
}
