import { Suspense } from "react";
import CollectionShowroomClient from "@/components/CollectionShowroomClient";
import { getPublicClient } from "@/lib/supabase/public";

export const revalidate = 60; // Cache invalidation every 60 seconds

async function CollectionProducts() {
  const supabase = getPublicClient();

  if (!supabase) {
    return <div>Store is temporarily unavailable. Please try again shortly.</div>;
  }

  const { data, error } = await supabase
    .from("products")
    .select(
      "id, title, price_cents, image_solo_url, image_worn_url, categories(name, slug)",
    )
    .eq("status", "published");

  if (error) {
    console.error("Error fetching collection products:", error);
    return <div>Failed to load products.</div>;
  }

  return <CollectionShowroomClient initialProducts={data || []} />;
}

export default function CollectionPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full h-screen bg-white flex items-center justify-center font-sans uppercase tracking-widest text-xs">
          Loading Shop...
        </div>
      }
    >
      <CollectionProducts />
    </Suspense>
  );
}
