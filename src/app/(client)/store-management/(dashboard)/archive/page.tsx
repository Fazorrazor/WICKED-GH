import { createClient } from "@/lib/supabase/server";
import ArchiveClient from "./ArchiveClient";

export const revalidate = 0;

export default async function ArchivePage() {
  const supabase = await createClient();

  // Fetch products with their categories
  const { data: products, error: productsError } = await supabase
    .from("products")
    .select("*, categories(id, name, slug)")
    .order("created_at", { ascending: false });

  if (productsError) {
    console.error("Error fetching archive:", productsError);
    return <div>Error loading archive products.</div>;
  }

  // Fetch all categories for filtering
  const { data: categories, error: categoriesError } = await supabase
    .from("categories")
    .select("id, name, slug")
    .order("name", { ascending: true });

  if (categoriesError) {
    console.error("Error fetching categories:", categoriesError);
    return <div>Error loading categories.</div>;
  }

  return (
    <ArchiveClient
      initialProducts={products || []}
      categories={categories || []}
    />
  );
}
