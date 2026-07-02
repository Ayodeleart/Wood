import { supabasePublic } from "@/lib/supabasePublic";

export async function getNavCategories() {
  const { data } = await supabasePublic
    .from("categories")
    .select("slug, name")
    .order("sort_order");
  return data || [];
}
