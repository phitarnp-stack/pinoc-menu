import { ProductCrudPage } from "@/src/components/admin/ProductCrudPage";
import { getProductsByType } from "@/src/lib/menu/repositories";

export const dynamic = "force-dynamic";

export default async function AdminCoffeeBeanProductsPage() {
  const coffeeBeans = await getProductsByType("coffee_bean");

  return (
    <ProductCrudPage
      title="Coffee Beans"
      description="Manage House Blend options, seasonal filter beans, and active availability."
      initialProducts={coffeeBeans}
      defaultProductType="coffee_bean"
    />
  );
}
