import { ProductCrudPage } from "@/src/components/admin/ProductCrudPage";
import { getProductsByType } from "@/src/lib/menu/repositories";

export const dynamic = "force-dynamic";

export default async function AdminMatchaPage() {
  const matchaProducts = await getProductsByType("matcha");

  return (
    <ProductCrudPage
      title="Matcha"
      description="Manage ceremonial and latte matcha products, flavor notes, and active availability."
      initialProducts={matchaProducts}
      defaultProductType="matcha"
    />
  );
}
