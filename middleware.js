import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { verifySessionToken, ADMIN_COOKIE_NAME } from "@/lib/session";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://lvjatrpupssmpftutkzt.supabase.co";
const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2amF0cnB1cHNzbXBmdHV0a3p0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExNjQ0MTYsImV4cCI6MjA5Njc0MDQxNn0.K_GyXeT1R54M7FFCQgIUx1dPaG2g8vtIzJy0pNeI3kM";

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // --- Admin auth (unchanged) ---
  const isLoginPage = pathname === "/admin/login";
  const isLoginApi = pathname === "/api/admin/login";
  const isProtectedPage = pathname.startsWith("/admin") && !isLoginPage;
  const isProtectedApi = pathname.startsWith("/api/admin") && !isLoginApi;

  if (isProtectedPage || isProtectedApi) {
    const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const session = token ? await verifySessionToken(token) : null;
    if (!session) {
      if (isProtectedApi) {
        return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
      }
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
    return NextResponse.next();
  }

  // --- Customer session refresh (this was missing entirely) ---
  // Supabase access tokens expire after ~1hr. Server Components can read
  // cookies but can't write them, so without this running on every request,
  // the refreshed token never actually gets saved anywhere — the cookie just
  // goes stale and getUser() silently starts returning null, which looks
  // exactly like "I logged in, but it keeps asking me to log in again."
  let response = NextResponse.next({ request: req });
  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return req.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => req.cookies.set(name, value));
        response = NextResponse.next({ request: req });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });
  await supabase.auth.getUser();

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*", "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|webp)$).*)"],
};
