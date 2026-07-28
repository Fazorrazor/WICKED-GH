"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function login(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    redirect("/account/login?error=Email and password are required");
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirect("/account/login?error=Invalid credentials");
  }

  revalidatePath("/account", "layout");
  redirect("/account");
}

export async function signup(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    redirect("/account/login?error=Email and password are required");
  }

  const { error, data } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
    },
  });

  if (error) {
    console.error("Supabase Auth Signup Error:", error);
    redirect(`/account/login?error=${encodeURIComponent(error.message || "Failed to create account")}`);
  }

  // If session is null, it means email confirmation is required
  if (!data.session) {
    redirect("/account/login?message=Check your email to verify your account.");
  }

  revalidatePath("/account", "layout");
  redirect("/account");
}
