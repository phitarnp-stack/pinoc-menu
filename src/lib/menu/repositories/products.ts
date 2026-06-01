import { products as mockProducts } from "@/src/data/products";
import { createServerSupabaseClient } from "@/src/lib/supabase/server";
import { mapProductRow } from "./mappers";
import type { Product, ProductType } from "@/src/types/menu";

export async function getProducts(): Promise<Product[]> {
  const supabase = createServerSupabaseClient();

  if (!supabase) {
    return mockProducts;
  }

  const { data, error } = await supabase
    .from("products")
    .select("*, product_taste_profiles(taste_profile_id)")
    .order("name");

  if (error || !data) {
    return mockProducts;
  }

  return data.map(mapProductRow);
}

export async function getProductsByType(
  productType: ProductType,
): Promise<Product[]> {
  const products = await getProducts();

  return products.filter((product) => product.productType === productType);
}
