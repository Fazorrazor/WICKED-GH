import { Suspense } from "react";
import ProductDetailClient from "@/components/ProductDetailClient";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

export const revalidate = 60; // Cache invalidation every 60 seconds

async function ProductData({ id }: { id: string }) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, categories(name, slug)")
    .eq("id", id)
    .single();

  if (error || !data) {
    console.error("Error fetching product detail:", error);
    notFound();
  }

  return <ProductDetailClient product={data} />;
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;

  return (
    <Suspense
      fallback={
        <div className="w-full h-screen bg-white flex items-center justify-center font-sans uppercase tracking-widest text-xs">
          Loading Piece...
        </div>
      }
    >
      <ProductData id={resolvedParams.id} />
    </Suspense>
  );
}
