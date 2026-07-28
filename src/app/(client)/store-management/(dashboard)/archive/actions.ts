"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { withObservability } from "@/lib/ops/server-action";

async function _upsertProduct(productData: any) {
  const supabase = await createClient();

  const isEditing = !!productData.id;

  const dataToSave: any = {
    title: productData.title,
    price_cents: productData.price_cents,
    category_id: productData.category_id,
    image_solo_url: productData.image_solo_url,
    image_worn_url: productData.image_worn_url,
    in_stock: productData.in_stock,
    stock_quantity: productData.stock_quantity,
    sku: productData.sku,
    description: productData.description,
    materials: productData.materials,
    care_instructions: productData.care_instructions,
    our_commitment: productData.our_commitment,
    status: "published", // Assuming active for now
  };

  if (!isEditing) {
    dataToSave.slug = productData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-");
  }

  let response;

  if (isEditing) {
    response = await supabase
      .from("products")
      .update(dataToSave)
      .eq("id", productData.id);
  } else {
    response = await supabase.from("products").insert([dataToSave]);
  }

  if (response.error) {
    throw new Error(`Database error: ${response.error.message}`);
  }

  revalidatePath("/store-management/archive");
  revalidatePath("/collection");

  return { success: true };
}

export const upsertProduct = withObservability("upsertProduct", _upsertProduct);
