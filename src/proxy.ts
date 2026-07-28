/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, react-hooks/set-state-in-effect */
import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";
import { jwtVerify } from "jose";
import { Redis } from "@upstash/redis";

// Initialize Upstash Redis (Fail gracefully if missing env vars)
const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
const redis =
  redisUrl && redisToken
    ? new Redis({ url: redisUrl, token: redisToken })
    : null;

export default async function proxy(request: NextRequest) {
  // Telemetry Interceptor
  const url = request.nextUrl.pathname;
  const method = request.method;
  let severity = "INFO";
  const status = 200;

  if (method === "DELETE" || method === "PUT") {
    severity = "WARNING";
  }

  if (url.includes("checkout") || url.includes("payment")) {
    severity = "WARNING";
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseKey) {
    const regionHeader = request.headers.get("x-vercel-id");
    const region = regionHeader
      ? regionHeader.split("::")[0].toUpperCase()
      : "EDGE";

    const trace = {
      method,
      endpoint: url,
      status: status,
      latency: Math.floor(Math.random() * 80) + 10,
      region: region,
      severity: severity,
      ip_address:
        request.headers.get("x-forwarded-for")?.split(",")[0] ||
        request.headers.get("x-real-ip") ||
        "127.0.0.1",
    };

    // Helper to log immediately
    const logTrace = (customTrace: any) => {
      fetch(`${supabaseUrl}/rest/v1/ops_network_traces`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          Prefer: "return=minimal",
        },
        body: JSON.stringify(customTrace),
      }).catch(console.error);
    };

    // Active Defense: Upstash Redis IP Blocking
    if (redis) {
      try {
        const isBanned = await redis.sismember("banned_ips", trace.ip_address);
        if (isBanned) {
          logTrace({
            ...trace,
            status: 403,
            is_blocked: true,
            severity: "CRITICAL",
          });
          return new NextResponse(
            "Access Denied: Your IP has been blocked due to suspicious activity.",
            { status: 403 },
          );
        }

        const rateLimitKey = `rate_limit:${trace.ip_address}`;
        const requests = await redis.incr(rateLimitKey);
        if (requests === 1) await redis.expire(rateLimitKey, 60);
        if (requests > 100) {
          logTrace({
            ...trace,
            status: 429,
            is_blocked: true,
            severity: "WARNING",
          });
          return new NextResponse("Too Many Requests", { status: 429 });
        }
      } catch (error) {
        console.error("Redis Error:", error);
      }
    }

    // Normal log
    logTrace(trace);
  }

  // 1. Isolated Developer Operations Firewall
  if (request.nextUrl.pathname.startsWith("/ops")) {
    const sessionCookie = request.cookies.get("ops_session")?.value;

    if (!sessionCookie && request.nextUrl.pathname !== "/ops/login") {
      return NextResponse.redirect(new URL("/ops/login", request.url));
    }

    if (sessionCookie) {
      try {
        const secretKey =
          process.env.DEV_PORTAL_SESSION_SECRET ||
          "fallback-secret-for-development-only-change-in-prod";
        const key = new TextEncoder().encode(secretKey);
        await jwtVerify(sessionCookie, key, {
          algorithms: ["HS256"],
        });

        // If logged in and trying to access login, redirect to ops dashboard
        if (request.nextUrl.pathname === "/ops/login") {
          return NextResponse.redirect(new URL("/ops", request.url));
        }
      } catch (error) {
        // Token is invalid or expired
        if (request.nextUrl.pathname !== "/ops/login") {
          const response = NextResponse.redirect(
            new URL("/ops/login", request.url),
          );
          response.cookies.delete("ops_session");
          return response;
        }
      }
    }

    return NextResponse.next();
  }

  // 2. Client & Atelier (Supabase Auth)
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
