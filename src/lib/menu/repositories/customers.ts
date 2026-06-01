import {
  customerTasteProfileScores as mockCustomerTasteProfileScores,
  feelingTags as mockFeelingTags,
  mockCustomerProfile,
} from "@/src/data/customer";
import { createServerSupabaseClient } from "@/src/lib/supabase/server";
import {
  mapCustomerProfileRow,
  mapCustomerTasteProfileScoreRow,
  mapFeelingTagRow,
} from "./mappers";
import type {
  CustomerProfile,
  CustomerTasteProfileScore,
  FeelingTag,
} from "@/src/types/menu";

export async function getCustomerProfile(
  customerId: string,
): Promise<CustomerProfile> {
  const supabase = createServerSupabaseClient();

  if (!supabase) {
    return mockCustomerProfile;
  }

  const { data, error } = await supabase
    .from("customer_profiles")
    .select("*")
    .eq("id", customerId)
    .maybeSingle();

  if (error || !data) {
    return mockCustomerProfile;
  }

  return mapCustomerProfileRow(data);
}

export async function getFeelingTags(): Promise<FeelingTag[]> {
  const supabase = createServerSupabaseClient();

  if (!supabase) {
    return mockFeelingTags;
  }

  const { data, error } = await supabase
    .from("feeling_tags")
    .select("*")
    .order("sort_order");

  if (error || !data) {
    return mockFeelingTags;
  }

  return data.map(mapFeelingTagRow);
}

export async function getCustomerTasteProfileScores(
  customerId: string,
): Promise<CustomerTasteProfileScore[]> {
  const supabase = createServerSupabaseClient();

  if (!supabase) {
    return mockCustomerTasteProfileScores.filter(
      (score) => score.customerId === customerId,
    );
  }

  const { data, error } = await supabase
    .from("customer_taste_profile_scores")
    .select("*")
    .eq("customer_id", customerId)
    .order("score", { ascending: false });

  if (error || !data) {
    return mockCustomerTasteProfileScores.filter(
      (score) => score.customerId === customerId,
    );
  }

  return data.map(mapCustomerTasteProfileScoreRow);
}
