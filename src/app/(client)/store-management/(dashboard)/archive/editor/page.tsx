import { createClient } from "@/lib/supabase/server";
import EditorClient from "./EditorClient";

export const revalidate = 0;

export default async function EditorPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const resolvedParams = await searchParams;
  const supabase = await createClient();

  let product = null;

  if (resolvedParams.id) {
    const { data } = await supabase
      .from("products")
      .select("*, categories(id, name, slug)")
      .eq("id", resolvedParams.id)
      .single();
    product = data;
  }

  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, slug")
    .order("name", { ascending: true });

  const { data: allProducts } = await supabase
    .from("products")
    .select("id, title, price_cents, image_solo_url, categories(name)")
    .order("created_at", { ascending: false });

  return (
    <EditorClient
      initialProduct={product}
      categories={categories || []}
      allProducts={allProducts || []}
    />
  );
}
