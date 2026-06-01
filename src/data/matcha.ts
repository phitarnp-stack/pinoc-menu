import { products } from "./products";

export const matchaProducts = products.filter(
  (product) => product.productType === "matcha",
);
