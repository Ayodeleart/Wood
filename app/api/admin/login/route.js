import { NextResponse } from "next/server";
import { createSessionToken, ADMIN_COOKIE_NAME, ADMIN_COOKIE_MAX_AGE } from "@/lib/session";

// Hardcoded per explicit request, to unblock login while Vercel env vars weren't
// saving. Repo is private. If you switch back to env vars later, replace these
// two lines with process.env.ADMIN_USERNAME / process.env.ADMIN_PASSWORD.
const ADMIN_USERNAME = "Olawood";
const ADMIN_PASSWORD = "Synergy";

export async function POST(req) {
  const { username, password } = await req.json();

  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Wrong username or password." }, { status: 401 });
  }

  const token = await createSessionToken(username);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: ADMIN_COOKIE_MAX_AGE,
    path: "/",
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE_NAME, "", { maxAge: 0, path: "/" });
  return res;
}
