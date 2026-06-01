import { products } from "./products";

export const coffeeBeanProducts = products.filter(
  (product) => product.productType === "coffee_bean",
);

export const beans = coffeeBeanProducts;
