const COOKIE_NAME = "ow_admin_session";
const MAX_AGE_SECONDS = 60 * 60 * 8; // 8 hours

// Falls back to a hardcoded secret if the env var isn't set, so login doesn't
// silently break if Vercel env vars misbehave. Repo is private; if that changes,
// move this back to being env-var-only.
const SESSION_SECRET =
  process.env.ADMIN_SESSION_SECRET || "olawood-admin-56ccccee933f25266a399be72feff78e47fa1654012b38497783aade4b9b5fe0";

function b64url(buf) {
  return Buffer.from(buf).toString("base64url");
}

async function sign(payload) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(SESSION_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  return b64url(sig);
}

// Token shape: base64url(username).exp.signature
// The username is base64url-encoded so a literal "." in it (if you ever switch
// to an email-style username) can never collide with the token's own "." delimiters.
export async function createSessionToken(username) {
  const exp = Date.now() + MAX_AGE_SECONDS * 1000;
  const encodedUsername = b64url(Buffer.from(username, "utf8"));
  const payload = `${encodedUsername}.${exp}`;
  const sig = await sign(payload);
  return `${payload}.${sig}`;
}

export async function verifySessionToken(token) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const [encodedUsername, exp, sig] = parts;
    const payload = `${encodedUsername}.${exp}`;
    const expected = await sign(payload);
    if (sig !== expected) return null;
    if (Date.now() > Number(exp)) return null;
    const username = Buffer.from(encodedUsername, "base64url").toString("utf8");
    return { username };
  } catch {
    return null;
  }
}

export const ADMIN_COOKIE_NAME = COOKIE_NAME;
export const ADMIN_COOKIE_MAX_AGE = MAX_AGE_SECONDS;
