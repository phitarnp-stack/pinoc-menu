import { heroContent as mockHeroContent } from "@/src/data/heroContent";
import { createServerSupabaseClient } from "@/src/lib/supabase/server";
import type { HeroContent } from "@/src/types/menu";
import { mapHeroContentRow } from "./mappers";

export async function getHeroContent(): Promise<HeroContent> {
  const supabase = createServerSupabaseClient();

  if (!supabase) {
    return mockHeroContent;
  }

  const { data, error } = await supabase
    .from("hero_content")
    .select("*")
    .eq("id", "home")
    .maybeSingle();

  if (error || !data) {
    return mockHeroContent;
  }

  return mapHeroContentRow(data);
}
