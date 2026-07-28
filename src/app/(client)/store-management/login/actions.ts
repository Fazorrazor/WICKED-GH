"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function login(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    redirect("/store-management/login?error=Email and password are required");
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirect("/store-management/login?error=Invalid credentials");
  }

  revalidatePath("/store-management", "layout");
  redirect("/store-management");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/store-management/login");
}
