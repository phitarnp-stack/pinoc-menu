import { products } from "./products";

export const craftCocoaProducts = products.filter(
  (product) => product.productType === "craft_cocoa",
);
