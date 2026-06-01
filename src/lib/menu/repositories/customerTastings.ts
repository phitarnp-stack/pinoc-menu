import { customerTastings as mockCustomerTastings } from "@/src/data/customer";
import { createServerSupabaseClient } from "@/src/lib/supabase/server";
import { mapCustomerTastingRow } from "./mappers";
import type { CustomerTasting } from "@/src/types/menu";

export async function getCustomerTastings(
  customerId: string,
): Promise<CustomerTasting[]> {
  const supabase = createServerSupabaseClient();

  if (!supabase) {
    return mockCustomerTastings.filter(
      (tasting) => tasting.customerId === customerId,
    );
  }

  const { data, error } = await supabase
    .from("customer_tastings")
    .select("*, customer_tasting_feeling_tags(feeling_tag_id)")
    .eq("customer_id", customerId)
    .order("tasted_at", { ascending: false });

  if (error || !data) {
    return mockCustomerTastings.filter(
      (tasting) => tasting.customerId === customerId,
    );
  }

  return data.map(mapCustomerTastingRow);
}
