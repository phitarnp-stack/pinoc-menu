import { ProductCrudPage } from "@/src/components/admin/ProductCrudPage";
import { products } from "@/src/data/products";

const coffeeBeans = products.filter(
  (product) => product.productType === "coffee_bean",
);

export default function AdminCoffeeBeanProductsPage() {
  return (
    <ProductCrudPage
      title="Coffee Beans"
      description="Manage House Blend options, seasonal filter beans, and active availability with local mock state."
      initialProducts={coffeeBeans}
      defaultProductType="coffee_bean"
    />
  );
}
