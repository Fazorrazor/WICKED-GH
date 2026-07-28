import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { Database } from "../database.types";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || "";
  const isValidUrl = supabaseUrl && /^https?:\/\//i.test(supabaseUrl);

  // If Supabase is not configured, pass through without auth check
  if (!isValidUrl) {
    return supabaseResponse;
  }

  const supabase = createServerClient<Database>(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
      },
    },
  });

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with cross-browser cookies.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isStoreManagementRoute = request.nextUrl.pathname.startsWith("/store-management");
  const isStoreManagementLogin = request.nextUrl.pathname === "/store-management/login";
  
  const isCustomerAccountRoute = request.nextUrl.pathname.startsWith("/account");
  const isCustomerLoginRoute = request.nextUrl.pathname === "/account/login";

  if (isStoreManagementRoute && !isStoreManagementLogin && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/store-management/login";
    return NextResponse.redirect(url);
  }

  if (isStoreManagementLogin && user) {
    const url = request.nextUrl.clone();
    url.pathname = "/store-management";
    return NextResponse.redirect(url);
  }

  if (isCustomerAccountRoute && !isCustomerLoginRoute && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/account/login";
    return NextResponse.redirect(url);
  }

  if (isCustomerLoginRoute && user) {
    const url = request.nextUrl.clone();
    url.pathname = "/account";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
