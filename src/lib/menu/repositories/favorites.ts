import { customerFavorites as mockCustomerFavorites } from "@/src/data/customer";
import { createServerSupabaseClient } from "@/src/lib/supabase/server";
import { mapCustomerFavoriteRow } from "./mappers";
import type { CustomerFavorite } from "@/src/types/menu";

export async function getCustomerFavorites(
  customerId: string,
): Promise<CustomerFavorite[]> {
  const supabase = createServerSupabaseClient();

  if (!supabase) {
    return mockCustomerFavorites.filter(
      (favorite) => favorite.customerId === customerId,
    );
  }

  const { data, error } = await supabase
    .from("customer_favorites")
    .select("*")
    .eq("customer_id", customerId)
    .order("created_at", { ascending: false });

  if (error || !data) {
    return mockCustomerFavorites.filter(
      (favorite) => favorite.customerId === customerId,
    );
  }

  return data.map(mapCustomerFavoriteRow);
}
