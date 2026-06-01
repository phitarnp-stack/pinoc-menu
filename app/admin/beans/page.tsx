import { ProductCrudPage } from "@/src/components/admin/ProductCrudPage";
import { coffeeBeanProducts } from "@/src/data/beans";

export default function AdminBeansPage() {
  return (
    <ProductCrudPage
      title="Coffee Beans"
      description="Manage House Blend options, seasonal filter beans, and active availability with local mock state."
      initialProducts={coffeeBeanProducts}
      defaultProductType="coffee_bean"
    />
  );
}
